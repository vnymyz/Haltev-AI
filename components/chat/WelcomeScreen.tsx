"use client";
import { HalviAvatar } from "./HalviAvatar";
import { BotRow } from "./MessageBubble";
import { useChatActions } from "./chat-context";

/** The welcome text only uses paragraphs and **bold**, so a tiny renderer replaces the markdown library here. */
function SimpleMarkdown({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((para, i) => (
        <p key={i}>
          {para.split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
        </p>
      ))}
    </>
  );
}

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
        <HalviAvatar size={72} />
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink-100 sm:text-3xl">{t.welcomeTitle}</h1>
        <p className="mt-1 text-xs text-ink-400 sm:text-sm">{t.welcomeSub}</p>
      </div>

      <BotRow>
        <div className="md rounded-2xl rounded-tl-sm border border-ink-700/80 bg-ink-900/90 px-3.5 py-3 text-[15px] leading-relaxed text-ink-100 sm:px-4">
          <SimpleMarkdown text={t.welcome} />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {t.suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => onPick(s.text)}
              className="min-h-11 rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-left text-sm font-medium text-ink-100 transition hover:border-volt-500/60 hover:bg-volt-500/10 active:scale-[0.98]"
            >
              {s.label}
            </button>
          ))}
        </div>
      </BotRow>
    </div>
  );
}
