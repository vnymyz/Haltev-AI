// Shared helpers for the Batch & tutor page: types, day parsing, calendar building, colors.

export type BatchRow = {
  id: number;
  program_id: number;
  tutor_id: number | null;
  batch_no: number | null;
  day_type: string;
  days: string;
  start_date: string | null;
  end_date: string | null;
  time_start: string;
  time_end: string;
  mode: string;
  capacity: number;
  seats_taken: number;
  programs: { name: string; category: string };
  tutors: { name: string } | null;
};

/** A batch session shown on the calendar (plain data, safe to send to the client). */
export type CalEvent = {
  id: number;
  name: string;
  short: string;
  cat: string;
  batch: string;
  dayType: string;
  days: string;
  time: string;
  range: string;
  mode: string;
  tutor: string | null;
  taken: number;
  cap: number;
};

export type CalCell = { date: string; day: number; inMonth: boolean; isToday: boolean; events: CalEvent[] };

export const CATEGORY_LABEL: Record<string, string> = {
  bootcamp: "Bootcamp",
  course: "Kursus",
  office: "Microsoft Office",
  kids: "Kids dan Teens",
  fundamentals: "Fundamentals",
  private: "Private",
};

// Color encodes the program category (calendar chips, dots and the legend).
export const CATEGORY_STYLE: Record<string, { chip: string; dot: string }> = {
  bootcamp: { chip: "border-l-[#1e63e0] bg-[#e4edff] text-[#123f93]", dot: "bg-[#1e63e0]" },
  course: { chip: "border-l-[#0f9d58] bg-[#e1f5ea] text-[#0b6b3a]", dot: "bg-[#0f9d58]" },
  office: { chip: "border-l-[#d97706] bg-[#fdf0d9] text-[#7a4500]", dot: "bg-[#d97706]" },
  kids: { chip: "border-l-[#7c3aed] bg-[#efe8fd] text-[#4c1d95]", dot: "bg-[#7c3aed]" },
  fundamentals: { chip: "border-l-[#64748b] bg-[#e8edf3] text-[#334155]", dot: "bg-[#64748b]" },
  private: { chip: "border-l-[#64748b] bg-[#e8edf3] text-[#334155]", dot: "bg-[#64748b]" },
};

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // index = Date#getUTCDay()

/**
 * "Mon–Tue–Wed" and "Sat & Sun" are lists; "Mon–Fri" (exactly two days joined by a dash) is a range.
 * Returns weekday numbers (0 = Sunday).
 */
export function parseDays(s: string): number[] {
  const names = [...s.matchAll(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g)].map((m) => DOW.indexOf(m[1]));
  const listLike = /[&+,]/.test(s);
  if (!listLike && names.length === 2 && s.includes("–")) {
    const out: number[] = [];
    for (let d = names[0]; ; d = (d + 1) % 7) {
      out.push(d);
      if (d === names[1]) break;
    }
    return out;
  }
  return [...new Set(names)];
}

export const hhmm = (t: string) => t.slice(0, 5);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
/** "2026-11-16" -> "16 Nov 2026" (no time zone math, the value is a plain date). */
export function fmtDate(iso: string | null): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const utc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const isoOf = (d: Date) => d.toISOString().slice(0, 10);

/** Today in Jakarta as YYYY-MM-DD. */
export function todayISO(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

const SHORT_PREFIXES = [/^AI Enhanced /i, /^AI-Powered /i, /^AI-Integrated /i, /^AI /i, /^Professional /i];
function shortName(name: string) {
  let n = name;
  for (const p of SHORT_PREFIXES) n = n.replace(p, "");
  return n;
}

export function toEvent(b: BatchRow): CalEvent {
  return {
    id: b.id,
    name: b.programs.name,
    short: shortName(b.programs.name),
    cat: b.programs.category,
    batch: `Batch ${b.batch_no ?? "-"}`,
    dayType: b.day_type,
    days: b.days,
    time: `${hhmm(b.time_start)} sampai ${hhmm(b.time_end)}`,
    range: `${fmtDate(b.start_date)} sampai ${fmtDate(b.end_date)}`,
    mode: b.mode,
    tutor: b.tutors?.name ?? null,
    taken: b.seats_taken,
    cap: b.capacity,
  };
}

/** 6 weeks (Monday first) around the month `ym` ("2026-11"), with the sessions that fall on each day. */
export function buildMonth(rows: BatchRow[], ym: string, today: string): CalCell[] {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const gridStart = new Date(first.getTime() - offset * 86400000);

  const prepared = rows
    .filter((b) => b.start_date && b.end_date)
    .map((b) => ({ b, dows: parseDays(b.days), ev: toEvent(b) }));

  const cells: CalCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getTime() + i * 86400000);
    const iso = isoOf(d);
    const dow = d.getUTCDay();
    const events = prepared
      .filter(({ b, dows }) => iso >= b.start_date! && iso <= b.end_date! && dows.includes(dow))
      .sort((a, c) => a.b.time_start.localeCompare(c.b.time_start))
      .map(({ ev }) => ev);
    cells.push({ date: iso, day: d.getUTCDate(), inMonth: d.getUTCMonth() === m - 1, isToday: iso === today, events });
  }
  return cells;
}

export function monthShift(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function dayLabel(iso: string): string {
  return utc(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
