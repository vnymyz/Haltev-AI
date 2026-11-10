import { db } from "@/lib/db/supabase";
import { setLeadStatus } from "../actions";
import { Badge, H1, Table, td, when } from "../ui";

const STATUSES = ["new", "contacted", "registered", "paid", "lost"];

export default async function LeadsPage() {
  const { data } = await db().from("leads").select("*").order("created_at", { ascending: false }).limit(200);
  const waLink = (p: string | null) => (p ? `https://wa.me/${p.replace(/^0/, "62").replace(/\D/g, "")}` : null);

  return (
    <>
      <H1>Leads ({data?.length ?? 0})</H1>
      <Table head={["Masuk", "Nama", "Kontak", "Minat", "Preferensi", "Sumber / Promo", "Catatan", "Status"]}>
        {(data ?? []).map((l) => (
          <tr key={l.id}>
            <td className={td}>{when(l.created_at)}</td>
            <td className={`${td} font-semibold`}>{l.name}</td>
            <td className={td}>
              <div>{l.email}</div>
              {waLink(l.phone) ? (
                <a href={waLink(l.phone)!} target="_blank" rel="noreferrer" className="text-volt-400 hover:underline">{l.phone}</a>
              ) : "-"}
            </td>
            <td className={td}>{l.interest_program ?? "-"}</td>
            <td className={`${td} text-xs text-ink-300`}>
              {[l.preferred_days, l.preferred_time, l.class_type, l.method].filter(Boolean).join(" · ") || "-"}
            </td>
            <td className={`${td} text-xs text-ink-300`}>{[l.source, l.promo_code].filter(Boolean).join(" · ") || "-"}</td>
            <td className={`${td} max-w-48 text-xs text-ink-300`}>{l.notes ?? "-"}</td>
            <td className={td}>
              <form action={setLeadStatus} className="flex items-center gap-1.5">
                <input type="hidden" name="leadId" value={l.id} />
                <Badge v={l.status} />
                <select name="status" defaultValue={l.status} className="rounded border border-ink-700 bg-ink-900 px-1 py-0.5 text-xs">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="rounded bg-ink-700 px-2 py-0.5 text-xs hover:bg-ink-600">OK</button>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
