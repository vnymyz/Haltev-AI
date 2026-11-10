"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/supabase";
import { ADMIN_COOKIE, isAdminToken } from "@/lib/admin-auth";

async function guard() {
  if (!(await isAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) redirect("/admin-login");
}

export async function approveProof(formData: FormData) {
  await guard();
  const proofId = String(formData.get("proofId"));
  const { data: proof } = await db().from("payment_proofs").select("id, invoice_id").eq("id", proofId).single();
  if (!proof) return;
  const now = new Date().toISOString();
  await db().from("payment_proofs").update({ review_status: "approved", reviewed_by: "admin", reviewed_at: now }).eq("id", proof.id);
  const { data: inv } = await db()
    .from("invoices")
    .update({ status: "paid", paid_at: now })
    .eq("id", proof.invoice_id)
    .select("registration_id")
    .single();
  if (inv) {
    const { data: reg } = await db()
      .from("registrations")
      .update({ status: "confirmed" })
      .eq("id", inv.registration_id)
      .select("lead_id")
      .single();
    if (reg) await db().from("leads").update({ status: "paid" }).eq("id", reg.lead_id);
  }
  revalidatePath("/admin", "layout");
}

export async function rejectProof(formData: FormData) {
  await guard();
  const proofId = String(formData.get("proofId"));
  const { data: proof } = await db().from("payment_proofs").select("id, invoice_id").eq("id", proofId).single();
  if (!proof) return;
  await db()
    .from("payment_proofs")
    .update({ review_status: "rejected", reviewed_by: "admin", reviewed_at: new Date().toISOString() })
    .eq("id", proof.id);
  await db().from("invoices").update({ status: "rejected" }).eq("id", proof.invoice_id);
  revalidatePath("/admin", "layout");
}

export async function setLeadStatus(formData: FormData) {
  await guard();
  await db()
    .from("leads")
    .update({ status: String(formData.get("status")), updated_at: new Date().toISOString() })
    .eq("id", String(formData.get("leadId")));
  revalidatePath("/admin/leads");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin-login");
}
