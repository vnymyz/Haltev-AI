"use client";
import type Lenis from "lenis";
import { useEffect, useRef, type RefObject } from "react";

/**
 * Smooth wheel scrolling for an element that scrolls on its own (its first child is the content).
 * Returns a ref to the Lenis instance (null until it has loaded, or when reduced motion is on), so the
 * caller can scroll through it with lenis.scrollTo() and keep wheel and programmatic scrolling in sync.
 */
export function useContainerSmoothScroll(wrapper: RefObject<HTMLElement | null>) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const el = wrapper.current;
    const content = el?.firstElementChild as HTMLElement | null;
    if (!el || !content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let instance: Lenis | undefined;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      instance = new Lenis({
        wrapper: el,
        content,
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        autoRaf: true,
      });
      lenis.current = instance;
    });

    return () => {
      cancelled = true;
      instance?.destroy();
      lenis.current = null;
    };
  }, [wrapper]);

  return lenis;
}
