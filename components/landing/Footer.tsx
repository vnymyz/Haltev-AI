import Image from "next/image";
import Link from "next/link";
import type { LandingCopy } from "@/lib/landing-i18n";
import { HALTEV } from "@/lib/constants";

const CENTERS = [
  "Grand Galaxy City, Bekasi Selatan",
  "Bintara, Bekasi Barat",
  "Lippo Cikarang",
  "Summarecon Bekasi",
  "Cakung, Jakarta Timur",
];

const link = "rounded underline decoration-white/30 underline-offset-4 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function Footer({ t }: { t: LandingCopy }) {
  const f = t.footer;
  return (
    <footer className="bg-lp-navy text-white/80">
      <div className="reveal mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/Logo-Haltev.webp" alt="" width={40} height={40} className="size-10" />
            <span className="font-display text-lg font-bold text-white">Haltev</span>
          </div>
          <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed">{f.about}</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-base font-bold text-white">{f.pages}</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li><Link className={link} href="/chat">{f.chat}</Link></li>
              <li><Link className={link} href="/admin">{f.admin}</Link></li>
            </ul>
          </div>
          <div>
          <h2 className="text-base font-bold text-white">{f.contact}</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li>
              <a className={link} href={`mailto:${HALTEV.email}`}>{HALTEV.email}</a>
            </li>
            <li>
              <a className={link} href={HALTEV.whatsappLink} target="_blank" rel="noreferrer">
                WhatsApp {HALTEV.whatsapp}
              </a>
            </li>
            <li>{HALTEV.phone}</li>
            <li>
              <a className={link} href={HALTEV.website} target="_blank" rel="noreferrer">haltev.id</a>
            </li>
          </ul>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-white">{f.locations}</h2>
          <ul className="mt-3 space-y-1.5 text-[15px]">
            {CENTERS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-white/60">{f.hq}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-white/60 sm:px-6">{f.demo}</p>
      </div>
    </footer>
  );
}
