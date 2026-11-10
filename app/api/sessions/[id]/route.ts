import { db } from "@/lib/db/supabase";

type Params = { params: Promise<{ id: string }> };

// GET → messages of one chat (only if it belongs to ownerId)
export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const ownerId = new URL(req.url).searchParams.get("ownerId");
  const { data } = await db()
    .from("chat_sessions")
    .select("messages, owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!data || data.owner_id !== ownerId) return Response.json({ messages: [] });
  return Response.json({ messages: data.messages });
}

// PUT → save messages (called by the client after each finished reply)
export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const { ownerId, messages, title } = await req.json();
  if (!ownerId || !Array.isArray(messages)) return Response.json({ ok: false }, { status: 400 });

  const { data: existing } = await db().from("chat_sessions").select("owner_id").eq("id", id).maybeSingle();
  if (existing && existing.owner_id !== ownerId) return Response.json({ ok: false }, { status: 403 });

  const { error } = await db()
    .from("chat_sessions")
    .upsert({ id, owner_id: ownerId, messages, title, updated_at: new Date().toISOString() });
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

// DELETE → remove a chat from history
export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params;
  const ownerId = new URL(req.url).searchParams.get("ownerId");
  await db().from("chat_sessions").delete().eq("id", id).eq("owner_id", ownerId);
  return Response.json({ ok: true });
}
