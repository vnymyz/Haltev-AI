"use client";
import { useFormStatus } from "react-dom";
import { HexLoader } from "./HexLoader";

/** A form submit button that shows the loader and ignores clicks while its form is submitting. */
export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-75 ${className}`}
    >
      {pending && <HexLoader size={16} />}
      {children}
    </button>
  );
}

/** Tiny loader for use inside a form (for example next to an auto-saving select). */
export function PendingIndicator({ className = "" }: { className?: string }) {
  const { pending } = useFormStatus();
  return pending ? <HexLoader size={16} className={className} label="Saving" /> : null;
}
