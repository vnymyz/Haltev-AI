import { db } from "@/lib/db/supabase";
import { AdminShell } from "./AdminShell";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { count } = await db()
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending_verification");
  return (
    <AdminShell pending={count ?? 0} logout={logout}>
      {children}
    </AdminShell>
  );
}
