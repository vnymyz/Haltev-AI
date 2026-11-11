"use client";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { LandingCopy } from "@/lib/landing-i18n";
import { TypedText, typedEnd } from "./TypedText";

// Pointy-top hexagon, the same shape as the Haltev logo. Aspect ratio 748 : 864 matches the video crop.
const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

// The greeting starts typing when the headline (36 characters at 36 ms) is nearly done.
const GREETING_START = 1700;
const GREETING_STEP = 30;

export function MascotPlate({ hero }: { hero: LandingCopy["hero"] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Play the waving video only while it is on screen, and never for reduced-motion or data-saver users.
  // Until it plays, the poster image underneath is what people (and Lighthouse) see.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    let io: IntersectionObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      timer = setTimeout(() => {
        io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) v.play().catch(() => {});
            else v.pause();
          },
          { threshold: 0.35 },
        );
        io.observe(v);
      }, 2500);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      if (timer) clearTimeout(timer);
      io?.disconnect();
    };
  }, []);

  const chipsAt = typedEnd(hero.greeting, GREETING_START, GREETING_STEP) + 150;

  return (
    <div className="relative">
      <div className="relative mx-auto w-[min(72vw,380px)] animate-plate lg:mr-0 lg:ml-auto lg:w-[min(100%,430px)]">
        {/* Offset outline: the plate looks like it sits on a second hexagon */}
        <svg
          viewBox="0 0 100 115.47"
          className="absolute inset-0 size-full translate-x-[7%] translate-y-[5%] overflow-visible"
          aria-hidden="true"
        >
          <polygon
            points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87"
            fill="none"
            stroke="#1e63e0"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>

        <div className="relative aspect-[748/864] bg-lp-sky" style={{ clipPath: HEX }}>
          {/* The poster is a real <img> (preloaded, high priority) so the first paint does not wait for the video */}
          <Image
            src="/mascot-haltev/Halvi-Waving-poster.webp"
            alt="Halvi, maskot Haltev"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 430px, 72vw"
            className="object-cover"
          />
          <video
            ref={videoRef}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
          >
            <source src="/mascot-haltev/Halvi-Waving-web.mp4" type="video/mp4" />
            <source src="/mascot-haltev/Halvi-Waving-web.webm" type="video/webm" />
          </video>
        </div>
      </div>

      {/* Halvi's greeting types after the headline. Always below the plate (never over the mascot),
          clear of the offset outline. */}
      <div className="relative z-10 mx-auto mt-8 w-[min(100%,340px)] lg:mr-0 lg:ml-auto lg:mt-10 lg:w-[min(100%,430px)]">
        <div className="relative rounded-2xl rounded-bl-sm border border-lp-line bg-white p-4 shadow-[0_10px_30px_-12px_rgba(10,26,58,0.35)]">
          <p className="min-h-[2.6rem] text-[15px] leading-snug font-semibold text-lp-navy" aria-label={hero.greeting}>
            <TypedText text={hero.greeting} start={GREETING_START} step={GREETING_STEP} />
          </p>
          <ul className="chips-in mt-3 flex min-h-[5rem] flex-wrap content-start gap-2" style={{ "--d": `${chipsAt}ms` } as CSSProperties}>
            {hero.chips.map((c) => (
              <li key={c.label}>
                <Link
                  href={`/chat?q=${encodeURIComponent(c.ask)}`}
                  className="inline-flex min-h-9 items-center rounded-full border border-lp-royal/40 px-3 py-1.5 text-[13px] font-medium text-lp-royal transition-colors hover:bg-lp-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-royal"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
