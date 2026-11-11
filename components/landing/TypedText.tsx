import type { CSSProperties } from "react";

/**
 * Typing effect with no JavaScript: every character is in the HTML from the start and is revealed by a
 * CSS animation delay (see .type-char in globals.css). Nothing re-renders, the layout never shifts, and
 * the whole sentence is available to screen readers immediately. 
 * Under prefers-reduced-motion the animation is off and the text is simply there.
 */
export function TypedText({ text, start = 300, step = 38 }: { text: string; start?: number; step?: number }) {
  return (
    <span aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="type-char"
          style={{ "--d": `${start + i * step}ms`, "--s": `${step}ms` } as CSSProperties}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Time (ms) at which a TypedText with these settings finishes. */
export const typedEnd = (text: string, start = 300, step = 38) => start + Array.from(text).length * step;
