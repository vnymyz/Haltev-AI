// Tiny password gate for the demo admin. Works in middleware (edge) and server code.
export const ADMIN_COOKIE = "halvi_admin";

export async function adminToken(password = process.env.ADMIN_PASSWORD ?? ""): Promise<string> {
  const data = new TextEncoder().encode(`halvi-admin:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isAdminToken(token: string | undefined) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === (await adminToken());
}
