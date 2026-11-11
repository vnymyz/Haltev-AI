import Link from "next/link";
import { db, PROOF_BUCKET } from "@/lib/db/supabase";
import { rupiah } from "@/lib/format";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { approveProof, rejectProof } from "../actions";
import { PageTitle, StatusDot, waLink, when } from "../ui";

type ProofRow = {
  id: string;
  file_path: string;
  amount_match: boolean | null;
  merchant_match: boolean | null;
  ai_note: string | null;
  review_status: string;
  uploaded_at: string;
  extracted_json: {
    amount?: number | null;
    payment_app?: string | null;
    merchant_or_recipient?: string | null;
    reference_id?: string | null;
  } | null;
  invoices: {
    id: string;
    number: string;
    amount: number;
    status: string;
    registrations: { leads: { name: string; phone: string | null }; programs: { name: string } };
  };
};

type InvoiceRow = {
  id: string;
  number: string;
  amount: number;
  status: string;
  created_at: string;
  registrations: { package: string; leads: { name: string }; programs: { name: string } };
};

const INVOICE_FILTERS = [
  ["", "Semua"],
  ["unpaid", "Belum dibayar"],
  ["pending_verification", "Menunggu dicek"],
  ["paid", "Lunas"],
  ["rejected", "Ditolak"],
] as const;

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "" } = await searchParams;

  const { data: proofsRaw } = await db()
    .from("payment_proofs")
    .select("*, invoices!inner(id, number, amount, status, registrations!inner(leads!inner(name, phone), programs!inner(name)))")
    .order("uploaded_at", { ascending: false })
    .limit(100);
  const proofs = (proofsRaw ?? []) as unknown as ProofRow[];

  // Short-lived signed URLs so the private screenshots can be shown to admin
  const signed = proofs.length
    ? ((await db().storage.from(PROOF_BUCKET).createSignedUrls(proofs.map((p) => p.file_path), 60 * 30)).data ?? [])
    : [];
  const urlFor = (path: string) => signed.find((s) => s.path === path)?.signedUrl ?? undefined;

  let invoiceQuery = db()
    .from("invoices")
    .select("id, number, amount, status, created_at, registrations!inner(package, leads!inner(name), programs!inner(name))")
    .order("created_at", { ascending: false })
    .limit(100);
  if (INVOICE_FILTERS.some(([v]) => v && v === status)) invoiceQuery = invoiceQuery.eq("status", status);
  const { data: invoicesRaw } = await invoiceQuery;
  const invoices = (invoicesRaw ?? []) as unknown as InvoiceRow[];

  const pending = proofs.filter((p) => p.review_status === "pending");
  const reviewed = proofs.filter((p) => p.review_status !== "pending");

  return (
    <>
      <PageTitle sub="Cocokkan nominal dan penerima di screenshot dengan tagihan, lalu verifikasi atau tolak. Hasil baca AI hanya bantuan, keputusan tetap di kamu.">
        Pembayaran
      </PageTitle>

      <h2 className="mb-4 text-lg font-bold">
        Menunggu dicek <span className="font-normal text-ink-400">({pending.length})</span>
      </h2>
      {pending.length === 0 && (
        <p className="mb-10 rounded-xl border border-ink-700 bg-ink-900 p-5 text-[15px] text-ink-300">
          Tidak ada bukti baru. Bukti yang diunggah pelanggan akan muncul di sini.
        </p>
      )}
      <div className="mb-12 space-y-5">
        {pending.map((p) => (
          <ProofCard key={p.id} p={p} url={urlFor(p.file_path)} />
        ))}
      </div>

      <h2 className="mb-4 text-lg font-bold">Semua invoice</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {INVOICE_FILTERS.map(([v, label]) => (
          <Link
            key={label}
            href={v ? `/admin/payments?status=${v}` : "/admin/payments"}
            aria-current={status === v ? "true" : undefined}
            className={`inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors duration-200 ease-soft ${
              status === v ? "border-lp-navy bg-lp-navy text-white" : "border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-600 hover:text-ink-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <ul className="mb-12 divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-900">
        {invoices.length === 0 && <li className="p-5 text-[15px] text-ink-400">Tidak ada invoice di kategori ini.</li>}
        {invoices.map((i) => (
          <li key={i.id} className="grid gap-x-6 gap-y-2 px-4 py-3.5 md:grid-cols-[1.4fr_1.2fr_auto_auto] md:items-center">
            <div className="min-w-0">
              <div className="font-semibold">{i.registrations.leads.name}</div>
              <div className="truncate text-sm text-ink-400">
                {i.number}, {when(i.created_at)}
              </div>
            </div>
            <div className="min-w-0 truncate text-sm">
              {i.registrations.programs.name} <span className="text-ink-400">({i.registrations.package})</span>
            </div>
            <div className="font-display text-base font-bold">{rupiah(i.amount)}</div>
            <div className="flex items-center gap-4">
              <StatusDot v={i.status} />
              <a href={`/api/invoice/${i.id}/pdf`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-volt-400 hover:underline">
                PDF
              </a>
            </div>
          </li>
        ))}
      </ul>

      {reviewed.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-bold">Sudah dicek</h2>
          <div className="space-y-5">
            {reviewed.map((p) => (
              <ProofCard key={p.id} p={p} url={urlFor(p.file_path)} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function Check({ ok, label }: { ok: boolean | null; label: string }) {
  const text = ok == null ? "tidak terbaca" : ok ? "cocok" : "tidak cocok";
  const cls = ok == null ? "text-ink-400" : ok ? "text-emerald-300" : "text-red-300";
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink-300">{label}</span>
      <span className={`font-semibold ${cls}`}>{text}</span>
    </div>
  );
}

/** Split view: the screenshot on the left, the facts and the decision on the right. */
function ProofCard({ p, url }: { p: ProofRow; url?: string }) {
  const inv = p.invoices;
  const lead = inv.registrations.leads;
  const ex = p.extracted_json;
  const wa = waLink(lead.phone);
  return (
    <article className="grid overflow-hidden rounded-xl border border-ink-700 bg-ink-900 md:grid-cols-[minmax(0,17rem)_1fr]">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="block bg-ink-800" title="Buka gambar penuh">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Bukti pembayaran ${inv.number}`} className="mx-auto max-h-80 w-full object-contain md:max-h-[26rem]" />
        </a>
      ) : (
        <div className="flex items-center justify-center bg-ink-800 p-8 text-sm text-ink-400">Gambar tidak tersedia</div>
      )}

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="text-lg font-bold">{lead.name}</div>
            <div className="text-sm text-ink-400">
              {inv.number}, diunggah {when(p.uploaded_at)}
            </div>
          </div>
          <StatusDot v={p.review_status} />
        </div>

        <div className="text-[15px]">
          {inv.registrations.programs.name}
          {wa && (
            <>
              {". "}
              <a href={wa} target="_blank" rel="noreferrer" className="font-medium text-volt-400 hover:underline">
                Chat {lead.phone}
              </a>
            </>
          )}
        </div>

        <div className="space-y-1.5 rounded-lg border border-ink-700 bg-ink-950 p-3.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-300">Tagihan</span>
            <span className="font-display font-bold">{rupiah(inv.amount)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-300">Terbaca di screenshot</span>
            <span className="font-display font-bold">{ex?.amount != null ? rupiah(ex.amount) : "tidak terbaca"}</span>
          </div>
          <Check ok={p.amount_match} label="Nominal" />
          <Check ok={p.merchant_match} label="Penerima adalah Haltev" />
          {ex?.payment_app && (
            <div className="pt-1 text-xs text-ink-400">
              {ex.payment_app}, {ex.merchant_or_recipient ?? "penerima tidak terbaca"}, ref {ex.reference_id ?? "tidak ada"}
            </div>
          )}
        </div>

        {p.review_status === "pending" && (
          <div className="flex flex-wrap gap-2 pt-1">
            <form action={approveProof}>
              <input type="hidden" name="proofId" value={p.id} />
              <SubmitButton className="min-h-11 rounded-lg bg-emerald-400 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-300">
                Verifikasi lunas
              </SubmitButton>
            </form>
            <form action={rejectProof}>
              <input type="hidden" name="proofId" value={p.id} />
              <SubmitButton className="min-h-11 rounded-lg border border-red-300 px-5 text-sm font-bold text-red-300 transition-colors hover:bg-red-300/10">
                Tolak
              </SubmitButton>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
