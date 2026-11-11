import type { LandingCopy } from "@/lib/landing-i18n";
import { MascotPlate } from "./MascotPlate";
import { TypedHeadline } from "./TypedHeadline";
import { ChatButton, focusRing } from "./ui";

export function Hero({ t }: { t: LandingCopy }) {
  return (
    <div className="hero-bg">
    <section className="mx-auto grid max-w-6xl items-center gap-x-10 gap-y-8 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16 lg:pb-16">
      <div>
        <TypedHeadline
          text={t.hero.title}
          className="min-h-[7.8rem] max-w-[14ch] font-display text-[2.4rem] leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:min-h-[12.2rem] sm:text-6xl lg:min-h-[13.8rem] lg:text-[4.25rem]"
        />
        <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-lp-muted sm:text-lg">{t.hero.sub}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ChatButton size="lg">{t.hero.cta}</ChatButton>
          <a href="#program" className={`rounded py-2 text-base font-semibold text-lp-royal underline decoration-2 underline-offset-[6px] hover:text-lp-navy ${focusRing}`}>
            {t.hero.secondary}
          </a>
        </div>
      </div>

      <MascotPlate hero={t.hero} />
    </section>
    </div>
  );
}
