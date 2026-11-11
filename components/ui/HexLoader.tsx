/**
 * The loading animation used everywhere: the Haltev hexagon with a bright segment that keeps
 * running around its edge. Pure SVG + CSS (see .hex-loader in globals.css), so it works in
 * server and client components. Color follows `currentColor`.
 */
export function HexLoader({ size = 24, className = "", label }: { size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`hex-loader shrink-0 ${className}`}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={9}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <polygon className="hex-track" points="50,5 92,27.5 92,72.5 50,95 8,72.5 8,27.5" pathLength={100} />
      <polygon className="hex-run" points="50,5 92,27.5 92,72.5 50,95 8,72.5 8,27.5" pathLength={100} />
    </svg>
  );
}

/** Centered loader with an optional caption, for page and panel loading states. */
export function LoadingBlock({ caption, className = "" }: { caption?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-lp-royal ${className}`}>
      <HexLoader size={44} label={caption ?? "Loading"} />
      {caption && <p className="text-sm text-lp-muted">{caption}</p>}
    </div>
  );
}
