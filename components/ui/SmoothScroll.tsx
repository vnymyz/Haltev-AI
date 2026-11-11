"use client";
import { useEffect } from "react";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Smooth, eased mouse-wheel scrolling for a whole page (Lenis). It starts after the page has loaded so it
 * never competes with first paint, leaves touch scrolling to the phone, and is skipped for people who prefer
 * reduced motion. Anchor links (#section) glide to their target, `anchorOffset` px below the top.
 */
export function SmoothScroll({ anchorOffset = 0 }: { anchorOffset?: number }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let destroy: (() => void) | undefined;

    const start = () => {
      timer = setTimeout(async () => {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          autoRaf: true,
          anchors: { offset: anchorOffset },
        });
        setLenis(lenis);
        destroy = () => {
          lenis.destroy();
          setLenis(null);
        };
      }, 400);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      if (timer) clearTimeout(timer);
      destroy?.();
    };
  }, [anchorOffset]);
  return null;
}
