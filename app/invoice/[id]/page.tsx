import Image from "next/image";
import { notFound } from "next/navigation";
import { getInvoiceDetail } from "@/lib/db/queries";
import { HALTEV } from "@/lib/constants";
import { dayTypeLabel, hhmm, modeLabel, rupiah, shortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_CLS = {
  unpaid: "bg-amber-100 text-amber-800",
  pending_verification: "bg-blue-100 text-blue-800",
  paid: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
} as const;

const T = {
  id: {
    status: { unpaid: "Belum dibayar", pending_verification: "Menunggu verifikasi", paid: "Lunas", rejected: "Bukti ditolak" },
    billTo: "Ditagihkan kepada", issued: "Terbit", due: "Jatuh tempo", desc: "Deskripsi", amount: "Jumlah", pkg: "Paket",
    starts: "mulai", flexible: "Jadwal fleksibel", flexibleAdmin: " (diatur dengan admin)",
    scan: "1. Scan QRIS", orBank: "2. atau Transfer Bank", acc: "No. rek", payExact: "Bayar tepat",
    after: "Setelah bayar, kirim screenshot bukti ke Halvi di chat untuk diverifikasi admin.",
    dl: "Download PDF", open: "Buka PDF", dlQris: "Download QRIS",
    note: `Pembayaran hanya sah ke QRIS / rekening di atas a.n. ${HALTEV.legalName}. Tidak ada refund. Pembayaran dinyatakan lunas setelah diverifikasi admin Haltev. Pertanyaan:`,
  },
  en: {
    status: { unpaid: "Unpaid", pending_verification: "Waiting for verification", paid: "Paid", rejected: "Proof rejected" },
    billTo: "Billed to", issued: "Issued", due: "Due", desc: "Description", amount: "Amount", pkg: "Package",
    starts: "starts", flexible: "Flexible schedule", flexibleAdmin: " (arranged with admin)",
    scan: "1. Scan QRIS", orBank: "2. or Bank Transfer", acc: "Account no.", payExact: "Pay exactly",
    after: "After paying, send the payment screenshot to Halvi in the chat so our admin can verify it.",
    dl: "Download PDF", open: "Open PDF", dlQris: "Download QRIS",
    note: `Payments are only valid to the QRIS / account above (${HALTEV.legalName}). No refunds. Payment is confirmed after verification by the Haltev admin team. Questions:`,
  },
};

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const lang = (await searchParams).lang === "en" ? "en" : "id";
  const t = T[lang];
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const inv = await getInvoiceDetail({ id });
  if (!inv) notFound();
  const b = inv.batch;

  return (
    <div lang={lang} className="min-h-dvh bg-slate-100 px-3 py-4 text-slate-900 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#071431] px-4 py-4 text-white sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <Image src={HALTEV.logo} alt="Haltev" width={44} height={44} />
            <div>
              <div className="font-extrabold">{HALTEV.brand}</div>
              <div className="text-xs text-slate-300">{HALTEV.legalName}</div>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-xl font-extrabold tracking-wide">INVOICE</div>
            <div className="font-mono text-sm text-cyan-300">{inv.number}</div>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase text-slate-500">{t.billTo}</div>
              <div className="font-bold">{inv.lead.name}</div>
              <div className="break-all text-sm text-slate-600">{inv.lead.email}</div>
              <div className="text-sm text-slate-600">{inv.lead.phone}</div>
            </div>
            <div className="text-sm sm:text-right">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLS[inv.status]}`}>{t.status[inv.status]}</span>
              <div className="mt-2 text-slate-600">{t.issued}: {shortDate(inv.created_at, lang)}</div>
              <div className="text-slate-600">{t.due}: {shortDate(inv.due_at, lang)}</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200">
            <div className="flex justify-between bg-slate-50 px-4 py-2 text-xs font-bold uppercase text-slate-500">
              <span>{t.desc}</span>
              <span>{t.amount}</span>
            </div>
            <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4">
              <div>
                <div className="font-semibold">{inv.program.name}</div>
                <div className="text-sm capitalize text-slate-500">{t.pkg}: {inv.package}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {b
                    ? `Batch ${b.batch_no ?? "-"} · ${dayTypeLabel(b.day_type)} · ${b.days} · ${hhmm(b.time_start)}–${hhmm(b.time_end)} WIB · ${t.starts} ${shortDate(b.start_date, lang)} · ${modeLabel(b.mode)}${b.tutor ? ` · Tutor ${b.tutor}` : ""}`
                    : `${t.flexible}${inv.schedule_note ? `: ${inv.schedule_note}` : t.flexibleAdmin}`}
                </div>
              </div>
              <div className="font-semibold sm:whitespace-nowrap">{rupiah(inv.amount)}</div>
            </div>
            <div className="flex justify-between rounded-b-xl bg-[#0B3D91] px-4 py-3 font-extrabold text-white">
              <span>TOTAL</span>
              <span>{rupiah(inv.amount)}</span>
            </div>
          </div>

          {inv.status !== "paid" && (
            <div className="grid gap-5 rounded-xl border border-cyan-300 p-4 sm:grid-cols-[auto_1fr]">
              <Image src={HALTEV.qris.image} alt="QRIS Haltev" width={180} height={255} className="mx-auto h-auto w-44" />
              <div className="space-y-1 text-sm">
                <div className="font-bold">{t.scan}</div>
                <div>{HALTEV.qris.merchant} · NMID {HALTEV.qris.nmid}</div>
                <div className="pt-2 font-bold">{t.orBank}</div>
                <div>{HALTEV.bank.name}</div>
                <div>{t.acc} <b>{HALTEV.bank.account}</b> a.n. {HALTEV.bank.holder}</div>
                <div className="pt-2 font-bold">{t.payExact} {rupiah(inv.amount)}</div>
                <div className="text-slate-600">{t.after}</div>
              </div>
            </div>
          )}

          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <a href={`/api/invoice/${inv.id}/pdf?download=1`} className="rounded-lg bg-[#0B3D91] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0a3480]">
              {t.dl}
            </a>
            <a href={`/api/invoice/${inv.id}/pdf`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold hover:bg-slate-50">
              {t.open}
            </a>
            <a href={HALTEV.qris.image} download="QRIS-Haltev.png" className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold hover:bg-slate-50">
              {t.dlQris}
            </a>
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            {t.note} WA {HALTEV.whatsapp} · {HALTEV.email}
          </p>
        </div>
      </div>
    </div>
  );
}
