"use client";
import ReactMarkdown from "react-markdown";
import { HalviAvatar } from "./HalviAvatar";
import { BotRow } from "./MessageBubble";
import { useChatActions } from "./chat-context";

/**
 * First screen of a new chat: a short brand header, then Halvi greets the visitor like a
 * sales/admin would (intro about Haltev + "what do you need?"), then need-based quick replies.
 * The greeting is static text, so it shows instantly and uses no AI quota.
 */
export function WelcomeScreen({ onPick }: { onPick: (text: string) => void }) {
  const { t } = useChatActions();
  return (
    <div className="flex flex-col gap-5 animate-rise">
      <div className="flex flex-col items-center pt-2 text-center sm:pt-6">
        <HalviAvatar size={72} pulse />
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{t.welcomeTitle}</h1>
        <p className="mt-1 text-xs text-ink-400 sm:text-sm">{t.welcomeSub}</p>
      </div>

      <BotRow>
        <div className="md rounded-2xl rounded-tl-sm border border-ink-700/80 bg-ink-900/90 px-3.5 py-3 text-[15px] leading-relaxed text-ink-100 sm:px-4">
          <ReactMarkdown>{t.welcome}</ReactMarkdown>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {t.suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => onPick(s.text)}
              className="min-h-11 rounded-xl border border-volt-500/30 bg-volt-500/5 px-3.5 py-2.5 text-left text-sm font-medium text-ink-100 transition hover:border-volt-500/70 hover:bg-volt-500/15 active:scale-[0.98]"
            >
              {s.label}
            </button>
          ))}
        </div>
      </BotRow>
    </div>
  );
}
