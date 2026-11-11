import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ChatApp } from "@/components/chat/ChatApp";
import { ADMIN_COOKIE, isAdminToken } from "@/lib/admin-auth";
import { logout } from "../admin/actions";

export const metadata: Metadata = { title: "Chat dengan Halvi | Haltev" };

export default async function ChatPage() {
  // The admin cookie is httpOnly, so only the server can tell who is logged in.
  const isAdmin = await isAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
  return <ChatApp isAdmin={isAdmin} logoutAction={isAdmin ? logout : undefined} />;
}
