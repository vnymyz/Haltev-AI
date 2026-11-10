"use client";
import { createContext, useContext } from "react";
import type { HaltevUIMessage } from "@/lib/ai/ui-types";
import type { Dict, Lang } from "@/lib/i18n";

export type ChatActions = {
  ownerId: string;
  send: (text: string) => void;
  busy: boolean;
  messages: HaltevUIMessage[];
  lang: Lang;
  t: Dict;
};

export const ChatCtx = createContext<ChatActions | null>(null);

export function useChatActions() {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChatActions outside ChatCtx");
  return ctx;
}

/** Latest invoice created/requested in this conversation (used by the 📎 button). */
export function findLatestInvoice(messages: HaltevUIMessage[]) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const parts = messages[i].parts;
    for (let j = parts.length - 1; j >= 0; j--) {
      const p = parts[j];
      if (
        (p.type === "tool-create_invoice" || p.type === "tool-request_payment_proof") &&
        p.state === "output-available" &&
        !("error" in p.output)
      ) {
        return { id: p.output.invoice.id, number: p.output.invoice.number, amount: p.output.invoice.amount };
      }
    }
  }
  return null;
}
