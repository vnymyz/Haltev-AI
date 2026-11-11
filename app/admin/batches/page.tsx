import Link from "next/link";
import { CalendarDays, List } from "lucide-react";
import { db } from "@/lib/db/supabase";
import { PageTitle } from "../ui";
import { BatchCalendar } from "./BatchCalendar";
import { BatchFilters } from "./BatchFilters";
import { BatchList } from "./BatchList";
import { CATEGORY_LABEL, buildMonth, monthLabel, monthShift, todayISO, type BatchRow } from "./lib";

type Params = Record<string, string | string[] | undefined>;
const KEYS = ["view", "m", "cat", "p", "t", "d", "md", "s", "q", "o"] as const;

export default async function BatchesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");

  const view = get("view") === "list" ? "list" : "calendar";
  const today = todayISO();
  const m = /^\d{4}-(0[1-9]|1[0-2])$/.test(get("m")) ? get("m") : today.slice(0, 7);

  const { data } = await db()
    .from("batches")
    .select(
      "id, program_id, tutor_id, batch_no, day_type, days, start_date, end_date, time_start, time_end, mode, capacity, seats_taken, programs!inner(name, category), tutors(name)",
    )
    .order("start_date");
  const all = (data ?? []) as unknown as BatchRow[];

  // Filter options come from every batch, so they stay put while filtering
  const uniq = <T extends { value: string }>(list: T[]) => [...new Map(list.map((o) => [o.value, o])).values()];
  const categories = uniq(all.map((b) => ({ value: b.programs.category, label: CATEGORY_LABEL[b.programs.category] ?? b.programs.category })));
  const programs = uniq(all.map((b) => ({ value: String(b.program_id), label: b.programs.name }))).sort((a, b) => a.label.localeCompare(b.label));
  const tutors = uniq(all.filter((b) => b.tutor_id).map((b) => ({ value: String(b.tutor_id), label: b.tutors?.name ?? "" }))).sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  const q = get("q").trim().toLowerCase();
  let rows = all.filter((b) => {
    if (get("cat") && b.programs.category !== get("cat")) return false;
    if (get("p") && String(b.program_id) !== get("p")) return false;
    if (get("t") && String(b.tutor_id) !== get("t")) return false;
    if (get("d") && b.day_type !== get("d")) return false;
    if (get("md") && b.mode !== get("md")) return false;
    if (get("s") === "open" && b.seats_taken >= b.capacity) return false;
    if (get("s") === "full" && b.seats_taken < b.capacity) return false;
    if (q && !`${b.programs.name} ${b.tutors?.name ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const sort = get("o");
  if (sort === "program") rows = [...rows].sort((a, b) => a.programs.name.localeCompare(b.programs.name) || (a.start_date ?? "").localeCompare(b.start_date ?? ""));
  else if (sort === "tutor") rows = [...rows].sort((a, b) => (a.tutors?.name ?? "~").localeCompare(b.tutors?.name ?? "~"));
  else if (sort === "seats") rows = [...rows].sort((a, b) => a.capacity - a.seats_taken - (b.capacity - b.seats_taken));

  // Links keep every filter; only the keys passed in `over` change
  const link = (over: Record<string, string>) => {
    const p = new URLSearchParams();
    for (const k of KEYS) {
      const v = k in over ? over[k] : get(k);
      if (v) p.set(k, v);
    }
    const s = p.toString();
    return `/admin/batches${s ? `?${s}` : ""}`;
  };

  const values = Object.fromEntries(KEYS.map((k) => [k, get(k)]));
  const hidden: Record<string, string> = { view };
  if (view === "calendar" && get("m")) hidden.m = get("m");

  const cells = view === "calendar" ? buildMonth(rows, m, today) : [];
  const legend = [...new Set(rows.map((b) => b.programs.category))];

  const tab = (v: "calendar" | "list", label: string, icon: React.ReactNode) => (
    <Link
      href={link({ view: v })}
      aria-current={view === v ? "page" : undefined}
      className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3.5 text-sm font-semibold transition-colors duration-200 ease-soft ${
        view === v ? "bg-lp-navy text-white" : "text-ink-300 hover:text-ink-100"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <>
      <PageTitle sub="Lihat jadwal kelas sebagai kalender atau daftar bernomor. Filter berlaku di keduanya. Nama tutor bisa diganti di Supabase (tabel tutors dan batches).">
        Batch dan tutor
      </PageTitle>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-ink-700 bg-ink-900 p-1" role="group" aria-label="Tampilan">
          {tab("calendar", "Kalender", <CalendarDays size={16} />)}
          {tab("list", "Daftar", <List size={16} />)}
        </div>
        <p className="text-sm text-ink-400">
          {rows.length} dari {all.length} batch
        </p>
      </div>

      <BatchFilters
        values={values}
        hidden={hidden}
        categories={categories}
        programs={programs}
        tutors={tutors}
        showSort={view === "list"}
        resetHref={link({ cat: "", p: "", t: "", d: "", md: "", s: "", q: "", o: "" })}
      />

      {view === "calendar" ? (
        <BatchCalendar
          key={`${m}-${rows.length}`}
          cells={cells}
          title={monthLabel(m)}
          prevHref={link({ view: "calendar", m: monthShift(m, -1) })}
          nextHref={link({ view: "calendar", m: monthShift(m, 1) })}
          todayHref={link({ view: "calendar", m: "" })}
          legend={legend}
        />
      ) : (
        <BatchList rows={rows} />
      )}
    </>
  );
}
