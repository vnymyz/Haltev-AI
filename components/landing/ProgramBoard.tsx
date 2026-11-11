import Link from "next/link";
import type { LandingCopy } from "@/lib/landing-i18n";
import { focusRing } from "./ui";

// One shared column template: header and every row use the same fixed tracks, so columns line up exactly.
const COLS = "md:grid-cols-[minmax(0,2.3fr)_minmax(0,1.5fr)_minmax(0,1.35fr)_minmax(0,1.2fr)_6.5rem]";

/**
 * A class board, not a card grid: programs differ in format, duration and price,
 * so they are rows with real columns. Each row opens the chat with that question.
 */
export function ProgramBoard({ t }: { t: LandingCopy }) {
  const p = t.programs;
  return (
    <section id="program" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="reveal max-w-[18ch] font-display text-3xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
        {p.title}
      </h2>

      <div className="mt-10 md:-mx-4">
        {/* Column headings (desktop only; on phones each row labels its own values) */}
        <div className={`hidden gap-x-6 border-y-2 border-lp-navy px-4 py-3 text-sm font-bold md:grid ${COLS}`}>
          <span>{p.head.program}</span>
          <span>{p.head.format}</span>
          <span>{p.head.duration}</span>
          <span className="text-right">{p.head.from}</span>
          <span aria-hidden="true" />
        </div>

        <ul className="border-t-2 border-lp-navy md:border-t-0">
          {p.items.map((it) => (
            <li key={it.id} className="reveal border-b border-lp-line">
              <Link
                href={`/chat?q=${encodeURIComponent(it.ask)}`}
                className={`group grid gap-x-6 gap-y-3 px-0 py-6 transition-colors duration-200 ease-soft hover:bg-lp-sky/50 md:items-start md:px-4 ${COLS} ${focusRing}`}
              >
                <span className="min-w-0">
                  <span className="block font-display text-xl leading-snug font-bold tracking-[-0.01em]">{it.name}</span>
                  <span className="mt-1.5 block max-w-[44ch] text-[15px] leading-relaxed text-lp-muted">{it.who}</span>
                </span>

                <dl className="contents">
                  <div className="flex gap-3 md:block md:pt-1">
                    <dt className="w-20 shrink-0 text-sm text-lp-muted md:sr-only">{p.head.format}</dt>
                    <dd className="min-w-0 text-[15px] leading-snug">{it.format}</dd>
                  </div>
                  <div className="flex gap-3 md:block md:pt-1">
                    <dt className="w-20 shrink-0 text-sm text-lp-muted md:sr-only">{p.head.duration}</dt>
                    <dd className="min-w-0 text-[15px] leading-snug">{it.duration}</dd>
                  </div>
                  <div className="flex gap-3 md:block md:text-right">
                    <dt className="w-20 shrink-0 self-center text-sm text-lp-muted md:sr-only">{p.head.from}</dt>
                    <dd className="font-display text-lg font-bold whitespace-nowrap">{it.from}</dd>
                  </div>
                </dl>

                <span className="relative w-fit self-start text-sm font-semibold text-lp-royal after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:bg-lp-royal after:transition-transform after:duration-300 after:ease-soft md:ml-auto md:pt-1 md:text-right md:after:scale-x-0 md:group-hover:after:scale-x-100 md:group-focus-visible:after:scale-x-100">
                  {p.ask}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="reveal mt-5 max-w-[60ch] text-sm text-lp-muted">{p.note}</p>
    </section>
  );
}
