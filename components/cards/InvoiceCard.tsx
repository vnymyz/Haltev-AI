"use client";
import { useState } from "react";
import Image from "next/image";
import { Download, ExternalLink, QrCode, ReceiptText } from "lucide-react";
import { Card } from "./Card";
import { useChatActions } from "@/components/chat/chat-context";
import type { InvoiceOutput } from "@/lib/ai/ui-types";
import { rupiah, shortDate } from "@/lib/format";
import { HALTEV } from "@/lib/constants";
import { QrisDialog } from "./QrisDialog";

const btn =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-ink-700 bg-ink-950/50 px-3 py-2 text-xs font-semibold text-ink-100 transition hover:border-volt-500/60 hover:text-ink-100";

export function InvoiceCard({ data }: { data: InvoiceOutput }) {
  const { t, lang } = useChatActions();
  const inv = data.invoice;
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-3">
      <Card title={`Invoice ${inv.number}`} icon={<ReceiptText size={15} className="text-volt-400" />}>
        <dl className="space-y-1.5 text-sm">
          <Row k={t.name} v={inv.customer} />
          <Row k={t.program} v={inv.program} />
          <Row k={t.pkg} v={<span className="capitalize">{inv.package}</span>} />
          <Row k={t.due} v={shortDate(inv.due_at, lang)} />
        </dl>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-1 rounded-xl bg-royal-500 px-4 py-3">
          <span className="text-sm font-semibold text-white/80">{t.total}</span>
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
        {/* The whole block opens the QRIS popup */}
        <button
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="group flex w-full items-center gap-3 rounded-lg border border-ink-700 bg-ink-950/40 p-2.5 text-left transition-colors hover:border-volt-500/60 hover:bg-ink-850"
        >
          <span className="shrink-0 overflow-hidden rounded-md bg-white p-1">
            <Image src={HALTEV.qris.imageWeb} alt="" width={64} height={90} className="h-[90px] w-[64px] object-cover object-top" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-ink-100">{rupiah(inv.amount)}</span>
            <span className="mt-0.5 block text-xs leading-snug text-ink-300">{t.qrisOpen}</span>
          </span>
        </button>
        <p className="mt-3 text-[11px] leading-snug text-ink-400">
          {t.orTransfer} {HALTEV.bank.name} <b className="text-ink-200">{HALTEV.bank.account}</b> a.n. {HALTEV.bank.holder}.
        </p>
      </Card>

      <QrisDialog open={open} onClose={() => setOpen(false)} amount={inv.amount} t={t} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink-400">{k}</dt>
      <dd className="min-w-0 text-right font-medium break-words text-ink-100">{v}</dd>
    </div>
  );
}
