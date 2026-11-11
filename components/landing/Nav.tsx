"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUserRound, ShieldCheck } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { LANG_KEY, type Lang } from "@/lib/i18n";
import { setLangCookie } from "@/lib/lang";
import type { LandingCopy } from "@/lib/landing-i18n";
import { HexLoader } from "@/components/ui/HexLoader";
import { ChatButton, focusRing } from "./ui";

export function Nav({ nav, lang, isAdmin = false }: { nav: LandingCopy["nav"]; lang: Lang; isAdmin?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState<Lang>(lang);
  useEffect(() => setCurrent(lang), [lang]);

  // The page is rendered on the server in the saved language; if the visitor chose another one in the
  // chat (localStorage), bring the cookie in line once and refresh.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if ((saved === "id" || saved === "en") && saved !== lang) {
        setLangCookie(saved);
        startTransition(() => router.refresh());
      }
    } catch {}
  }, [lang, router]);

  function onLang(l: Lang) {
    setCurrent(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
    setLangCookie(l);
    startTransition(() => router.refresh());
  }

  // The bar only gets a shadow once the page has moved under it
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-paper/95 transition-shadow duration-300 ease-soft ${
        scrolled ? "border-lp-line shadow-[0_8px_24px_-16px_rgba(10,26,58,0.35)]" : "border-transparent"
      }`}
    >
      {/* Logo left, links centered, language and chat button right */}
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-center gap-3 px-4 py-2.5 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label={nav.home} className={`flex items-center gap-2.5 justify-self-start rounded-lg ${focusRing}`}>
          <Image src="/Logo-Haltev.webp" alt="" width={40} height={40} priority className="size-9 sm:size-10" />
          <span className="font-display text-lg font-bold tracking-tight">Haltev</span>
        </Link>

        <nav className="hidden items-center justify-center gap-8 text-sm font-medium text-lp-muted md:flex" aria-label="Menu">
          <a href="#program" className={`rounded hover:text-lp-navy ${focusRing}`}>{nav.program}</a>
          <a href="#cara-kerja" className={`rounded hover:text-lp-navy ${focusRing}`}>{nav.how}</a>
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <div className="relative flex rounded-lg border border-lp-line bg-white p-0.5 text-xs font-bold" role="group" aria-label="Language">
            {pending && <HexLoader size={16} className="absolute top-1/2 right-full mr-2 -translate-y-1/2 text-lp-royal" label="Loading" />}
            {(["id", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => onLang(l)}
                aria-pressed={current === l}
                className={`min-w-9 rounded-md px-2 py-1.5 uppercase transition-colors ${focusRing} ${
                  current === l ? "bg-lp-navy text-white" : "text-lp-muted hover:text-lp-navy"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <ChatButton size="sm">
            <span className="sm:hidden">{nav.chatShort}</span>
            <span className="hidden sm:inline">{nav.chat}</span>
          </ChatButton>
          {isAdmin ? (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 rounded-lg border border-lp-royal/30 bg-lp-sky/60 px-2.5 py-1.5 text-xs font-bold text-lp-royal transition-colors hover:bg-lp-sky ${focusRing}`}
            >
              <ShieldCheck size={15} aria-hidden /> {nav.admin}
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 rounded-lg border border-lp-line bg-white px-2.5 py-1.5 text-xs font-bold text-lp-muted">
              <CircleUserRound size={15} aria-hidden /> {nav.guest}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
