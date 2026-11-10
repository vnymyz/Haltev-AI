import Image from "next/image";
import Link from "next/link";
import { HALTEV } from "@/lib/constants";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

const NAV = [
  ["/admin", "Overview"],
  ["/admin/leads", "Leads"],
  ["/admin/payments", "Pembayaran"],
  ["/admin/batches", "Batch & Tutor"],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-10 border-b border-ink-800 bg-ink-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src={HALTEV.logo} alt="Haltev" width={32} height={32} />
            <span className="font-extrabold text-white">Haltev Admin</span>
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-1.5 text-ink-300 hover:bg-ink-800 hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="text-volt-400 hover:underline">Buka chat ↗</Link>
            <form action={logout}>
              <button className="rounded-lg border border-ink-700 px-3 py-1.5 text-ink-300 hover:text-white">Keluar</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
