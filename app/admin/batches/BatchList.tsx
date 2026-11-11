import { dayTypeLabel, modeLabel } from "@/lib/format";
import { CATEGORY_LABEL, CATEGORY_STYLE, fmtDate, hhmm, type BatchRow } from "./lib";
import { SeatBar } from "./SeatBar";

const COLS = "md:grid-cols-[2.5rem_minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_8.5rem]";

/** The same batches as a numbered list. */
export function BatchList({ rows }: { rows: BatchRow[] }) {
  if (rows.length === 0) {
    return <p className="rounded-xl border border-ink-700 bg-ink-900 p-5 text-[15px] text-ink-400">Tidak ada batch yang cocok dengan filter ini.</p>;
  }
  return (
    <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
      <div className={`hidden gap-x-4 border-b border-ink-700 bg-ink-850 px-4 py-2.5 text-xs font-bold text-ink-300 md:grid ${COLS}`}>
        <span>No</span>
        <span>Program</span>
        <span>Jadwal</span>
        <span>Periode</span>
        <span>Mode</span>
        <span>Tutor</span>
        <span>Kursi</span>
      </div>
      <ol>
        {rows.map((b, i) => {
          const st = CATEGORY_STYLE[b.programs.category] ?? CATEGORY_STYLE.fundamentals;
          return (
            <li key={b.id} className={`grid gap-x-4 gap-y-2 border-b border-ink-700 px-4 py-3.5 last:border-b-0 md:items-start ${COLS}`}>
              <span className="font-display text-sm font-bold text-ink-400">{i + 1}</span>
              <div className="min-w-0">
                <div className="font-semibold">{b.programs.name}</div>
                <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-300">
                  <span className={`size-2 rounded-sm ${st.dot}`} />
                  {CATEGORY_LABEL[b.programs.category] ?? b.programs.category}, Batch {b.batch_no ?? "-"}
                </div>
              </div>
              <div className="text-sm">
                <div>{dayTypeLabel(b.day_type)}</div>
                <div className="text-ink-400">
                  {b.days}, {hhmm(b.time_start)} sampai {hhmm(b.time_end)}
                </div>
              </div>
              <div className="text-sm text-ink-300">
                {fmtDate(b.start_date)} sampai {fmtDate(b.end_date)}
              </div>
              <div className="text-sm">{modeLabel(b.mode)}</div>
              <div className="text-sm">{b.tutors?.name ?? <span className="text-ink-400">Belum diisi</span>}</div>
              <SeatBar taken={b.seats_taken} cap={b.capacity} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
