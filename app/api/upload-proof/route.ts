import { db, PROOF_BUCKET } from "@/lib/db/supabase";
import { getInvoiceDetail } from "@/lib/db/queries";
import { verifyProof } from "@/lib/ai/verify-proof";

export const maxDuration = 60;

const ALLOWED = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const MSG = {
  id: { noFile: "Pilih file screenshot dulu ya.", type: "Format harus PNG, JPG, atau WEBP.", size: "Ukuran file maksimal 5 MB.", notFound: "Invoice tidak ditemukan.", paid: "Invoice ini sudah lunas 🎉", upload: "Upload gagal, coba lagi.", save: "Gagal menyimpan bukti, coba lagi." },
  en: { noFile: "Please choose a screenshot first.", type: "File must be PNG, JPG, or WEBP.", size: "Max file size is 5 MB.", notFound: "Invoice not found.", paid: "This invoice is already paid 🎉", upload: "Upload failed, please try again.", save: "Could not save the proof, please try again." },
};

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const invoiceId = String(form.get("invoiceId") ?? "");
  const ownerId = String(form.get("ownerId") ?? "");
  const m = MSG[form.get("lang") === "en" ? "en" : "id"];

  if (!(file instanceof File)) return fail(m.noFile);
  if (!ALLOWED.includes(file.type)) return fail(m.type);
  if (file.size > MAX_BYTES) return fail(m.size);

  const inv = await getInvoiceDetail({ id: invoiceId });
  if (!inv || inv.lead.owner_id !== ownerId) return fail(m.notFound, 404);
  if (inv.status === "paid") return fail(m.paid);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${inv.number}/${Date.now()}.${ext}`;

  const { error: upErr } = await db().storage.from(PROOF_BUCKET).upload(path, bytes, { contentType: file.type });
  if (upErr) {
    console.error("[upload-proof] storage", upErr);
    return fail(m.upload, 500);
  }

  const check = await verifyProof(bytes, file.type, inv.amount);

  const { error: insErr } = await db().from("payment_proofs").insert({
    invoice_id: inv.id,
    file_path: path,
    extracted_json: check.extracted,
    amount_match: check.amount_match,
    merchant_match: check.merchant_match,
    ai_note: check.note,
  });
  if (insErr) {
    console.error("[upload-proof] insert", insErr);
    return fail(m.save, 500);
  }
  // Never auto-approve: admin verifies in /admin.
  await db().from("invoices").update({ status: "pending_verification" }).eq("id", inv.id);

  return Response.json({ ok: true, invoiceNumber: inv.number, status: "pending_verification" });
}

function fail(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}
