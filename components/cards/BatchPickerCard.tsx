"use client";
import { useState } from "react";
import { CalendarDays, Check, Clock, MapPin, UserRound } from "lucide-react";
import { Card } from "./Card";
import { useChatActions } from "@/components/chat/chat-context";
import type { BatchesOutput } from "@/lib/ai/ui-types";
import { hhmm, modeLabel, rupiah, shortDate } from "@/lib/format";
import type { Dict } from "@/lib/i18n";

export function BatchPickerCard({ data, active }: { data: BatchesOutput; active: boolean }) {
  const { send, busy, t, lang } = useChatActions();
  const [picked, setPicked] = useState<number | null>(null);
  const dayType = (d: string) => t.dayType[d] ?? d;

  if (data.flexible_schedule) {
    return (
      <Card title={data.program.name} icon={<CalendarDays size={15} className="text-volt-400" />}>
        <p className="text-sm text-ink-300">{t.flexible}</p>
        <PriceRow prices={data.prices} />
      </Card>
    );
  }

  const priceFor = (d: string) => data.prices.find((p) => p.package === (d === "weekend" ? "weekend" : "weekday"))?.price;

  return (
    <Card title={`${t.schedule} · ${data.program.name}`} icon={<CalendarDays size={15} className="text-volt-400" />}>
      <PriceRow prices={data.prices} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-2.5">
        {data.batches.map((b) => {
          const full = b.seats_left <= 0;
          const chosen = picked === b.id;
          const price = priceFor(b.day_type);
          return (
            <button
              key={b.id}
              disabled={full || !active || busy || picked != null}
              onClick={() => {
                setPicked(b.id);
                send(
                  t.pickedMsg(
                    String(b.batch_no ?? "-"),
                    `${dayType(b.day_type)}, ${b.days}, ${hhmm(b.time_start)}–${hhmm(b.time_end)}`,
                    data.program.name,
                    b.id,
                  ),
                );
              }}
              className={`relative rounded-xl border p-3 text-left text-sm transition active:scale-[0.99] ${
                chosen
                  ? "border-volt-400 bg-volt-500/15"
                  : full
                    ? "cursor-not-allowed border-ink-800 bg-ink-950/50 opacity-50"
                    : "border-ink-700 bg-ink-950/40 enabled:hover:border-volt-500/60 enabled:hover:bg-ink-850"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-ink-100">
                  Batch {b.batch_no ?? "–"} <span className="font-medium text-volt-300">· {dayType(b.day_type)}</span>
                </span>
                {chosen && <Check size={16} className="shrink-0 text-volt-300" />}
              </div>
              <div className="mt-2 space-y-1 text-[13px] text-ink-300">
                <div className="flex items-start gap-1.5"><CalendarDays size={13} className="mt-0.5 shrink-0" /> {b.days} · {shortDate(b.start_date, lang)}</div>
                <div className="flex items-center gap-1.5"><Clock size={13} className="shrink-0" /> {hhmm(b.time_start)}–{hhmm(b.time_end)} WIB</div>
                <div className="flex items-center gap-1.5"><MapPin size={13} className="shrink-0" /> {modeLabel(b.mode)}</div>
                {b.tutor && <div className="flex items-center gap-1.5"><UserRound size={13} className="shrink-0" /> {b.tutor}</div>}
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                <SeatDots left={b.seats_left} cap={b.capacity} t={t} />
                {price && data.program.category !== "course" && <span className="text-xs font-semibold text-ink-100">{rupiah(price)}</span>}
              </div>
            </button>
          );
        })}
      </div>
      {active && picked == null && <p className="mt-3 text-xs text-ink-400">{t.pickHint}</p>}
    </Card>
  );
}

function SeatDots({ left, cap, t }: { left: number; cap: number; t: Dict }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: cap }).map((_, i) => (
          <span key={i} className={`h-1.5 w-3 rounded-full ${i < cap - left ? "bg-ink-600" : "bg-emerald-400"}`} />
        ))}
      </div>
      <span className={`text-[11px] ${left <= 0 ? "text-red-300" : left <= 1 ? "text-amber-200" : "text-emerald-300"}`}>{t.seats(left)}</span>
    </div>
  );
}

function PriceRow({ prices }: { prices: BatchesOutput["prices"] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {prices.map((p) => (
        <div key={p.package} className="rounded-lg border border-ink-700 bg-ink-950/50 px-2.5 py-1.5 text-xs">
          <span className="capitalize text-ink-400">{p.package}</span> <span className="font-bold text-ink-100">{rupiah(p.price)}</span>
          {p.normal_price && <span className="ml-1 text-ink-400 line-through">{rupiah(p.normal_price)}</span>}
        </div>
      ))}
    </div>
  );
}
