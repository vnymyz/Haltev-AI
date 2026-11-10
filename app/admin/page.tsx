import Link from "next/link";
import { db } from "@/lib/db/supabase";
import { rupiah } from "@/lib/format";
import { Badge, H1, Table, td, when } from "./ui";

export default async function AdminOverview() {
  const [leads, regs, pending, paid, recent] = await Promise.all([
    db().from("leads").select("id", { count: "exact", head: true }),
    db().from("registrations").select("id", { count: "exact", head: true }),
    db().from("invoices").select("id", { count: "exact", head: true }).eq("status", "pending_verification"),
    db().from("invoices").select("amount").eq("status", "paid"),
    db().from("leads").select("id, name, phone, interest_program, status, created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  const revenue = (paid.data ?? []).reduce((s, r) => s + (r.amount as number), 0);

  const stats = [
    ["Leads", leads.count ?? 0, "/admin/leads"],
    ["Registrasi", regs.count ?? 0, "/admin/payments"],
    ["Perlu verifikasi", pending.count ?? 0, "/admin/payments"],
    ["Pendapatan terverifikasi", rupiah(revenue), "/admin/payments"],
  ] as const;

  return (
    <>
      <H1>Overview</H1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-xl border border-ink-800 bg-ink-900 p-4 transition hover:border-volt-500/50">
            <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
            <div className={`mt-1 text-2xl font-extrabold ${label === "Perlu verifikasi" && Number(value) > 0 ? "text-amber-300" : "text-white"}`}>
              {value}
            </div>
          </Link>
        ))}
      </div>
      <h2 className="mb-3 mt-8 font-bold text-white">Leads terbaru</h2>
      <Table head={["Waktu", "Nama", "WhatsApp", "Minat", "Status"]}>
        {(recent.data ?? []).map((l) => (
          <tr key={l.id}>
            <td className={td}>{when(l.created_at)}</td>
            <td className={td}>{l.name}</td>
            <td className={td}>{l.phone}</td>
            <td className={td}>{l.interest_program ?? "-"}</td>
            <td className={td}><Badge v={l.status} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
