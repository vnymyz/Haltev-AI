"use client";
import { useState } from "react";
import Image from "next/image";
import { Download, ExternalLink, QrCode, ReceiptText, X } from "lucide-react";
import { Card } from "./Card";
import { useChatActions } from "@/components/chat/chat-context";
import type { InvoiceOutput } from "@/lib/ai/ui-types";
import { rupiah, shortDate } from "@/lib/format";
import { HALTEV } from "@/lib/constants";

const btn =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-ink-700 bg-ink-950/50 px-3 py-2 text-xs font-semibold text-ink-100 transition hover:border-volt-500/60 hover:text-white";

export function InvoiceCard({ data }: { data: InvoiceOutput }) {
  const { t, lang } = useChatActions();
  const inv = data.invoice;
  const [zoom, setZoom] = useState(false);

  return (
    <div className="grid gap-3 md:grid-cols-[1.25fr_1fr]">
      <Card title={`Invoice ${inv.number}`} icon={<ReceiptText size={15} className="text-volt-400" />}>
        <dl className="space-y-1.5 text-sm">
          <Row k={t.name} v={inv.customer} />
          <Row k={t.program} v={inv.program} />
          <Row k={t.pkg} v={<span className="capitalize">{inv.package}</span>} />
          <Row k={t.due} v={shortDate(inv.due_at, lang)} />
        </dl>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-1 rounded-xl bg-gradient-to-r from-royal-600 to-volt-500/80 px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">{t.total}</span>
          <span className="text-xl font-extrabold text-white">{rupiah(inv.amount)}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <a className={btn} href={`/invoice/${inv.id}?lang=${lang}`} target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> {t.viewInvoice}
          </a>
          <a className={btn} href={`/api/invoice/${inv.id}/pdf?download=1`}>
            <Download size={14} /> {t.downloadPdf}
          </a>
        </div>
      </Card>

      <Card title={t.payQris} icon={<QrCode size={15} className="text-volt-400" />}>
        <button onClick={() => setZoom(true)} className="mx-auto block overflow-hidden rounded-xl bg-white p-1.5 transition hover:scale-[1.02]">
          <Image src={HALTEV.qris.image} alt="QRIS Haltev" width={180} height={255} className="h-auto w-[150px]" />
        </button>
        <p className="mt-2 text-center text-[11px] leading-snug text-ink-300">
          {HALTEV.qris.merchant}
          <br />
          NMID {HALTEV.qris.nmid}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className={btn} onClick={() => setZoom(true)}>
            <QrCode size={14} /> {t.zoom}
          </button>
          <a className={btn} href={HALTEV.qris.image} download="QRIS-Haltev.png">
            <Download size={14} /> {t.download}
          </a>
        </div>
        <p className="mt-3 border-t border-ink-700/60 pt-2 text-[11px] leading-snug text-ink-400">
          {t.orTransfer} {HALTEV.bank.name} <b className="text-ink-200">{HALTEV.bank.account}</b> a.n. {HALTEV.bank.holder}.
        </p>
      </Card>

      {zoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setZoom(false)}>
          <div className="relative max-w-full" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -right-2 -top-2 rounded-full bg-ink-800 p-2 text-white" onClick={() => setZoom(false)} aria-label={t.close}>
              <X size={18} />
            </button>
            <Image src={HALTEV.qris.image} alt="QRIS Haltev" width={722} height={1024} className="max-h-[80dvh] w-auto max-w-full rounded-xl" />
            <p className="mt-2 text-center text-sm text-white">
              {t.payExact} {rupiah(inv.amount)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink-400">{k}</dt>
      <dd className="min-w-0 text-right font-medium break-words text-white">{v}</dd>
    </div>
  );
}
