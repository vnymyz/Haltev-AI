import Link from "next/link";

/**
 * The one orange control on the page: it always means "start the chat".
 * Built like a physical key (flat face + darker lip) so it reads as pressable.
 */
export function ChatButton({
  children,
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pad = { sm: "px-3.5 py-2.5 text-sm whitespace-nowrap sm:px-4", md: "px-6 py-3.5 text-base", lg: "px-8 py-4 text-lg" }[size];
  return (
    <Link
      href="/chat"
      className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-signal font-bold text-lp-navy shadow-[0_4px_0_0_#b94f00] transition-[transform,box-shadow] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#b94f00] active:translate-y-1 active:shadow-none ${pad} ${className}`}
    >
      {children}
    </Link>
  );
}

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lp-royal";
