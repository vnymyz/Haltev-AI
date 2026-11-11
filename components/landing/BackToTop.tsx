"use client";

import { useEffect, useState } from "react";
import { getLenis } from "@/lib/smooth-scroll";
import { focusRing } from "./ui";

/** Appears after about a screen and a half of scrolling; scrolls back to the top. */
export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      onClick={() => {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.4 });
          return;
        }
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed right-4 bottom-4 z-40 flex size-12 items-center justify-center rounded-full bg-lp-navy text-white shadow-[0_8px_24px_-8px_rgba(10,26,58,0.5)] transition-[opacity,transform,background-color] duration-300 ease-soft hover:bg-lp-royal active:scale-95 sm:right-6 sm:bottom-6 ${focusRing} ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
    </button>
  );
}
