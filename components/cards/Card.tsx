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
  const ring = {
    volt: "border-volt-500/35 from-volt-500/10",
    amber: "border-amber-400/35 from-amber-400/10",
    emerald: "border-emerald-400/35 from-emerald-400/10",
  }[accent];
  return (
    <div className={`overflow-hidden rounded-2xl border bg-gradient-to-b to-ink-900 ${ring} animate-rise`}>
      <div className="flex items-center gap-2 border-b border-ink-700/60 px-4 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-100">
        {icon}
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
