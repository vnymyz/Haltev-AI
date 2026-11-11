"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Thin progress bar that starts the moment an internal link is clicked, so there is feedback even while the
 * server is still working out the next page (before the page's own loading screen can appear).
 */
export function NavProgress() {
  const path = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => setActive(false), [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      setActive(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // never leave the bar hanging if a navigation fails
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => setActive(false), 15000);
    return () => clearTimeout(id);
  }, [active]);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]" role="progressbar" aria-label="Loading">
      <div className="nav-progress h-full bg-lp-royal" />
    </div>
  );
}
