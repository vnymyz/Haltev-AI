"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

/** Underlined password input for the glass login card, with a show/hide toggle. The form stays a server action. */
export function PasswordField({ invalid }: { invalid: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id="password"
        name="password"
        type={show ? "text" : "password"}
        autoFocus
        required
        autoComplete="current-password"
        placeholder=" "
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "login-error" : undefined}
        className={`peer min-h-12 w-full border-b-2 bg-transparent pt-4 pr-20 pb-2 text-base text-white transition-colors placeholder:text-transparent focus:outline-none ${
          invalid ? "border-red-300" : "border-white/40 focus:border-white"
        }`}
      />
      <label
        htmlFor="password"
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[15px] text-white/75 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
      >
        Password
      </label>
      <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-1">
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          aria-pressed={show}
          className="flex size-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <Lock size={17} className="mr-1 text-white/80" aria-hidden />
      </div>
    </div>
  );
}
