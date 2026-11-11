"use client";
import { ArrowDown } from "lucide-react";

/** Round button above the composer. Appears when the reader is away from the newest message. */
export function ScrollToLatest({
  visible,
  hasNew,
  label,
  onClick,
}: {
  visible: boolean;
  hasNew: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`absolute bottom-4 left-1/2 z-10 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-ink-700 bg-ink-900 text-ink-100 shadow-[0_8px_24px_-8px_rgba(10,26,58,0.35)] transition-[opacity,transform] duration-300 ease-soft hover:border-volt-500/60 hover:text-volt-400 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowDown size={19} />
      {hasNew && <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-ink-900 bg-volt-500" />}
    </button>
  );
}
