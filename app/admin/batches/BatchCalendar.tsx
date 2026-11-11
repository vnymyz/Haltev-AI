"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayTypeLabel, modeLabel } from "@/lib/format";
import {
  CATEGORY_LABEL,
  CATEGORY_STYLE,
  dayLabel,
  type CalCell,
  type CalEvent,
} from "./lib";
import { SeatBar } from "./SeatBar";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MAX_CHIPS = 3;

/** Month calendar in the style of Google Calendar: hover or focus a session for its details, click a day for the full list. */
export function BatchCalendar({
  cells,
  title,
  prevHref,
  nextHref,
  todayHref,
  legend,
}: {
  cells: CalCell[];
  title: string;
  prevHref: string;
  nextHref: string;
  todayHref: string;
  legend: string[];
}) {
  const todayCell = cells.find((c) => c.isToday && c.inMonth);
  const [selected, setSelected] = useState<string | null>(
    todayCell?.date ?? null,
  );
  const selectedCell = cells.find((c) => c.date === selected) ?? null;
  const listRef = useRef<HTMLElement>(null);

  // On phones the day list sits below the grid, so bring it into view after a tap
  function pick(date: string) {
    setSelected(date);
    if (window.matchMedia("(max-width: 639px)").matches) {
      requestAnimationFrame(() =>
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  const navBtn =
    "inline-flex size-10 items-center justify-center rounded-lg border border-ink-700 bg-ink-900 text-ink-300 transition-colors hover:border-ink-600 hover:text-ink-100";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="w-full font-display text-xl font-bold capitalize sm:mr-auto sm:w-auto">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <Link
            href={todayHref}
            className="min-h-10 rounded-lg border border-ink-700 bg-ink-900 px-3.5 text-sm leading-10 font-semibold text-ink-100 hover:border-ink-600"
          >
            Hari ini
          </Link>
          <Link
            href={prevHref}
            aria-label="Bulan sebelumnya"
            className={navBtn}
          >
            <ChevronLeft size={18} />
          </Link>
          <Link
            href={nextHref}
            aria-label="Bulan berikutnya"
            className={navBtn}
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-300">
        {legend.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <span
              className={`size-2.5 rounded-sm ${(CATEGORY_STYLE[c] ?? CATEGORY_STYLE.fundamentals).dot}`}
            />
            {CATEGORY_LABEL[c] ?? c}
          </span>
        ))}
      </div>

      <div
        role="grid"
        aria-label={title}
        className="rounded-xl border border-ink-700 bg-ink-900"
      >
        <div
          role="row"
          className="grid grid-cols-7 border-b border-ink-700 bg-ink-850"
        >
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              role="columnheader"
              className="px-2 py-2 text-center text-xs font-semibold text-ink-300"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((c, i) => {
            const col = i % 7;
            const row = Math.floor(i / 7);
            const isSel = selected === c.date;
            const extra = c.events.length - MAX_CHIPS;
            return (
              <div
                key={c.date}
                role="gridcell"
                onClick={() => pick(c.date)}
                className={`relative min-h-[4.5rem] cursor-pointer border-r border-b border-ink-700 p-1 transition-colors duration-150 sm:min-h-[7.5rem] sm:p-1.5 ${
                  c.inMonth
                    ? "bg-ink-900 hover:bg-ink-850"
                    : "bg-ink-950 text-ink-400"
                } ${col === 6 ? "border-r-0" : ""} ${row === 5 ? "border-b-0" : ""} ${isSel ? "z-10 ring-2 ring-volt-500 ring-inset" : ""}`}
              >
                <div className="mb-1 flex justify-end sm:justify-start">
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                      c.isToday
                        ? "bg-lp-navy text-white"
                        : c.inMonth
                          ? "text-ink-100"
                          : "text-ink-400"
                    }`}
                  >
                    {c.day}
                  </span>
                </div>

                {/* Desktop: session chips with a hover card */}
                <div className="hidden space-y-0.5 sm:block">
                  {c.events.slice(0, MAX_CHIPS).map((ev) => (
                    <Chip key={ev.id} ev={ev} col={col} row={row} />
                  ))}
                  {extra > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(c.date);
                      }}
                      className="w-full rounded px-1.5 py-0.5 text-left text-xs font-semibold text-volt-400 hover:bg-ink-800"
                    >
                      {extra} lagi
                    </button>
                  )}
                </div>

                {/* Phone: dots, tap the day for the list */}
                <div className="flex flex-wrap gap-0.5 sm:hidden">
                  {c.events.slice(0, 6).map((ev) => (
                    <span
                      key={ev.id}
                      className={`size-1.5 rounded-full ${(CATEGORY_STYLE[ev.cat] ?? CATEGORY_STYLE.fundamentals).dot}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full list for the chosen day (also the way to see details on a touch screen) */}
      <section ref={listRef} className="mt-6 scroll-mt-20" aria-live="polite">
        {selectedCell ? (
          <>
            <h3 className="mb-3 text-lg font-bold capitalize">
              {dayLabel(selectedCell.date)}
            </h3>
            {selectedCell.events.length === 0 ? (
              <p className="rounded-xl border border-ink-700 bg-ink-900 p-4 text-[15px] text-ink-300">
                Tidak ada kelas pada hari ini.
              </p>
            ) : (
              <ul className="grid gap-3 md:grid-cols-2">
                {selectedCell.events.map((ev) => (
                  <li
                    key={ev.id}
                    className="rounded-xl border border-ink-700 bg-ink-900 p-4"
                  >
                    <Details ev={ev} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-sm text-ink-400">
            Pilih sebuah hari untuk melihat semua kelasnya.
          </p>
        )}
      </section>
    </div>
  );
}

function Chip({ ev, col, row }: { ev: CalEvent; col: number; row: number }) {
  const st = CATEGORY_STYLE[ev.cat] ?? CATEGORY_STYLE.fundamentals;
  return (
    <div className="group relative">
      <button
        type="button"
        className={`block w-full truncate rounded border-l-4 px-1.5 py-0.5 text-left text-xs font-medium transition-[filter] duration-150 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-volt-500 ${st.chip}`}
      >
        <span className="font-bold">{ev.time.slice(0, 5)}</span> {ev.short}
      </button>
      <div
        role="tooltip"
        className={`pointer-events-none invisible absolute z-30 w-72 rounded-xl border border-ink-700 bg-ink-900 p-3.5 text-left opacity-0 shadow-[0_16px_40px_-12px_rgba(10,26,58,0.35)] transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${
          col >= 4 ? "right-0" : "left-0"
        } ${row >= 3 ? "bottom-full mb-1" : "top-full mt-1"}`}
      >
        <Details ev={ev} />
      </div>
    </div>
  );
}

function Details({ ev }: { ev: CalEvent }) {
  const st = CATEGORY_STYLE[ev.cat] ?? CATEGORY_STYLE.fundamentals;
  return (
    <div className="space-y-2 text-sm">
      <div>
        <div className="font-bold text-ink-100">{ev.name}</div>
        <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-300">
          <span className={`size-2 rounded-sm ${st.dot}`} />
          {CATEGORY_LABEL[ev.cat] ?? ev.cat}
        </div>
      </div>
      <dl className="grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1 text-[13px]">
        <dt className="text-ink-400">Batch</dt>
        <dd className="text-ink-100">
          {ev.batch}, {dayTypeLabel(ev.dayType)}
        </dd>
        <dt className="text-ink-400">Hari</dt>
        <dd className="text-ink-100">{ev.days}</dd>
        <dt className="text-ink-400">Jam</dt>
        <dd className="text-ink-100">{ev.time}</dd>
        <dt className="text-ink-400">Periode</dt>
        <dd className="text-ink-100">{ev.range}</dd>
        <dt className="text-ink-400">Mode</dt>
        <dd className="text-ink-100">{modeLabel(ev.mode)}</dd>
        <dt className="text-ink-400">Tutor</dt>
        <dd className="text-ink-100">{ev.tutor ?? "Belum diisi"}</dd>
      </dl>
      <SeatBar taken={ev.taken} cap={ev.cap} />
    </div>
  );
}
