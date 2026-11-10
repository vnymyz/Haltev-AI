import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { db } from "@/lib/db/supabase";
import {
  getInvoiceDetail,
  getLeadByOwner,
  getProgramBySlug,
  listBatches,
  nextInvoiceNumber,
  searchPrograms,
} from "@/lib/db/queries";
import { HALTEV } from "@/lib/constants";

type Ctx = { ownerId: string; chatId: string };

const CATEGORY = z.enum(["bootcamp", "course", "office", "kids", "fundamentals", "private"]);

/** Tools are created per request so they are bound to this browser's anonymous owner id. */
export function haltevTools({ ownerId, chatId }: Ctx) {
  return {
    search_programs: tool({
      description:
        "Search Haltev programs and get exact current prices from the database. Use for any price/program question. Returns slug (needed by other tools).",
      inputSchema: z.object({
        query: z.string().optional().describe("Keywords, e.g. 'website', 'python data', 'excel', 'kids'"),
        category: CATEGORY.optional(),
      }),
      execute: async ({ query, category }) => {
        const rows = await searchPrograms(query, category);
        return {
          programs: rows.map((p) => ({
            slug: p.slug,
            name: p.name,
            category: p.category,
            mode: p.mode,
            sessions: p.sessions_info,
            url: p.url,
            prices: p.program_prices.map((x) => ({
              package: x.package,
              price: x.price,
              normal_price: x.normal_price,
              note: x.note,
            })),
          })),
        };
      },
    }),

    list_available_batches: tool({
      description:
        "List open class batches (schedule, tutor, seats left) for a program. The UI renders a batch picker card from this result.",
      inputSchema: z.object({
        program_slug: z.string().describe("Program slug from search_programs"),
        day_type: z.enum(["weekday", "weekend", "after_office"]).optional(),
      }),
      execute: async ({ program_slug, day_type }) => {
        const program = await getProgramBySlug(program_slug);
        if (!program) return { error: `Program '${program_slug}' not found. Call search_programs first.` };
        const batches = await listBatches(program.id, day_type);
        return {
          program: { slug: program.slug, name: program.name, category: program.category },
          prices: program.program_prices,
          flexible_schedule: batches.length === 0,
          batches,
          note:
            batches.length === 0
              ? "No fixed batches: schedule is flexible and arranged with admin (private / fundamentals)."
              : "Course batches: end date shown is for Regular; Intensive runs longer.",
        };
      },
    }),

    show_registration_form: tool({
      description:
        "Show the customer data form card (name, email, phone, preferences). Use before registering, or whenever the user wants to be contacted by Haltev sales. Prefill known values.",
      inputSchema: z.object({
        interest_program: z.string().optional().describe("Program name the user is interested in"),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        method: z.enum(["online", "offline"]).optional(),
        class_type: z.enum(["public", "private"]).optional(),
      }),
      execute: async (prefill) => {
        const existing = await getLeadByOwner(ownerId);
        return {
          already_saved: !!existing,
          prefill: {
            ...prefill,
            name: prefill.name ?? existing?.name ?? undefined,
            email: prefill.email ?? existing?.email ?? undefined,
            phone: prefill.phone ?? existing?.phone ?? undefined,
          },
        };
      },
    }),

    register_class: tool({
      description:
        "Register the customer (from the saved form) into a batch, or into a flexible-schedule program (private / fundamentals) without batch_id. Books a seat.",
      inputSchema: z.object({
        program_slug: z.string(),
        batch_id: z.number().int().optional().describe("Batch id from list_available_batches. Omit for flexible programs."),
        package: z
          .enum(["regular", "intensive", "bundling"])
          .optional()
          .describe("Courses: regular or intensive. Office: optional bundling. Omit for bootcamps/kids (weekday/weekend comes from batch)."),
        schedule_note: z.string().optional().describe("Preferred schedule for flexible programs"),
      }),
      execute: async ({ program_slug, batch_id, package: pkg, schedule_note }) => {
        const lead = await getLeadByOwner(ownerId);
        if (!lead) return { error: "NEED_FORM", message: "Customer data not saved yet. Call show_registration_form first." };

        const program = await getProgramBySlug(program_slug);
        if (!program) return { error: `Program '${program_slug}' not found.` };
        const prices = program.program_prices;

        let batch: { id: number; day_type: string; program_id: number } | null = null;
        if (batch_id != null) {
          const { data } = await db().from("batches").select("id, day_type, program_id").eq("id", batch_id).maybeSingle();
          if (!data || data.program_id !== program.id) return { error: "Batch not found for this program." };
          batch = data;
        } else if (!["private", "fundamentals"].includes(program.category)) {
          return { error: "batch_id is required for this program. Call list_available_batches." };
        }

        // Resolve the package → price
        let chosen = pkg as string | undefined;
        if (!chosen) {
          if (prices.some((p) => p.package === "standard")) chosen = "standard";
          else if (batch) chosen = batch.day_type === "weekend" ? "weekend" : "weekday";
        }
        if (program.category === "course" && !pkg) {
          return { error: "Ask the user: Regular or Intensive package?", options: prices };
        }
        const price = prices.find((p) => p.package === chosen);
        if (!price) return { error: `Package '${chosen}' not available.`, options: prices };

        if (batch) {
          const { data: ok, error } = await db().rpc("book_seat", { p_batch_id: batch.id });
          if (error) throw error;
          if (!ok) return { error: "BATCH_FULL", message: "This batch is full. Offer another batch." };
        }

        const { data: reg, error } = await db()
          .from("registrations")
          .insert({
            lead_id: lead.id,
            program_id: program.id,
            batch_id: batch?.id ?? null,
            package: chosen,
            price: price.price,
            schedule_note: schedule_note ?? null,
          })
          .select("id, package, price, status")
          .single();
        if (error) {
          if (batch) await db().rpc("release_seat", { p_batch_id: batch.id });
          throw error;
        }
        await db().from("leads").update({ status: "registered", interest_program: program.name }).eq("id", lead.id);
        await db().from("chat_sessions").update({ lead_id: lead.id }).eq("id", chatId);

        return {
          registration_id: reg.id,
          program: program.name,
          package: reg.package,
          price: reg.price,
          customer: lead.name,
          next: "Call create_invoice with this registration_id.",
        };
      },
    }),

    create_invoice: tool({
      description: "Create the invoice for a registration. The UI shows the invoice card (view/download PDF) and the QRIS card.",
      inputSchema: z.object({ registration_id: z.string() }),
      execute: async ({ registration_id }) => {
        const lead = await getLeadByOwner(ownerId);
        const { data: reg } = await db()
          .from("registrations")
          .select("id, price, lead_id")
          .eq("id", registration_id)
          .maybeSingle();
        if (!reg || reg.lead_id !== lead?.id) return { error: "Registration not found for this customer." };

        // Reuse an open invoice if one already exists
        const { data: existing } = await db()
          .from("invoices")
          .select("id")
          .eq("registration_id", reg.id)
          .in("status", ["unpaid", "pending_verification", "rejected"])
          .maybeSingle();
        let invoiceId = existing?.id as string | undefined;
        if (!invoiceId) {
          const { data: inv, error } = await db()
            .from("invoices")
            .insert({ number: await nextInvoiceNumber(), registration_id: reg.id, amount: reg.price })
            .select("id")
            .single();
          if (error) throw error;
          invoiceId = inv.id;
        }
        const inv = await getInvoiceDetail({ id: invoiceId });
        if (!inv) return { error: "Invoice not found." };
        return {
          invoice: {
            id: inv.id,
            number: inv.number,
            amount: inv.amount,
            status: inv.status,
            due_at: inv.due_at,
            program: inv.program.name,
            package: inv.package,
            customer: inv.lead.name,
          },
          payment: { qris: HALTEV.qris, bank: HALTEV.bank },
        };
      },
    }),

    request_payment_proof: tool({
      description:
        "Use when the user says they have paid. Shows the upload card so they can send the payment screenshot. Never confirm payment yourself.",
      inputSchema: z.object({ invoice_number: z.string().optional().describe("Omit to use the latest open invoice") }),
      execute: async ({ invoice_number }) => {
        const inv = await findOwnedInvoice(ownerId, invoice_number);
        if (!inv) return { error: "No invoice found. Help the user register and create an invoice first." };
        return { invoice: { id: inv.id, number: inv.number, amount: inv.amount, status: inv.status, program: inv.program.name } };
      },
    }),

    check_invoice_status: tool({
      description: "Check an invoice's payment status and the latest uploaded proof.",
      inputSchema: z.object({ invoice_number: z.string().optional().describe("Omit to use the latest invoice") }),
      execute: async ({ invoice_number }) => {
        const inv = await findOwnedInvoice(ownerId, invoice_number);
        if (!inv) return { error: "No invoice found." };
        const { data: proof } = await db()
          .from("payment_proofs")
          .select("uploaded_at, review_status, amount_match")
          .eq("invoice_id", inv.id)
          .order("uploaded_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        return {
          number: inv.number,
          amount: inv.amount,
          status: inv.status,
          program: inv.program.name,
          proof_uploaded: !!proof,
          proof_review: proof?.review_status ?? null,
          meaning: {
            unpaid: "Waiting for payment.",
            pending_verification: "Proof received; Haltev admin will verify (≈1×24 working hours).",
            paid: "Payment verified by admin. Registration confirmed.",
            rejected: "Proof rejected by admin. Ask the user to re-upload a clear, valid proof or contact admin.",
          }[inv.status],
        };
      },
    }),
  };
}

async function findOwnedInvoice(ownerId: string, number?: string) {
  if (number) {
    const inv = await getInvoiceDetail({ number });
    return inv && inv.lead.owner_id === ownerId ? inv : null;
  }
  const lead = await getLeadByOwner(ownerId);
  if (!lead) return null;
  const { data } = await db()
    .from("invoices")
    .select("id, registrations!inner(lead_id)")
    .eq("registrations.lead_id", lead.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? getInvoiceDetail({ id: data.id }) : null;
}

export type HaltevTools = ReturnType<typeof haltevTools>;
