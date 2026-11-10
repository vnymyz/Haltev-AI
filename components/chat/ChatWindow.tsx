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

type Props = {
  chatId: string;
  ownerId: string;
  lang: Lang;
  initialMessages: HaltevUIMessage[];
  onSaved: () => void;
};

function titleFrom(messages: HaltevUIMessage[]) {
  const first = messages.find((m) => m.role === "user");
  const text = first?.parts.find((p) => p.type === "text")?.text ?? "";
  return text.length > 48 ? text.slice(0, 48) + "…" : text || null;
}

export function ChatWindow({ chatId, ownerId, lang, initialMessages, onSaved }: Props) {
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
    if (error) clearError();
    sendMessage({ text: msg });
  };

  // Auto-scroll to the newest message
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status, error]);

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
  const showTyping = status === "submitted" || (status === "streaming" && messages.at(-1)?.role !== "assistant");

  return (
    <ChatCtx.Provider value={{ ownerId, send, busy, messages, lang, t }}>
      <div className="flex-1 overflow-y-auto overscroll-contain">
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
                  className="mt-2 flex items-center gap-1.5 py-1 text-xs font-semibold text-amber-200 hover:text-white"
                >
                  <RotateCcw size={13} /> {t.retry}
                </button>
              </div>
            </BotRow>
          )}
          <div ref={endRef} />
        </div>
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
