import type { LandingCopy } from "@/lib/landing-i18n";

/** One typeset paragraph instead of stat tiles: the facts sit inside the sentence they belong to. */
export function Manifesto({ t }: { t: LandingCopy }) {
  return (
    <section id="tentang" className="border-y border-lp-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="sr-only">{t.manifesto.heading}</h2>
        <p className="reveal max-w-[38ch] text-[1.65rem] leading-[1.4] font-medium tracking-[-0.01em] text-lp-navy sm:max-w-[44ch] sm:text-[2.1rem] lg:text-[2.4rem]">
          {t.manifesto.parts.map((p, i) =>
            typeof p === "string" ? (
              <span key={i}>{p}</span>
            ) : (
              <strong key={i} className="rounded-sm bg-lp-sky px-1 font-bold [box-decoration-break:clone]">
                {p.b}
              </strong>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
