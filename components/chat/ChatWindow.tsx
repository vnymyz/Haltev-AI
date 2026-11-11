"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { RotateCcw } from "lucide-react";
import type { HaltevUIMessage } from "@/lib/ai/ui-types";
import { DICT, type Lang } from "@/lib/i18n";
import { ChatCtx } from "./chat-context";
import { MessageBubble, TypingBubble, BotRow } from "./MessageBubble";
import { Composer } from "./Composer";
import { WelcomeScreen } from "./WelcomeScreen";
import { ScrollToLatest } from "./ScrollToLatest";
import { FindBar } from "./FindBar";
import { useContainerSmoothScroll } from "@/components/ui/useContainerSmoothScroll";

type Props = {
  chatId: string;
  ownerId: string;
  lang: Lang;
  initialMessages: HaltevUIMessage[];
  autoSend?: string;
  findOpen: boolean;
  onFindClose: () => void;
  onSaved: () => void;
};

function titleFrom(messages: HaltevUIMessage[]) {
  const first = messages.find((m) => m.role === "user");
  const text = first?.parts.find((p) => p.type === "text")?.text ?? "";
  return text.length > 48 ? text.slice(0, 48) + "…" : text || null;
}

export function ChatWindow({ chatId, ownerId, lang, initialMessages, autoSend, findOpen, onFindClose, onSaved }: Props) {
  const t = DICT[lang];

  // Language is read at send time, so switching ID/EN applies to the next message.
  const langRef = useRef(lang);
  langRef.current = lang;

  const transport = useMemo(
    () =>
      new DefaultChatTransport<HaltevUIMessage>({
        api: "/api/chat",
        body: () => ({ ownerId, chatId, lang: langRef.current }),
      }),
    [ownerId, chatId],
  );

  const { messages, sendMessage, status, error, regenerate, clearError } = useChat<HaltevUIMessage>({
    id: chatId,
    messages: initialMessages,
    transport,
    onFinish: async ({ messages: all, isError }) => {
      if (isError) return;
      try {
        await fetch(`/api/sessions/${chatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId, messages: all, title: titleFrom(all) }),
        });
        onSaved();
      } catch {
        /* history is best-effort */
      }
    },
  });

  const busy = status === "submitted" || status === "streaming";
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    const msg = text.trim();
    if (!msg || busy) return;
    stick.current = true; // the reader just wrote, so follow the answer
    if (error) clearError();
    sendMessage({ text: msg });
  };

  // A question passed from the landing page (/chat?q=…) is sent once, as the first message
  const autoSent = useRef(false);
  useEffect(() => {
    if (!autoSend || initialMessages.length > 0) return;
    // Sent from a timer so React StrictMode's dev-only mount/unmount/mount cycle cancels the first
    // attempt instead of sending into a chat instance that is about to be discarded.
    const timer = setTimeout(() => {
      if (autoSent.current) return;
      autoSent.current = true;
      sendMessage({ text: autoSend });
    }, 60);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow new content only while the reader is near the bottom; otherwise show the jump button.
  const scrollRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [away, setAway] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  const lenisRef = useContainerSmoothScroll(scrollRef);

  const toBottom = (smooth: boolean) => {
    const el = scrollRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = lenisRef.current;
    if (lenis) {
      // Scroll through Lenis so it stays in step with the wheel smoothing
      lenis.scrollTo(el.scrollHeight - el.clientHeight, { immediate: !smooth || reduce, duration: 0.9 });
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? "smooth" : "auto" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stick.current = distance < 120;
    setAway(distance > 160);
    if (distance <= 160) setHasNew(false);
  };

  // opening a saved chat lands on its latest message (a new chat stays at the top, on the welcome text)
  useEffect(() => {
    if (initialMessages.length === 0) return;
    // Fonts and images settle after the first paint and make the list taller, so try again shortly after.
    toBottom(false);
    const frame = requestAnimationFrame(() => toBottom(false));
    const timer = setTimeout(() => toBottom(false), 250);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    if (stick.current) toBottom(true);
    else setHasNew(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status, error]);

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
  const showTyping = status === "submitted" || (status === "streaming" && messages.at(-1)?.role !== "assistant");

  return (
    <ChatCtx.Provider value={{ ownerId, send, busy, messages, lang, t }}>
      <div className="relative flex min-h-0 flex-1 flex-col">
      {findOpen && <FindBar root={scrollRef} t={t} version={messages} onClose={onFindClose} />}
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 pt-5 pb-6 sm:gap-5 sm:px-4 sm:pt-6 md:px-6">
          {messages.length === 0 ? (
            <WelcomeScreen onPick={send} />
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} isLatest={m.id === lastAssistantId} />)
          )}

          {showTyping && <TypingBubble />}

          {error && (
            <BotRow>
              <div className="rounded-2xl rounded-tl-sm border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                {t.offline}
                <button
                  onClick={() => {
                    clearError();
                    regenerate();
                  }}
                  className="mt-2 flex items-center gap-1.5 py-1 text-xs font-semibold text-amber-200 hover:text-ink-100"
                >
                  <RotateCcw size={13} /> {t.retry}
                </button>
              </div>
            </BotRow>
          )}
        </div>
      </div>
      <ScrollToLatest visible={away} hasNew={hasNew} label={t.jumpLatest} onClick={() => { stick.current = true; toBottom(true); }} />
      </div>

      <Composer
        value={draft}
        onChange={setDraft}
        onSend={() => {
          send(draft);
          setDraft("");
        }}
      />
    </ChatCtx.Provider>
  );
}
