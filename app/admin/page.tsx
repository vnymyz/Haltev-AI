import Link from "next/link";
import { db } from "@/lib/db/supabase";
import { rupiah } from "@/lib/format";
import { PageTitle, StatusDot, when } from "./ui";

type InvoiceRow = {
  id: string;
  number: string;
  amount: number;
  status: string;
  created_at: string;
  registrations: { leads: { name: string }; programs: { name: string } };
};

export default async function AdminOverview() {
  const [leads, regs, pending, paid, recentLeads, recentInvoices] = await Promise.all([
    db().from("leads").select("id", { count: "exact", head: true }),
    db().from("registrations").select("id", { count: "exact", head: true }),
    db().from("invoices").select("id", { count: "exact", head: true }).eq("status", "pending_verification"),
    db().from("invoices").select("amount").eq("status", "paid"),
    db().from("leads").select("id, name, interest_program, status, created_at").order("created_at", { ascending: false }).limit(6),
    db()
      .from("invoices")
      .select("id, number, amount, status, created_at, registrations!inner(leads!inner(name), programs!inner(name))")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const waiting = pending.count ?? 0;
  const revenue = (paid.data ?? []).reduce((s, r) => s + (r.amount as number), 0);
  const invoices = (recentInvoices.data ?? []) as unknown as InvoiceRow[];

  return (
    <>
      <PageTitle
        sub={
          <>
            Sejauh ini ada {leads.count ?? 0} lead dan {regs.count ?? 0} pendaftaran. Pembayaran yang sudah diverifikasi
            totalnya {rupiah(revenue)}.
          </>
        }
      >
        Ringkasan
      </PageTitle>

      {/* What needs doing right now comes first */}
      <div className="mb-10 rounded-xl border border-ink-700 border-l-4 border-l-volt-500 bg-ink-900 p-5">
        {waiting > 0 ? (
          <p className="text-lg">
            <strong className="font-bold">{waiting} bukti pembayaran</strong> menunggu dicek.{" "}
            <Link href="/admin/payments" className="font-semibold text-volt-400 underline underline-offset-4 hover:text-volt-300">
              Buka antrean
            </Link>
          </p>
        ) : (
          <p className="text-lg">Tidak ada bukti pembayaran yang menunggu. Semua sudah dicek.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 [&>*]:min-w-0">
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Lead terbaru</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-volt-400 hover:underline">
              Semua lead
            </Link>
          </div>
          <ul className="divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900">
            {(recentLeads.data ?? []).length === 0 && <li className="p-4 text-sm text-ink-400">Belum ada lead.</li>}
            {(recentLeads.data ?? []).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{l.name}</div>
                  <div className="truncate text-sm text-ink-400">
                    {l.interest_program ?? "Belum pilih program"}, {when(l.created_at)}
                  </div>
                </div>
                <StatusDot v={l.status} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Invoice terbaru</h2>
            <Link href="/admin/payments" className="text-sm font-semibold text-volt-400 hover:underline">
              Semua invoice
            </Link>
          </div>
          <ul className="divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900">
            {invoices.length === 0 && <li className="p-4 text-sm text-ink-400">Belum ada invoice.</li>}
            {invoices.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{i.registrations.leads.name}</div>
                  <div className="truncate text-sm text-ink-400">
                    {i.number}, {rupiah(i.amount)}
                  </div>
                </div>
                <StatusDot v={i.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
