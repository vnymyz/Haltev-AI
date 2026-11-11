export function Card({
  title,
  icon,
  children,
  accent = "volt",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  accent?: "volt" | "amber" | "emerald";
}) {
  // Only the left edge carries the accent: it tells you what kind of card this is.
  const edge = {
    volt: "border-l-volt-500",
    amber: "border-l-amber-300",
    emerald: "border-l-emerald-400",
  }[accent];
  return (
    <div className={`overflow-hidden rounded-xl border border-ink-700 border-l-4 bg-ink-900 ${edge} animate-rise`}>
      <div className="flex items-center gap-2 border-b border-ink-700/70 px-4 py-2.5 text-sm font-bold text-ink-100">
        {icon}
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
