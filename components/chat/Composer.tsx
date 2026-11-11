"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { HexLoader } from "@/components/ui/HexLoader";
import { findLatestInvoice, useChatActions } from "./chat-context";
import { uploadProof } from "./upload";

type Props = { value: string; onChange: (v: string) => void; onSend: () => void };

export function Composer({ value, onChange, onSend }: Props) {
  const { busy, messages, ownerId, send, t, lang } = useChatActions();
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [uploading, setUploading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  // Grow the textarea with its content (up to max-h)
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const inv = findLatestInvoice(messages);
    if (!inv) {
      setHint(t.noInvoiceYet);
      return;
    }
    setUploading(true);
    setHint(null);
    const res = await uploadProof(file, inv.id, ownerId, lang);
    setUploading(false);
    if (!res.ok) return setHint(res.error);
    send(t.proofMsg(res.invoiceNumber));
  }

  return (
    <div className="border-t border-ink-800/80 bg-ink-950/80 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-4 sm:pt-3 md:px-6">
      <div className="mx-auto max-w-3xl">
        {hint && <p className="mb-2 text-xs text-amber-200">{hint}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="flex items-end gap-1.5 rounded-2xl border border-ink-700 bg-ink-900 p-1.5 transition focus-within:border-volt-500/70 focus-within:shadow-[0_0_0_3px_rgba(30,99,224,0.14)] sm:gap-2 sm:p-2"
        >
          <button
            type="button"
            title={t.uploadProof}
            aria-label={t.uploadProof}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-xl p-2.5 text-ink-400 transition hover:bg-ink-800 hover:text-volt-300 disabled:opacity-50"
          >
            {uploading ? <HexLoader size={22} className="text-volt-500" label="Uploading" /> : <Paperclip size={20} />}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {/* text-base (16px) prevents iOS Safari from zooming in on focus */}
          <textarea
            ref={areaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              // Enter sends on desktop; on touch keyboards Enter makes a new line
              const touch = window.matchMedia("(pointer: coarse)").matches;
              if (e.key === "Enter" && !e.shiftKey && !touch && !e.nativeEvent.isComposing) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={1}
            enterKeyHint="send"
            placeholder={t.placeholder}
            className="max-h-36 min-h-[44px] flex-1 resize-none bg-transparent px-1 py-2.5 text-base text-ink-100 placeholder:text-ink-400 focus:outline-none sm:text-[15px]"
          />
          <button
            type="submit"
            disabled={busy || !value.trim()}
            className="rounded-xl bg-volt-500 p-2.5 text-white transition hover:bg-volt-400 disabled:bg-ink-700 disabled:text-ink-400"
            aria-label={t.send}
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-ink-400">{t.disclaimer}</p>
      </div>
    </div>
  );
}
