// Small shared pieces for the admin pages. Status is a colored dot plus a word.

export const STATUS: Record<string, { label: string; dot: string }> = {
  // leads
  new: { label: "Baru", dot: "bg-volt-500" },
  contacted: { label: "Sudah dihubungi", dot: "bg-amber-400" },
  registered: { label: "Terdaftar", dot: "bg-amber-400" },
  paid: { label: "Lunas", dot: "bg-emerald-400" },
  lost: { label: "Batal", dot: "bg-ink-600" },
  // invoices
  unpaid: { label: "Belum dibayar", dot: "bg-amber-400" },
  pending_verification: { label: "Menunggu dicek", dot: "bg-volt-500" },
  rejected: { label: "Ditolak", dot: "bg-lp-red" },
  // proofs
  pending: { label: "Menunggu dicek", dot: "bg-volt-500" },
  approved: { label: "Disetujui", dot: "bg-emerald-400" },
};

export function StatusDot({ v }: { v: string }) {
  const s = STATUS[v] ?? { label: v.replace(/_/g, " "), dot: "bg-ink-400" };
  return (
    <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap">
      <span className={`size-2 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function PageTitle({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">{children}</h1>
      {sub && <p className="mt-2 max-w-[60ch] text-[15px] text-ink-300">{sub}</p>}
    </div>
  );
}

export const when = (d: string) =>
  new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });

export const waLink = (p: string | null) => (p ? `https://wa.me/${p.replace(/^0/, "62").replace(/\D/g, "")}` : null);
