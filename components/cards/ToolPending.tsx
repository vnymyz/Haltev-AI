import { Loader2 } from "lucide-react";

export function ToolPending({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/80 px-3 py-1.5 text-xs text-ink-300">
      <Loader2 size={13} className="animate-spin text-volt-400" />
      {label}
    </div>
  );
}
