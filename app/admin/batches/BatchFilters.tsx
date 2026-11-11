"use client";
import Link from "next/link";
import { Search } from "lucide-react";

type Opt = { value: string; label: string };

const select =
  "min-h-10 w-full rounded-lg border border-ink-700 bg-ink-900 px-2.5 text-sm text-ink-100 focus:border-volt-500 focus:outline-none";

/** Filters for the Batch & tutor page. Selects apply as soon as they change; the search box on Enter. */
export function BatchFilters({
  values,
  hidden,
  categories,
  programs,
  tutors,
  showSort,
  resetHref,
}: {
  values: Record<string, string>;
  hidden: Record<string, string>;
  categories: Opt[];
  programs: Opt[];
  tutors: Opt[];
  showSort: boolean;
  resetHref: string;
}) {
  const submit = (e: React.ChangeEvent<HTMLSelectElement>) => e.currentTarget.form?.requestSubmit();
  const active = ["cat", "p", "t", "d", "md", "s", "q"].some((k) => values[k]);

  const field = (name: string, label: string, options: Opt[], all: string) => (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-semibold text-ink-300">{label}</span>
      <select name={name} defaultValue={values[name] ?? ""} onChange={submit} className={select}>
        <option value="">{all}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <form action="/admin/batches" className="mb-5 rounded-xl border border-ink-700 bg-ink-900 p-4">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      <div className="mb-3 flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-950 px-3 focus-within:border-volt-500">
        <Search size={16} className="shrink-0 text-ink-400" />
        <input
          name="q"
          defaultValue={values.q ?? ""}
          placeholder="Cari nama program atau tutor"
          aria-label="Cari nama program atau tutor"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-ink-100 placeholder:text-ink-400 focus:outline-none sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {field("cat", "Kategori", categories, "Semua kategori")}
        {field("p", "Program", programs, "Semua program")}
        {field("t", "Tutor", tutors, "Semua tutor")}
        {field(
          "d",
          "Jadwal",
          [
            { value: "weekday", label: "Weekday" },
            { value: "weekend", label: "Weekend" },
            { value: "after_office", label: "After office" },
          ],
          "Semua jadwal",
        )}
        {field(
          "md",
          "Mode",
          [
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" },
            { value: "online_offline", label: "Online dan offline" },
          ],
          "Semua mode",
        )}
        {field(
          "s",
          "Kursi",
          [
            { value: "open", label: "Masih ada kursi" },
            { value: "full", label: "Penuh" },
          ],
          "Semua",
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        {showSort ? (
          <div className="w-full sm:w-64">
            {field(
              "o",
              "Urutkan",
              [
                { value: "program", label: "Nama program" },
                { value: "tutor", label: "Tutor" },
                { value: "seats", label: "Kursi tersisa" },
              ],
              "Tanggal mulai",
            )}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          {active && (
            <Link href={resetHref} className="text-sm font-semibold text-volt-400 hover:underline">
              Hapus filter
            </Link>
          )}
          <button className="min-h-10 rounded-lg bg-lp-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-lp-royal">
            Terapkan
          </button>
        </div>
      </div>
    </form>
  );
}
