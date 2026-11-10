import "server-only";
import { createGoogle } from "@ai-sdk/google";
import { APICallError } from "ai";
import type { LanguageModelV4 } from "@ai-sdk/provider";

/**
 * Free-tier Gemini has small per-model DAILY quotas (e.g. 20 requests/day for gemini-3.5-flash).
 * Each model has its own quota, so we chain several: when one returns 429 we switch to the next
 * and skip the exhausted one for a while. Override the order with GEMINI_MODELS (comma separated).
 */
const DEFAULT_CHAIN = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3-flash-preview", "gemini-3.1-flash-lite-preview"];

export const MODEL_CHAIN = (process.env.GEMINI_MODELS || process.env.GEMINI_MODEL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (MODEL_CHAIN.length === 0) MODEL_CHAIN.push(...DEFAULT_CHAIN);
else if (!process.env.GEMINI_MODELS) MODEL_CHAIN.push(...DEFAULT_CHAIN.filter((m) => !MODEL_CHAIN.includes(m)));

export function hasAiKey() {
  return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

const google = createGoogle({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

// modelId → timestamp until which we skip it (in-memory, per server process)
const cooldownUntil = new Map<string, number>();
const COOLDOWN_MS = 10 * 60 * 1000;

function isQuotaError(e: unknown) {
  if (APICallError.isInstance(e)) {
    return e.statusCode === 429 || /quota|RESOURCE_EXHAUSTED|rate/i.test(e.message);
  }
  return /quota|RESOURCE_EXHAUSTED|429/i.test(String((e as Error)?.message ?? e));
}

function isUnavailable(e: unknown) {
  return APICallError.isInstance(e) && (e.statusCode === 404 || (e.statusCode ?? 0) >= 500);
}

/** A LanguageModel that tries each Gemini model in order until one accepts the request. */
function fallbackModel(chain: string[]): LanguageModelV4 {
  const models = chain.map((id) => google(id) as unknown as LanguageModelV4);

  async function attempt<T>(run: (m: LanguageModelV4) => PromiseLike<T>): Promise<T> {
    const now = Date.now();
    const ready = models.filter((m) => (cooldownUntil.get(m.modelId) ?? 0) <= now);
    const order = ready.length ? ready : models; // all cooling down → try anyway
    let lastError: unknown;
    for (const m of order) {
      try {
        return await run(m);
      } catch (e) {
        lastError = e;
        if (isQuotaError(e) || isUnavailable(e)) {
          cooldownUntil.set(m.modelId, Date.now() + COOLDOWN_MS);
          console.warn(`[ai] ${m.modelId} unavailable (${isQuotaError(e) ? "quota" : "error"}), trying next model`);
          continue;
        }
        throw e; // real errors (bad request, bad key) are not retried
      }
    }
    throw lastError;
  }

  const first = models[0];
  return {
    specificationVersion: "v4",
    provider: first.provider,
    modelId: `fallback(${chain.join(",")})`,
    supportedUrls: first.supportedUrls,
    doGenerate: (options) => attempt((m) => m.doGenerate(options)),
    doStream: (options) => attempt((m) => m.doStream(options)),
  };
}

export const chatModel = () => fallbackModel(MODEL_CHAIN);
export const visionModel = () =>
  fallbackModel(process.env.GEMINI_VISION_MODEL ? [process.env.GEMINI_VISION_MODEL, ...MODEL_CHAIN] : MODEL_CHAIN);

/** Short machine-readable reason for logs. Users always see the friendly offline message. */
export function describeAiError(error: unknown): string {
  const e = error as { statusCode?: number; message?: string; name?: string };
  if (isQuotaError(error)) return "quota_or_rate_limit (all models)";
  if (e?.statusCode && e.statusCode >= 500) return "provider_down";
  if (e?.statusCode === 401 || e?.statusCode === 403 || /api key/i.test(e?.message ?? "")) return "bad_api_key";
  return e?.name ?? "unknown";
}
