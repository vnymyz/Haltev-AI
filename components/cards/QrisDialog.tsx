"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Download, X } from "lucide-react";
import { HALTEV } from "@/lib/constants";
import { rupiah } from "@/lib/format";
import type { Dict } from "@/lib/i18n";

/**
 * The QRIS as a popup over a slightly dark backdrop. It is rendered into <body> (a portal), because a chat
 * message has a CSS transform that would otherwise trap a fixed overlay inside the message.
 * Esc, the X button, the Tutup button and a click on the backdrop all close it.
 */
export function QrisDialog({ open, onClose, amount, t }: { open: boolean; onClose: () => void; amount: number; t: Dict }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // keep the page behind from scrolling
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/45 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qris-title"
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-sm animate-rise rounded-2xl bg-white p-5 text-lp-navy shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="qris-title" className="text-lg font-bold">
            {t.payQris}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t.close}
            className="rounded-full p-2 text-lp-muted transition-colors hover:bg-slate-100 hover:text-lp-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-royal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-lp-line bg-white p-1.5">
          <Image
            src={HALTEV.qris.imageWeb}
            alt="QRIS Haltev"
            width={722}
            height={1024}
            className="mx-auto h-auto max-h-[52dvh] w-auto max-w-full"
          />
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm text-lp-muted">{t.payExact}</div>
          <div className="font-display text-2xl font-extrabold">{rupiah(amount)}</div>
          <div className="mt-1 text-xs text-lp-muted">
            {HALTEV.qris.merchant}, NMID {HALTEV.qris.nmid}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={HALTEV.qris.image}
            download="QRIS-Haltev.png"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-lp-royal px-4 text-sm font-semibold text-white transition-colors hover:bg-lp-royal-deep"
          >
            <Download size={16} /> {t.download}
          </a>
          <button
            onClick={onClose}
            className="min-h-11 rounded-xl border border-lp-line px-4 text-sm font-semibold transition-colors hover:bg-slate-50"
          >
            {t.close}
          </button>
        </div>

        <p className="mt-4 border-t border-lp-line pt-3 text-xs leading-snug text-lp-muted">
          {t.orTransfer} {HALTEV.bank.name} <b className="text-lp-navy">{HALTEV.bank.account}</b> a.n. {HALTEV.bank.holder}.
        </p>
      </div>
    </div>,
    document.body,
  );
}
