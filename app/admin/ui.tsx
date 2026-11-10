export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-800">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-ink-900 text-left text-xs uppercase tracking-wider text-ink-400">
          <tr>{head.map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-ink-800 text-ink-100">{children}</tbody>
      </table>
    </div>
  );
}

export const td = "px-3 py-2.5 align-top";

const BADGE: Record<string, string> = {
  new: "bg-volt-500/15 text-volt-300",
  contacted: "bg-indigo-400/15 text-indigo-200",
  registered: "bg-amber-400/15 text-amber-200",
  paid: "bg-emerald-400/15 text-emerald-200",
  lost: "bg-ink-700 text-ink-300",
  unpaid: "bg-amber-400/15 text-amber-200",
  pending_verification: "bg-volt-500/15 text-volt-300",
  rejected: "bg-red-400/15 text-red-200",
  pending: "bg-volt-500/15 text-volt-300",
  approved: "bg-emerald-400/15 text-emerald-200",
  pending_payment: "bg-amber-400/15 text-amber-200",
  confirmed: "bg-emerald-400/15 text-emerald-200",
};

export function Badge({ v }: { v: string }) {
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE[v] ?? "bg-ink-700"}`}>{v.replace(/_/g, " ")}</span>;
}

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-white">{children}</h1>;
}

export const when = (d: string) =>
  new Date(d).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
