import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AlertCircle } from "lucide-react";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-auth";
import { HALTEV } from "@/lib/constants";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PasswordField } from "./PasswordField";

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
  const invalid = Boolean(e);

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#06122B] font-body text-white">
      {/* Soft dark blue gradient with blurred glows */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,#0A1A3A_0%,#0F2E6B_45%,#1E63E0_100%)]" />
      <div aria-hidden className="absolute -top-40 -left-32 -z-10 size-[34rem] rounded-full bg-[#1E63E0]/45 blur-[120px]" />
      <div aria-hidden className="absolute -right-40 -bottom-48 -z-10 size-[38rem] rounded-full bg-[#5FB4FF]/35 blur-[140px]" />
      <div aria-hidden className="absolute top-1/3 left-1/2 -z-10 size-[26rem] -translate-x-1/2 rounded-full bg-[#0A1A3A]/70 blur-[100px]" />

      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={HALTEV.logoWeb} alt="" width={36} height={36} className="size-9" />
          <span className="font-display text-lg font-bold">Haltev</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link href="/" className="rounded-lg px-3 py-2 text-white/80 transition-colors hover:text-white">
            Beranda
          </Link>
          <Link
            href="/chat"
            className="rounded-lg border border-white/60 px-3.5 py-2 text-white transition-colors hover:bg-white hover:text-[#0A1A3A]"
          >
            Chat Halvi
          </Link>
        </nav>
      </header>

      {/* Glass card */}
      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_30px_80px_-20px_rgba(2,8,23,0.75)] backdrop-blur-xl sm:p-10">
          <h1 className="text-center font-display text-3xl font-bold">Login Admin</h1>
          <p className="mt-2 text-center text-sm text-white/70">Dashboard Haltev untuk tim admin.</p>

          <form action={login} className="mt-9">
            <PasswordField invalid={invalid} />
            {invalid && (
              <p id="login-error" role="alert" className="mt-2.5 flex items-center gap-1.5 text-sm text-red-200">
                <AlertCircle size={15} aria-hidden /> Password salah. Coba lagi.
              </p>
            )}

            <SubmitButton className="mt-8 min-h-12 w-full rounded-xl bg-white text-[15px] font-semibold text-[#0A1A3A] shadow-[0_10px_30px_-10px_rgba(2,8,23,0.6)] transition-colors duration-200 hover:bg-[#CFE8FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Masuk
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-xs text-white/60">Lupa password? Hubungi pengelola sistem.</p>
        </div>
      </main>
    </div>
  );
}
