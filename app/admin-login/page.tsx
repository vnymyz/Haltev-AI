import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-auth";
import { HALTEV } from "@/lib/constants";

async function login(formData: FormData) {
  "use server";
  const pw = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD || pw !== process.env.ADMIN_PASSWORD) redirect("/admin-login?e=1");
  (await cookies()).set(ADMIN_COOKIE, await adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <div className="circuit-bg flex min-h-dvh items-center justify-center px-4">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <Image src={HALTEV.logo} alt="Haltev" width={44} height={44} />
          <div>
            <div className="font-extrabold text-white">Haltev Admin</div>
            <div className="text-xs text-ink-400">Leads · Registrasi · Pembayaran</div>
          </div>
        </div>
        <label className="mb-1 block text-xs font-semibold text-ink-300">Password</label>
        <input
          name="password"
          type="password"
          autoFocus
          required
          className="w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-white focus:border-volt-500 focus:outline-none"
        />
        {e && <p className="mt-2 text-sm text-red-300">Password salah.</p>}
        <button className="mt-4 w-full rounded-lg bg-volt-500 py-2.5 font-bold text-ink-950 hover:bg-volt-400">Masuk</button>
      </form>
    </div>
  );
}
