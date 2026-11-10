import { z } from "zod";
import { upsertLead } from "@/lib/db/queries";

const MSG = {
  id: { name: "Nama minimal 2 huruf", email: "Email tidak valid", phone: "Nomor WhatsApp tidak valid (contoh 0812xxxx)", fail: "Gagal menyimpan data, coba lagi." },
  en: { name: "Name must be at least 2 letters", email: "Invalid email", phone: "Invalid WhatsApp number (e.g. 0812xxxx)", fail: "Could not save your data, please try again." },
};

const makeSchema = (m: (typeof MSG)["id"]) => z.object({
  ownerId: z.string().min(8),
  name: z.string().trim().min(2, m.name),
  email: z.string().trim().email(m.email),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?62|0)8[0-9\s-]{7,13}$/, m.phone),
  interest_program: z.string().optional(),
  preferred_days: z.string().optional(),
  preferred_time: z.string().optional(),
  class_type: z.string().optional(),
  method: z.string().optional(),
  source: z.string().optional(),
  promo_code: z.string().optional(),
  notes: z.string().max(500).optional(),
  lang: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const m = MSG[body?.lang === "en" ? "en" : "id"];
  const parsed = makeSchema(m).safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const { ownerId, lang: _lang, ...lead } = parsed.data;
  void _lang;
  try {
    const saved = await upsertLead(ownerId, { ...lead, phone: lead.phone.replace(/[\s-]/g, "") });
    return Response.json({ ok: true, lead: { id: saved.id, name: saved.name } });
  } catch (e) {
    console.error("[leads]", e);
    return Response.json({ ok: false, error: m.fail }, { status: 500 });
  }
}
