"use client";
import { HALTEV } from "@/lib/constants";
import type { Dict } from "@/lib/i18n";

/** Floating "Need help?" button that opens a WhatsApp chat with Haltev admin. */
export function HelpButton({ t }: { t: Dict }) {
  const href = waHref(t);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${t.needHelp} WhatsApp ${HALTEV.whatsapp}`}
      title={`WhatsApp ${HALTEV.whatsapp}`}
      // Desktop (lg+) only: bottom-right corner beside the centered message box.
      // Phones/tablets use the header icon + drawer button instead (see ChatApp).
      className="group fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-30 hidden items-center gap-2 lg:flex"
    >
      <span className="rounded-full border border-emerald-400/30 bg-ink-900/95 px-3 py-1.5 text-xs font-semibold text-emerald-200 shadow-lg backdrop-blur transition group-hover:border-emerald-400/60 group-hover:text-ink-100">
        {t.needHelp}
      </span>
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-lp-navy/25 transition group-hover:scale-105 group-active:scale-95">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
        <WhatsAppIcon />
      </span>
    </a>
  );
}

export function waHref(t: Dict) {
  return `${HALTEV.whatsappLink}?text=${encodeURIComponent(t.waPrefill)}`;
}

export function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true" className="relative">
      <path d="M16.04 3C9.08 3 3.43 8.6 3.43 15.5c0 2.2.58 4.35 1.69 6.24L3.33 28.5l6.97-1.8a12.7 12.7 0 0 0 5.74 1.38h.01c6.95 0 12.61-5.6 12.61-12.5S23 3 16.04 3Zm0 22.86h-.01a10.5 10.5 0 0 1-5.33-1.45l-.38-.23-4.14 1.07 1.1-4-.25-.4a10.3 10.3 0 0 1-1.6-5.53c0-5.73 4.7-10.4 10.6-10.4 2.83 0 5.49 1.09 7.49 3.07a10.27 10.27 0 0 1 3.1 7.35c0 5.73-4.71 10.4-10.58 10.4Zm5.8-7.79c-.32-.16-1.88-.92-2.17-1.03-.29-.1-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.19.21-.37.23-.69.08-.32-.16-1.34-.49-2.55-1.56-.94-.84-1.58-1.87-1.76-2.18-.19-.32-.02-.49.14-.64.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.55-.08-.16-.71-1.7-.98-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.07-1.1 2.62 0 1.55 1.13 3.04 1.29 3.25.16.21 2.22 3.37 5.38 4.72.75.32 1.34.52 1.8.66.75.24 1.44.2 1.98.12.6-.09 1.88-.76 2.14-1.5.27-.74.27-1.37.19-1.5-.08-.14-.29-.22-.61-.37Z" />
    </svg>
  );
}
