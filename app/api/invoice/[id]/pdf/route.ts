import { createElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { getInvoiceDetail } from "@/lib/db/queries";
import { InvoicePdf } from "@/lib/invoice/InvoicePdf";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const inv = await getInvoiceDetail({ id });
  if (!inv) return new Response("Not found", { status: 404 });

  const doc = createElement(InvoicePdf, { inv }) as unknown as ReactElement<DocumentProps>;
  const pdf = await renderToBuffer(doc);
  const download = new URL(req.url).searchParams.has("download");

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Invoice-${inv.number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
