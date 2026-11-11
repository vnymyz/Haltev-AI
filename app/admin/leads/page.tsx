import Link from "next/link";
import { Search } from "lucide-react";
import { db } from "@/lib/db/supabase";
import { LeadStatusSelect } from "../LeadStatusSelect";
import { PageTitle, STATUS, StatusDot, waLink, when } from "../ui";

const FILTERS = ["new", "contacted", "registered", "paid", "lost"] as const;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q = "", status = "" } = await searchParams;
  const term = q.trim().replace(/[,()%*]/g, " ");

  let query = db().from("leads").select("*").order("created_at", { ascending: false }).limit(200);
  if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
  if (FILTERS.includes(status as (typeof FILTERS)[number])) query = query.eq("status", status);
  const { data } = await query;
  const leads = data ?? [];

  const chip = (value: string, label: string) => {
    const active = status === value;
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    if (value) params.set("status", value);
    const qs = params.toString();
    return (
      <Link
        key={label}
        href={`/admin/leads${qs ? `?${qs}` : ""}`}
        aria-current={active ? "true" : undefined}
        className={`inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors duration-200 ease-soft ${
          active ? "border-lp-navy bg-lp-navy text-white" : "border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-600 hover:text-ink-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <PageTitle sub="Cari berdasarkan nama, email, atau nomor WhatsApp. Status bisa diubah langsung dari daftar.">Lead</PageTitle>

      <form action="/admin/leads" className="mb-4 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-3 focus-within:border-volt-500">
          <Search size={16} className="shrink-0 text-ink-400" />
          <input
            name="q"
            defaultValue={term}
            placeholder="Cari lead"
            aria-label="Cari lead"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-ink-100 placeholder:text-ink-400 focus:outline-none sm:text-sm"
          />
        </label>
        <button className="min-h-11 rounded-lg bg-lp-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-lp-royal">
          Cari
        </button>
      </form>

      <div className="mb-6 flex flex-wrap gap-2">
        {chip("", "Semua")}
        {FILTERS.map((f) => chip(f, STATUS[f].label))}
      </div>

      <ul className="divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900">
        {leads.length === 0 && <li className="p-5 text-[15px] text-ink-400">Tidak ada lead yang cocok.</li>}
        {leads.map((l) => (
          <li key={l.id} className="grid gap-x-6 gap-y-3 px-4 py-4 md:grid-cols-[1.3fr_1.2fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="font-semibold">{l.name}</div>
              <div className="truncate text-sm text-ink-400">{l.email}</div>
              <div className="mt-1 flex items-center gap-3 text-sm">
                {waLink(l.phone) ? (
                  <a href={waLink(l.phone)!} target="_blank" rel="noreferrer" className="font-medium text-volt-400 hover:underline">
                    {l.phone}
                  </a>
                ) : (
                  <span className="text-ink-400">Tanpa nomor</span>
                )}
                <span className="text-ink-400">{when(l.created_at)}</span>
              </div>
            </div>

            <div className="min-w-0 text-sm">
              <div className="font-medium">{l.interest_program ?? "Belum pilih program"}</div>
              <div className="text-ink-400">
                {[l.preferred_days, l.preferred_time, l.class_type, l.method].filter(Boolean).join(", ") || "Tanpa preferensi"}
              </div>
              {(l.source || l.promo_code || l.notes) && (
                <div className="mt-0.5 text-ink-400">
                  {[l.source && `Tahu dari ${l.source}`, l.promo_code && `Promo ${l.promo_code}`, l.notes].filter(Boolean).join(". ")}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 md:flex-col md:items-start">
              <StatusDot v={l.status} />
              <LeadStatusSelect leadId={l.id} status={l.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
