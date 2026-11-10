"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { HaltevUIMessage } from "@/lib/ai/ui-types";
import { HalviAvatar } from "./HalviAvatar";
import { BatchPickerCard } from "@/components/cards/BatchPickerCard";
import { LeadFormCard } from "@/components/cards/LeadFormCard";
import { InvoiceCard } from "@/components/cards/InvoiceCard";
import { ProofUploadCard } from "@/components/cards/ProofUploadCard";
import { StatusCard } from "@/components/cards/StatusCard";
import { ToolPending } from "@/components/cards/ToolPending";
import { useChatActions } from "./chat-context";
import { cleanAssistantText, cleanUserText } from "@/lib/sanitize";

export function BotRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 animate-rise sm:gap-3">
      <HalviAvatar size={32} />
      <div className="min-w-0 flex-1 space-y-3">{children}</div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <BotRow>
      <div className="inline-flex gap-1.5 rounded-2xl rounded-tl-sm border border-ink-700 bg-ink-900 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-volt-400 animate-blink" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </BotRow>
  );
}

export function MessageBubble({ message, isLatest }: { message: HaltevUIMessage; isLatest: boolean }) {
  const { t } = useChatActions();
  if (message.role === "user") {
    const text = cleanUserText(message.parts.map((p) => (p.type === "text" ? p.text : "")).join(""));
    return (
      <div className="flex justify-end animate-rise">
        <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-gradient-to-br from-royal-500 to-royal-600 px-4 py-2.5 text-[15px] text-white shadow-lg shadow-royal-600/20">
          {text}
        </div>
      </div>
    );
  }

  const blocks = message.parts.map((part, i) => {
    const key = `${message.id}-${i}`;
    if (part.type === "text") {
      const shown = cleanAssistantText(part.text);
      if (!shown) return null;
      return (
        <div key={key} className="md overflow-x-auto break-words rounded-2xl rounded-tl-sm border border-ink-700/80 bg-ink-900/90 px-3.5 py-2.5 sm:px-4 sm:py-3 text-[15px] leading-relaxed text-ink-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ a: (props) => <a {...props} target="_blank" rel="noreferrer" /> }}
          >
            {shown}
          </ReactMarkdown>
        </div>
      );
    }
    if (!part.type.startsWith("tool-") || !("state" in part)) return null;

    if (part.state === "input-streaming" || part.state === "input-available") {
      return <ToolPending key={key} label={t.pending[part.type] ?? t.wait} />;
    }
    if (part.state !== "output-available") return null;
    const out = part.output as Record<string, unknown>;
    if (out && "error" in out) return null; // the model explains errors in text

    switch (part.type) {
      case "tool-list_available_batches":
        return <BatchPickerCard key={key} data={part.output as never} active={isLatest} />;
      case "tool-show_registration_form":
        return <LeadFormCard key={key} data={part.output as never} active={isLatest} />;
      case "tool-create_invoice":
        return <InvoiceCard key={key} data={part.output as never} />;
      case "tool-request_payment_proof":
        return <ProofUploadCard key={key} data={part.output as never} />;
      case "tool-check_invoice_status":
        return <StatusCard key={key} data={part.output as never} />;
      default:
        return null; // search_programs, register_class: shown via the model's text
    }
  });

  if (blocks.every((b) => b == null)) return null;
  return <BotRow>{blocks}</BotRow>;
}
