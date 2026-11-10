"use client";
import { BadgeCheck, Clock3, CircleAlert, Wallet } from "lucide-react";
import type { StatusOutput } from "@/lib/ai/ui-types";
import { rupiah } from "@/lib/format";
import { useChatActions } from "@/components/chat/chat-context";

const META = {
  unpaid: { icon: Wallet, cls: "border-amber-400/40 bg-amber-400/10 text-amber-100" },
  pending_verification: { icon: Clock3, cls: "border-volt-500/40 bg-volt-500/10 text-volt-300" },
  paid: { icon: BadgeCheck, cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" },
  rejected: { icon: CircleAlert, cls: "border-red-400/40 bg-red-400/10 text-red-200" },
} as const;

export function StatusCard({ data }: { data: StatusOutput }) {
  const { t } = useChatActions();
  const m = META[data.status];
  const Icon = m.icon;
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm animate-rise ${m.cls}`}>
      <Icon size={20} className="shrink-0" />
      <div className="min-w-0">
        <div className="font-bold">{t.status[data.status]}</div>
        <div className="break-words text-xs opacity-80">
          {data.number} · {rupiah(data.amount)} · {data.program}
        </div>
      </div>
    </div>
  );
}
