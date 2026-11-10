import { db } from "@/lib/db/supabase";
import { dayTypeLabel, hhmm, modeLabel, shortDate } from "@/lib/format";
import { H1, Table, td } from "../ui";

export default async function BatchesPage() {
  const { data } = await db()
    .from("batches")
    .select("id, batch_no, day_type, days, start_date, time_start, time_end, mode, capacity, seats_taken, programs!inner(name, category), tutors(name)")
    .order("program_id")
    .order("day_type");

  return (
    <>
      <H1>Batch & Tutor</H1>
      <p className="mb-4 text-sm text-ink-400">Nama tutor adalah data demo. Edit langsung di Supabase → Table Editor → tutors / batches.</p>
      <Table head={["Program", "Batch", "Tipe", "Hari & jam", "Mulai", "Mode", "Tutor", "Kursi"]}>
        {(data ?? []).map((b) => {
          const program = b.programs as unknown as { name: string; category: string };
          const tutor = b.tutors as unknown as { name: string } | null;
          const left = b.capacity - b.seats_taken;
          return (
            <tr key={b.id}>
              <td className={td}>
                <div className="font-medium">{program.name}</div>
                <div className="text-xs capitalize text-ink-400">{program.category}</div>
              </td>
              <td className={td}>{b.batch_no ?? "-"}</td>
              <td className={td}>{dayTypeLabel(b.day_type)}</td>
              <td className={`${td} text-xs`}>{b.days}<br />{hhmm(b.time_start)}–{hhmm(b.time_end)}</td>
              <td className={td}>{shortDate(b.start_date)}</td>
              <td className={td}>{modeLabel(b.mode)}</td>
              <td className={td}>{tutor?.name ?? "-"}</td>
              <td className={td}>
                <span className={left <= 0 ? "text-red-300" : left <= 1 ? "text-amber-200" : "text-emerald-300"}>
                  {b.seats_taken}/{b.capacity}
                </span>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
