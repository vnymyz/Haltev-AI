"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, House, LogOut, Menu, X } from "lucide-react";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const NAV = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/leads", label: "Lead" },
  { href: "/admin/payments", label: "Pembayaran" },
  { href: "/admin/batches", label: "Batch dan tutor" },
] as const;

export function AdminShell({
  pending,
  logout,
  children,
}: {
  pending: number;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  const links = (
    <nav className="space-y-1" aria-label="Menu admin">
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={isActive(n.href) ? "page" : undefined}
          className={`flex min-h-11 items-center justify-between rounded-lg px-3 text-[15px] font-medium transition-colors duration-200 ease-soft ${
            isActive(n.href) ? "bg-ink-800 text-ink-100" : "text-ink-300 hover:bg-ink-850 hover:text-ink-100"
          }`}
        >
          {n.label}
          {n.href === "/admin/payments" && pending > 0 && (
            <span className="rounded-full bg-volt-500 px-2 py-0.5 text-xs font-bold text-white" aria-label={`${pending} menunggu dicek`}>
              {pending}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );

  const bottom = (
    <div className="space-y-1">
      <Link href="/" target="_blank" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-[15px] text-ink-300 transition-colors hover:bg-ink-850 hover:text-ink-100">
        <House size={16} /> Buka beranda
      </Link>
      <Link href="/chat" target="_blank" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-[15px] text-ink-300 transition-colors hover:bg-ink-850 hover:text-ink-100">
        <ExternalLink size={16} /> Buka chat
      </Link>
      <form action={logout}>
        <button className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-[15px] text-ink-300 transition-colors hover:bg-ink-850 hover:text-ink-100">
          <LogOut size={16} /> Keluar
        </button>
      </form>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5">
      <Image src="/Logo-Haltev.webp" alt="" width={36} height={36} className="size-9" />
      <span className="leading-tight">
        <span className="block font-display text-base font-bold">Haltev</span>
        <span className="block text-xs text-ink-400">Admin</span>
      </span>
    </Link>
  );

  return (
    <div className="theme-light min-h-dvh bg-ink-950 font-body text-ink-100 md:flex">
      <SmoothScroll anchorOffset={-16} />
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-ink-700 bg-ink-900 p-4 md:sticky md:top-0 md:flex md:h-dvh">
        <div>
          <div className="px-1 pb-6">{brand}</div>
          {links}
        </div>
        {bottom}
      </aside>

      <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-900 md:hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          {brand}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="relative rounded-lg p-2 text-ink-300 hover:bg-ink-800"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
            {!open && pending > 0 && <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-volt-500" />}
          </button>
        </div>
        {open && (
          <div className="animate-rise space-y-3 border-t border-ink-700 p-3">
            {links}
            {bottom}
          </div>
        )}
      </header>

      <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
