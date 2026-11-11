"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronUp, CircleUserRound, LayoutDashboard, LogIn, LogOut, Lock, ShieldCheck } from "lucide-react";
import type { Dict } from "@/lib/i18n";

/**
 * Bottom-of-sidebar account card. Visitors are guests, identified by an anonymous browser id (the
 * "Sign in" row is a disabled placeholder). Someone logged in to the admin dashboard sees "Admin" instead,
 * with a shortcut to the dashboard and a log-out button.
 */
export function GuestCard({
  t,
  ownerId,
  isAdmin = false,
  logoutAction,
}: {
  t: Dict;
  ownerId: string | null;
  isAdmin?: boolean;
  logoutAction?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const guestNo = ownerId ? ownerId.replace(/-/g, "").slice(0, 4).toUpperCase() : "····";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menuItem =
    "flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-ink-100 transition-colors hover:bg-ink-800";

  return (
    <div ref={ref} className="relative border-t border-ink-800 p-2">
      {open && (
        <div
          role="menu"
          className="absolute right-2 bottom-[calc(100%-0.25rem)] left-2 z-10 animate-rise overflow-hidden rounded-xl border border-ink-700 bg-ink-850 p-1.5 shadow-[0_12px_32px_-12px_rgba(10,26,58,0.28)]"
        >
          {isAdmin ? (
            <>
              <div className="px-3 pt-2 pb-2">
                <p className="text-xs leading-relaxed text-ink-400">{t.adminNote}</p>
              </div>
              <Link href="/admin" role="menuitem" className={menuItem}>
                <LayoutDashboard size={16} /> {t.adminLink}
              </Link>
              {logoutAction && (
                <form action={logoutAction}>
                  <button role="menuitem" className={menuItem}>
                    <LogOut size={16} /> {t.logout}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="px-3 pt-2 pb-2.5">
                <div className="text-xs font-semibold text-ink-400">{t.guestId}</div>
                <div className="mt-0.5 font-mono text-sm text-ink-100">#{guestNo}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{t.guestNote}</p>
              </div>
              <button
                role="menuitem"
                disabled
                className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-ink-400"
              >
                <LogIn size={16} />
                <span className="flex-1">{t.signIn}</span>
                <span className="flex items-center gap-1 rounded-full bg-ink-800 px-2 py-0.5 text-[10px] font-semibold text-ink-300">
                  <Lock size={10} /> {t.soon}
                </span>
              </button>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${open ? "bg-ink-800" : "hover:bg-ink-850"}`}
      >
        <span
          className={`relative flex size-9 shrink-0 items-center justify-center rounded-full border ${
            isAdmin ? "border-volt-500/50 bg-volt-500/10 text-volt-400" : "border-ink-600 bg-ink-800 text-volt-300"
          }`}
        >
          {isAdmin ? <ShieldCheck size={19} /> : <CircleUserRound size={20} />}
          <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-ink-900 bg-emerald-400" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-semibold text-ink-100">
            {isAdmin ? (
              t.adminName
            ) : (
              <>
                {t.guestName} <span className="font-mono text-xs font-normal text-ink-400">#{guestNo}</span>
              </>
            )}
          </span>
          <span className="block truncate text-xs text-ink-400">{isAdmin ? t.adminSub : t.guestSub}</span>
        </span>
        <ChevronUp size={16} className={`shrink-0 text-ink-400 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
    </div>
  );
}
