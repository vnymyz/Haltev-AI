import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-auth";
import { HALTEV } from "@/lib/constants";
import { SubmitButton } from "@/components/ui/SubmitButton";

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
    <div className="theme-light flex min-h-dvh items-center justify-center bg-ink-950 px-4 font-body">
      <form action={login} className="w-full max-w-sm rounded-xl border border-ink-700 bg-ink-900 p-7 shadow-[0_24px_60px_-32px_rgba(10,26,58,0.35)]">
        <div className="mb-7 flex items-center gap-3">
          <Image src={HALTEV.logoWeb} alt="" width={44} height={44} className="size-11" />
          <div className="font-display text-lg font-bold text-ink-100">Admin Haltev</div>
        </div>

        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink-100">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          aria-invalid={e ? true : undefined}
          aria-describedby={e ? "login-error" : undefined}
          className="min-h-11 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 text-base text-ink-100 focus:border-volt-500 focus:outline-none"
        />
        {e && (
          <p id="login-error" role="alert" className="mt-2 text-sm text-red-300">
            Password salah. Coba lagi.
          </p>
        )}
        <SubmitButton className="mt-5 min-h-11 w-full rounded-lg bg-lp-navy font-semibold text-white transition-colors duration-200 hover:bg-lp-royal">
          Masuk
        </SubmitButton>

        <div className="mt-5 flex justify-center gap-5 text-sm">
          <Link href="/" className="font-medium text-volt-400 hover:underline">
            Ke beranda
          </Link>
          <Link href="/chat" className="font-medium text-volt-400 hover:underline">
            Ke chat
          </Link>
        </div>
      </form>
    </div>
  );
}
