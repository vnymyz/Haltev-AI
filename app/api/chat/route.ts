import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { buildInstructions } from "@/lib/ai/system-prompt";
import { haltevTools } from "@/lib/ai/tools";
import { chatModel, describeAiError, hasAiKey } from "@/lib/ai/model";

export const maxDuration = 60;

// Sent to the client on any AI failure; the UI swaps it for Halvi's offline bubble.
const OFFLINE_CODE = "HALVI_OFFLINE";

export async function POST(req: Request) {
  const { messages, ownerId, chatId, lang }: { messages: UIMessage[]; ownerId?: string; chatId?: string; lang?: string } =
    await req.json();

  if (!ownerId || !chatId) return Response.json({ error: "missing ids" }, { status: 400 });
  if (!hasAiKey()) {
    console.error("[chat] GOOGLE_GENERATIVE_AI_API_KEY is not set");
    return new Response(OFFLINE_CODE, { status: 503 });
  }

  // Keep the request small for the free tier: only the last 30 messages.
  const recent = messages.slice(-30);

  const result = streamText({
    model: chatModel(),
    instructions: buildInstructions(lang === "en" ? "en" : "id"),
    messages: await convertToModelMessages(recent),
    tools: haltevTools({ ownerId, chatId }),
    stopWhen: isStepCount(6),
    temperature: 0.4,
    maxRetries: 1,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onError: (error) => {
        console.error("[chat] AI error:", describeAiError(error), error);
        return OFFLINE_CODE;
      },
    }),
  });
}
