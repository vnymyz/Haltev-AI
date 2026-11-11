"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import type { Dict } from "@/lib/i18n";

type HighlightRegistry = { set: (name: string, h: unknown) => void; delete: (name: string) => void };
const registry = (): HighlightRegistry | undefined => (CSS as unknown as { highlights?: HighlightRegistry }).highlights;
const HighlightCtor = (): (new (...r: Range[]) => unknown) | undefined =>
  (window as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;

const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "BUTTON"]);

/** Every match of `needle` in the visible text under `root`, as DOM ranges. */
function findRanges(root: HTMLElement, needle: string): Range[] {
  const out: Range[] = [];
  if (!needle) return out;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = n.parentElement;
      if (!p || SKIP.has(p.tagName) || !n.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = (node.nodeValue ?? "").toLowerCase();
    let i = 0;
    while ((i = text.indexOf(needle, i)) !== -1) {
      const r = document.createRange();
      r.setStart(node, i);
      r.setEnd(node, i + needle.length);
      out.push(r);
      i += needle.length;
    }
  }
  return out;
}

/**
 * Find inside the open conversation. Matches are painted with the CSS Custom Highlight API
 * (so React/Markdown rendering is untouched). Browsers without it still count and jump.
 * `version` changes when messages change, so results stay current while Halvi is replying.
 */
export function FindBar({
  root,
  t,
  version,
  onClose,
}: {
  root: React.RefObject<HTMLElement | null>;
  t: Dict;
  version: unknown;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [needle, setNeedle] = useState("");
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const ranges = useRef<Range[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  // Debounce typing
  useEffect(() => {
    const id = setTimeout(() => setNeedle(query.trim().toLowerCase()), 150);
    return () => clearTimeout(id);
  }, [query]);

  const paint = useCallback((list: Range[], index: number) => {
    const reg = registry();
    const H = HighlightCtor();
    if (!reg || !H) return;
    if (list.length === 0) {
      reg.delete("find");
      reg.delete("find-active");
      return;
    }
    reg.set("find", new H(...list));
    reg.set("find-active", new H(list[Math.min(index, list.length - 1)]));
  }, []);

  // Recompute matches when the query or the conversation changes
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const list = findRanges(el, needle);
    ranges.current = list;
    setTotal(list.length);
    setActive((a) => Math.min(a, Math.max(list.length - 1, 0)));
  }, [needle, version, root]);

  // Paint, and bring the active match into view
  useEffect(() => {
    paint(ranges.current, active);
  }, [active, total, paint]);

  const jump = useCallback((i: number) => {
    const r = ranges.current[i];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    r?.startContainer.parentElement?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, []);

  function step(dir: 1 | -1) {
    if (total === 0) return;
    const next = (active + dir + total) % total;
    setActive(next);
    jump(next);
  }

  // First match is shown as soon as the user stops typing
  useEffect(() => {
    if (needle && ranges.current.length) {
      setActive(0);
      jump(0);
    }
  }, [needle, jump]);

  // Clear the highlights when the bar closes
  useEffect(
    () => () => {
      registry()?.delete("find");
      registry()?.delete("find-active");
    },
    [],
  );

  return (
    <div
      role="search"
      className="absolute top-3 right-3 left-3 z-20 flex animate-rise items-center gap-1.5 rounded-xl border border-ink-700 bg-ink-900 p-1.5 shadow-[0_12px_32px_-12px_rgba(10,26,58,0.3)] sm:left-auto sm:w-[26rem]"
    >
      <Search size={17} className="ml-2 shrink-0 text-ink-400" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          else if (e.key === "Enter") {
            e.preventDefault();
            step(e.shiftKey ? -1 : 1);
          }
        }}
        placeholder={t.findPlaceholder}
        aria-label={t.findPlaceholder}
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-ink-100 placeholder:text-ink-400 focus:outline-none sm:text-sm"
      />
      <span className="shrink-0 px-1 text-xs whitespace-nowrap text-ink-400" aria-live="polite">
        {needle ? (total ? t.findCount(active + 1, total) : t.findNone) : ""}
      </span>
      <button
        onClick={() => step(-1)}
        disabled={total === 0}
        aria-label={t.findPrev}
        title={t.findPrev}
        className="rounded-lg p-2 text-ink-300 transition hover:bg-ink-800 disabled:opacity-40"
      >
        <ChevronUp size={17} />
      </button>
      <button
        onClick={() => step(1)}
        disabled={total === 0}
        aria-label={t.findNext}
        title={t.findNext}
        className="rounded-lg p-2 text-ink-300 transition hover:bg-ink-800 disabled:opacity-40"
      >
        <ChevronDown size={17} />
      </button>
      <button onClick={onClose} aria-label={t.findClose} title={t.findClose} className="rounded-lg p-2 text-ink-300 transition hover:bg-ink-800">
        <X size={17} />
      </button>
    </div>
  );
}
