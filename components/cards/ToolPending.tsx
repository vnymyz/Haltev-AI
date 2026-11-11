import { HexLoader } from "@/components/ui/HexLoader";

export function ToolPending({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/80 px-3 py-1.5 text-xs text-ink-300">
      <HexLoader size={15} className="text-volt-500" />
      {label}
    </div>
  );
}
