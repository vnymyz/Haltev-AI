import Image from "next/image";
import { BOT } from "@/lib/constants";

export function HalviAvatar({ size = 36 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={BOT.avatar}
        alt={BOT.name}
        width={size}
        height={size}
        className="relative"
        priority
      />
    </div>
  );
}
