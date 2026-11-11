"use client";
import { useEffect } from "react";

/**
 * Fade-to-reveal for the landing page. Elements marked .reveal that are below the fold start hidden and
 * fade up (about 1 s) the first time they scroll into view. Elements that appear together are staggered.
 * Anything already on screen, and everyone who prefers reduced motion, just sees the content.
 */
export function RevealFallback() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--rd", `${Math.min(n, 5) * 90}ms`);
          n += 1;
          // Next frame, so the hidden state has been painted and the transition actually runs
          requestAnimationFrame(() => el.classList.add("is-in"));
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    for (const el of els) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) continue; // already visible
      el.classList.add("reveal-js");
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}
