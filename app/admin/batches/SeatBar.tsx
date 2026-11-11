/** Filled seats as a row of small bars, with the count underneath. */
export function SeatBar({ taken, cap, showText = true }: { taken: number; cap: number; showText?: boolean }) {
  const left = cap - taken;
  return (
    <div>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: cap }).map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < taken ? "bg-volt-500" : "bg-ink-700"}`} />
        ))}
      </div>
      {showText && (
        <div className={`mt-1 text-xs ${left <= 0 ? "font-semibold text-red-300" : "text-ink-400"}`}>
          {left <= 0 ? "Penuh" : `${taken} dari ${cap} kursi terisi`}
        </div>
      )}
    </div>
  );
}
