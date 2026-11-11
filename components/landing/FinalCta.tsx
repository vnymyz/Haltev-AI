import Image from "next/image";
import type { LandingCopy } from "@/lib/landing-i18n";
import { ChatButton } from "./ui";

export function FinalCta({ t }: { t: LandingCopy }) {
  return (
    <section className="relative mt-40 bg-lp-sky md:mt-32">
      <div className="mx-auto grid max-w-6xl items-end gap-0 px-4 sm:px-6 md:grid-cols-[1fr_320px] md:gap-12">
        <div className="reveal pb-14 md:py-16">
          <h2 className="max-w-[14ch] font-display text-3xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
            {t.final.title}
          </h2>
          <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-lp-navy/80">{t.final.sub}</p>
          <div className="mt-8">
            <ChatButton size="lg">{t.final.cta}</ChatButton>
          </div>
        </div>

        {/* The mascot stands on the band's bottom edge and pokes out of its top edge */}
        <div className="relative order-first h-28 md:order-last md:h-auto">
          <Image
            src="/mascot-haltev/Halvi-pose-wave.webp"
            alt="Halvi, maskot Haltev, melambai"
            width={1067}
            height={1474}
            sizes="(min-width: 768px) 340px, 200px"
            className="absolute right-0 bottom-0 h-auto w-[190px] sm:w-[240px] md:w-[320px]"
          />
        </div>
      </div>
    </section>
  );
}
