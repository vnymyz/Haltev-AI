import Image from "next/image";
import { BOT } from "@/lib/constants";

export function HalviAvatar({ size = 36, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {pulse && <span className="absolute inset-0 rounded-full bg-volt-500/30 blur-md animate-pulse" />}
      <Image
        src={BOT.avatar}
        alt={BOT.name}
        width={size}
        height={size}
        className="relative drop-shadow-[0_0_8px_rgba(31,182,255,0.45)]"
        priority
      />
    </div>
  );
}
