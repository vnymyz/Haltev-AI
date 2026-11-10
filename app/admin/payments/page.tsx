import { db, PROOF_BUCKET } from "@/lib/db/supabase";
import { rupiah } from "@/lib/format";
import { approveProof, rejectProof } from "../actions";
import { Badge, H1, Table, td, when } from "../ui";

type ProofRow = {
  id: string;
  file_path: string;
  amount_match: boolean | null;
  merchant_match: boolean | null;
  ai_note: string | null;
  review_status: string;
  uploaded_at: string;
  extracted_json: { amount?: number | null; payment_app?: string | null; merchant_or_recipient?: string | null; reference_id?: string | null } | null;
  invoices: { id: string; number: string; amount: number; status: string; registrations: { leads: { name: string; phone: string | null }; programs: { name: string } } };
};

export default async function PaymentsPage() {
  const { data: proofsRaw } = await db()
    .from("payment_proofs")
    .select("*, invoices!inner(id, number, amount, status, registrations!inner(leads!inner(name, phone), programs!inner(name)))")
    .order("uploaded_at", { ascending: false })
    .limit(100);
  const proofs = (proofsRaw ?? []) as unknown as ProofRow[];

  // Short-lived signed URLs so the private screenshots can be shown to admin
  const signed = proofs.length
    ? (await db().storage.from(PROOF_BUCKET).createSignedUrls(proofs.map((p) => p.file_path), 60 * 30)).data ?? []
    : [];
  const urlFor = (path: string) => signed.find((s) => s.path === path)?.signedUrl;

  const { data: invoices } = await db()
    .from("invoices")
    .select("id, number, amount, status, created_at, registrations!inner(package, leads!inner(name), programs!inner(name))")
    .order("created_at", { ascending: false })
    .limit(100);

  const pending = proofs.filter((p) => p.review_status === "pending");
  const reviewed = proofs.filter((p) => p.review_status !== "pending");

  return (
    <>
      <H1>Pembayaran</H1>

      <h2 className="mb-3 font-bold text-white">
        Bukti menunggu verifikasi <span className="text-amber-300">({pending.length})</span>
      </h2>
      {pending.length === 0 && <p className="mb-6 text-sm text-ink-400">Tidak ada bukti baru.</p>}
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pending.map((p) => <ProofCard key={p.id} p={p} url={urlFor(p.file_path) ?? undefined} />)}
      </div>

      <h2 className="mb-3 font-bold text-white">Semua invoice</h2>
      <Table head={["Dibuat", "No. Invoice", "Nama", "Program", "Paket", "Jumlah", "Status", ""]}>
        {(invoices ?? []).map((i) => {
          const reg = i.registrations as unknown as { package: string; leads: { name: string }; programs: { name: string } };
          return (
            <tr key={i.id}>
              <td className={td}>{when(i.created_at)}</td>
              <td className={`${td} font-mono text-xs`}>{i.number}</td>
              <td className={td}>{reg.leads.name}</td>
              <td className={td}>{reg.programs.name}</td>
              <td className={`${td} capitalize`}>{reg.package}</td>
              <td className={td}>{rupiah(i.amount)}</td>
              <td className={td}><Badge v={i.status} /></td>
              <td className={td}>
                <a href={`/api/invoice/${i.id}/pdf`} target="_blank" rel="noreferrer" className="text-xs text-volt-400 hover:underline">PDF</a>
              </td>
            </tr>
          );
        })}
      </Table>

      {reviewed.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 font-bold text-white">Riwayat review bukti</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviewed.map((p) => <ProofCard key={p.id} p={p} url={urlFor(p.file_path) ?? undefined} />)}
          </div>
        </>
      )}
    </>
  );
}

function Check({ ok, label }: { ok: boolean | null; label: string }) {
  const cls = ok == null ? "text-ink-400" : ok ? "text-emerald-300" : "text-red-300";
  return <span className={cls}>{ok == null ? "?" : ok ? "✓" : "✗"} {label}</span>;
}

function ProofCard({ p, url }: { p: ProofRow; url?: string }) {
  const inv = p.invoices;
  const ex = p.extracted_json;
  return (
    <div className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="block bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Bukti pembayaran" className="mx-auto max-h-72 object-contain" />
        </a>
      ) : (
        <div className="p-6 text-center text-sm text-ink-400">Gambar tidak tersedia</div>
      )}
      <div className="space-y-2 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-ink-300">{inv.number}</span>
          <Badge v={p.review_status} />
        </div>
        <div className="font-semibold text-white">{inv.registrations.leads.name}</div>
        <div className="text-ink-300">{inv.registrations.programs.name}</div>
        <div className="text-ink-300">
          Tagihan <b className="text-white">{rupiah(inv.amount)}</b> · Terbaca AI <b className="text-white">{ex?.amount != null ? rupiah(ex.amount) : "-"}</b>
        </div>
        <div className="flex flex-wrap gap-x-4 text-xs">
          <Check ok={p.amount_match} label="Nominal" />
          <Check ok={p.merchant_match} label="Penerima Haltev" />
        </div>
        {ex?.payment_app && <div className="text-xs text-ink-400">{ex.payment_app} · {ex.merchant_or_recipient} · ref {ex.reference_id ?? "-"}</div>}
        <div className="rounded-lg bg-ink-950/60 p-2 text-xs text-ink-300">🤖 {p.ai_note ?? "-"}</div>
        <div className="text-xs text-ink-400">Diupload {when(p.uploaded_at)}</div>
        {p.review_status === "pending" && (
          <div className="flex gap-2 pt-1">
            <form action={approveProof} className="flex-1">
              <input type="hidden" name="proofId" value={p.id} />
              <button className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-bold text-ink-950 hover:bg-emerald-400">Verifikasi lunas</button>
            </form>
            <form action={rejectProof} className="flex-1">
              <input type="hidden" name="proofId" value={p.id} />
              <button className="w-full rounded-lg border border-red-400/50 py-2 text-sm font-bold text-red-200 hover:bg-red-400/10">Tolak</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
