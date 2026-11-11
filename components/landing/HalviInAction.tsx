"use client";
import Image from "next/image";
import { useState } from "react";
import type { LandingCopy } from "@/lib/landing-i18n";
import { HALTEV } from "@/lib/constants";
import { focusRing } from "./ui";

/** The product shown by replaying one real conversation. Clicking a step shows that moment of the chat. */
export function HalviInAction({ t }: { t: Pick<LandingCopy, "how" | "mock"> }) {
  const [step, setStep] = useState(0);

  return (
    <section id="cara-kerja" className="border-y border-lp-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="reveal">
          <h2 className="max-w-[16ch] font-display text-3xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
            {t.how.title}
          </h2>

          {/* Numbered because paying really is a sequence */}
          <ol className="mt-8 space-y-2">
            {t.how.steps.map((s, i) => {
              const active = i === step;
              return (
                <li key={s.title}>
                  <button
                    onClick={() => setStep(i)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-start gap-4 rounded-lg border-l-4 py-3 pr-3 pl-4 text-left transition-colors ${focusRing} ${
                      active ? "border-lp-royal bg-lp-sky/60" : "border-transparent hover:bg-paper"
                    }`}
                  >
                    <span className={`mt-0.5 font-display text-xl font-bold ${active ? "text-lp-royal" : "text-lp-muted"}`}>{i + 1}</span>
                    <span>
                      <span className="block text-lg font-semibold">{s.title}</span>
                      <span className="mt-1 block max-w-[44ch] text-[15px] leading-relaxed text-lp-muted">{s.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <MockChat t={t} step={step} />
      </div>
    </section>
  );
}

function Halvi({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <Image src="/Logo-Haltev.webp" alt="" width={28} height={28} className="mt-0.5 size-7 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">{children}</div>
    </div>
  );
}

const bubble = "rounded-2xl rounded-tl-sm border border-ink-700/80 bg-ink-900 px-3.5 py-2.5 text-[14px] leading-relaxed text-ink-100";

function User({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-royal-500 px-3.5 py-2.5 text-[14px] text-white">{children}</div>
    </div>
  );
}

/** A static replica of the real chat (same dark theme as /chat), so visitors see what they will get. */
function MockChat({ t, step }: { t: Pick<LandingCopy, "mock">; step: number }) {
  const m = t.mock;
  return (
    <div className="reveal overflow-hidden rounded-2xl border border-ink-700 bg-ink-950 shadow-[0_24px_60px_-24px_rgba(10,26,58,0.6)]">
      <div className="flex items-center gap-2.5 border-b border-ink-800 bg-ink-900 px-4 py-3">
        <Image src="/Logo-Haltev.webp" alt="" width={28} height={28} className="size-7" />
        <div className="leading-tight">
          <div className="text-sm font-bold text-white">Halvi</div>
          <div className="flex items-center gap-1.5 text-xs text-ink-400">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Online
          </div>
        </div>
      </div>

      <div key={step} className="min-h-[22rem] animate-rise space-y-3 p-4" aria-live="polite">
        {step === 0 && (
          <>
            <User>{m.you1}</User>
            <Halvi>
              <div className={bubble}>{m.halvi1}</div>
              <div className={bubble}>{m.halvi1b}</div>
            </Halvi>
          </>
        )}

        {step === 1 && (
          <Halvi>
            <div className={bubble}>{m.batchIntro}</div>
            <div className="rounded-xl border border-volt-500/40 bg-ink-900 p-3.5 text-[13px] text-ink-300">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-white">{m.batch.name}</span>
                <span className="font-semibold text-white">{m.batch.price}</span>
              </div>
              <div className="mt-2 space-y-1">
                <div>{m.batch.days}</div>
                <div>{m.batch.time}</div>
                <div>{m.batch.mode}</div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-emerald-300">
                <span className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className={`h-1.5 w-3 rounded-full ${i < 2 ? "bg-ink-600" : "bg-emerald-400"}`} />
                  ))}
                </span>
                {m.batch.seats}
              </div>
            </div>
          </Halvi>
        )}

        {step === 2 && (
          <Halvi>
            <div className={bubble}>{m.invoiceIntro}</div>
            <div className="flex gap-3 rounded-xl border border-volt-500/40 bg-ink-900 p-3.5 text-[13px] text-ink-300">
              <div className="min-w-0 flex-1">
                <div className="font-bold break-all text-white">{m.invoice.number}</div>
                <div className="mt-3 text-xs text-ink-400">Total</div>
                <div className="text-xl font-extrabold text-white">{m.invoice.total}</div>
                <div className="mt-3 text-xs text-ink-400">{m.invoice.label}</div>
                <div className="text-xs text-ink-300">
                  {HALTEV.qris.merchant}
                </div>
              </div>
              {/* Blurred on purpose: this is the real Haltev QRIS and must not be scanned from a demo page */}
              <Image
                src={HALTEV.qris.imageWeb}
                alt=""
                width={90}
                height={128}
                aria-hidden="true"
                className="h-32 w-[90px] shrink-0 rounded-md bg-white object-cover blur-[3px]"
              />
            </div>
          </Halvi>
        )}

        {step === 3 && (
          <>
            <User>{m.paid}</User>
            <Halvi>
              <div className={bubble}>{m.proofSent}</div>
              <div className="rounded-xl border border-amber-400/40 bg-ink-900 p-3.5 text-[13px] text-ink-300">
                <div className="rounded-lg border-2 border-dashed border-ink-600 px-3 py-4 text-center text-ink-400">PNG / JPG</div>
                <div className="mt-3 flex items-center gap-2 font-semibold text-volt-300">
                  <span className="size-2 rounded-full bg-volt-400" />
                  {m.pending}
                </div>
              </div>
            </Halvi>
          </>
        )}
      </div>
    </div>
  );
}
