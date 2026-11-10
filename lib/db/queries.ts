import "server-only";
import { db } from "./supabase";

// ---------- Types ----------
export type PriceRow = { package: string; price: number; normal_price: number | null; note: string | null };
export type ProgramRow = {
  id: number;
  slug: string;
  name: string;
  category: string;
  mode: string;
  sessions_info: string | null;
  url: string | null;
  summary: string | null;
  program_prices: PriceRow[];
};
export type BatchView = {
  id: number;
  batch_no: number | null;
  day_type: string;
  days: string;
  start_date: string | null;
  end_date: string | null;
  time_start: string;
  time_end: string;
  mode: string;
  capacity: number;
  seats_taken: number;
  seats_left: number;
  tutor: string | null;
};
export type LeadInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  interest_program?: string | null;
  preferred_days?: string | null;
  preferred_time?: string | null;
  class_type?: string | null;
  method?: string | null;
  source?: string | null;
  promo_code?: string | null;
  notes?: string | null;
};

// ---------- Programs ----------
export async function searchPrograms(query?: string, category?: string) {
  let q = db()
    .from("programs")
    .select("id, slug, name, category, mode, sessions_info, url, summary, program_prices(package, price, normal_price, note)")
    .eq("is_active", true)
    .order("id");
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) throw error;
  let rows = (data ?? []) as ProgramRow[];
  if (query?.trim()) {
    const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
    const scored = rows
      .map((p) => {
        const hay = `${p.name} ${p.slug} ${p.summary ?? ""}`.toLowerCase();
        return { p, score: words.filter((w) => hay.includes(w)).length };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    rows = scored.map((x) => x.p);
  }
  return rows.slice(0, 12);
}

export async function getProgramBySlug(slug: string) {
  const { data, error } = await db()
    .from("programs")
    .select("id, slug, name, category, mode, sessions_info, url, summary, program_prices(package, price, normal_price, note)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as ProgramRow | null;
}

export async function listBatches(programId: number, dayType?: string): Promise<BatchView[]> {
  let q = db()
    .from("batches")
    .select("id, batch_no, day_type, days, start_date, end_date, time_start, time_end, mode, capacity, seats_taken, tutors(name)")
    .eq("program_id", programId)
    .order("start_date")
    .order("time_start");
  // "weekday" also includes after-office classes (they are weekday-priced)
  if (dayType === "weekday") q = q.in("day_type", ["weekday", "after_office"]);
  else if (dayType) q = q.eq("day_type", dayType);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((b) => {
    const { tutors, ...rest } = b as typeof b & { tutors: { name: string } | { name: string }[] | null };
    const t = Array.isArray(tutors) ? tutors[0] : tutors;
    return { ...rest, tutor: t?.name ?? null, seats_left: rest.capacity - rest.seats_taken } as BatchView;
  });
}

// ---------- Leads ----------
export async function getLeadByOwner(ownerId: string) {
  const { data, error } = await db()
    .from("leads")
    .select("*")
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Insert or update the lead for this browser. Matches by owner, then email, then phone. */
export async function upsertLead(ownerId: string, input: LeadInput) {
  const clean = Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, typeof v === "string" ? v.trim() || null : v ?? null]),
  ) as LeadInput;
  if (clean.email) clean.email = clean.email.toLowerCase();

  let existing = await getLeadByOwner(ownerId);
  if (!existing && clean.email) {
    const { data } = await db().from("leads").select("*").ilike("email", clean.email).maybeSingle();
    existing = data;
  }
  if (!existing && clean.phone) {
    const { data } = await db().from("leads").select("*").eq("phone", clean.phone).maybeSingle();
    existing = data;
  }

  if (existing) {
    const { data, error } = await db()
      .from("leads")
      .update({ ...clean, owner_id: ownerId, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await db()
    .from("leads")
    .insert({ ...clean, owner_id: ownerId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- Invoices ----------
export async function nextInvoiceNumber() {
  const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HLV-${ymd}-${rand}`;
}

export type InvoiceDetail = Awaited<ReturnType<typeof getInvoiceDetail>>;

export async function getInvoiceDetail(by: { id?: string; number?: string }) {
  let q = db()
    .from("invoices")
    .select(
      `id, number, amount, status, due_at, paid_at, created_at,
       registrations!inner(id, package, price, status, schedule_note,
         leads!inner(id, name, email, phone, owner_id),
         programs!inner(id, name, slug, category),
         batches(id, batch_no, day_type, days, start_date, end_date, time_start, time_end, mode, tutors(name)))`,
    );
  if (by.id) q = q.eq("id", by.id);
  else if (by.number) q = q.eq("number", by.number);
  else return null;
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  if (!data) return null;
  // Flatten Supabase's nested shapes (object or array) into a predictable structure.
  const one = <T,>(x: T | T[] | null | undefined): T | null => (Array.isArray(x) ? x[0] ?? null : x ?? null);
  const reg = one(data.registrations as never) as unknown as Record<string, unknown>;
  const lead = one(reg.leads as never) as unknown as { id: string; name: string; email: string | null; phone: string | null; owner_id: string | null };
  const program = one(reg.programs as never) as unknown as { id: number; name: string; slug: string; category: string };
  const batch = one(reg.batches as never) as
    | (Omit<BatchView, "tutor" | "seats_left" | "capacity" | "seats_taken"> & { tutors: unknown })
    | null;
  const tutor = batch ? (one(batch.tutors as never) as { name: string } | null)?.name ?? null : null;
  return {
    id: data.id as string,
    number: data.number as string,
    amount: data.amount as number,
    status: data.status as "unpaid" | "pending_verification" | "paid" | "rejected",
    due_at: data.due_at as string,
    paid_at: data.paid_at as string | null,
    created_at: data.created_at as string,
    package: reg.package as string,
    schedule_note: (reg.schedule_note as string | null) ?? null,
    registration_id: reg.id as string,
    lead,
    program,
    batch: batch ? { ...batch, tutors: undefined, tutor } : null,
  };
}
