import { db } from "@/lib/db/supabase";

// GET /api/sessions?ownerId=…  → chat list for this browser
export async function GET(req: Request) {
  const ownerId = new URL(req.url).searchParams.get("ownerId");
  if (!ownerId) return Response.json([], { status: 400 });
  const { data, error } = await db()
    .from("chat_sessions")
    .select("id, title, updated_at")
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false })
    .limit(30);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
