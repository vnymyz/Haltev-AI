import { cookies, headers } from "next/headers";
import type { Lang } from "@/lib/i18n";
import { LANG_COOKIE, langFromAcceptLanguage } from "@/lib/lang";
import { LANDING } from "@/lib/landing-i18n";
import { ADMIN_COOKIE, isAdminToken } from "@/lib/admin-auth";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Manifesto } from "./Manifesto";
import { ProgramBoard } from "./ProgramBoard";
import { HalviInAction } from "./HalviInAction";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { BackToTop } from "./BackToTop";
import { RevealFallback } from "./RevealFallback";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

/**
 * Server component: the language comes from the saved choice (cookie) or the browser's
 * Accept-Language header, so the HTML arrives in the right language and only the interactive
 * parts (nav, hero plate, chat replay, scroll helpers) ship JavaScript.
 */
export async function LandingPage() {
  const saved = (await cookies()).get(LANG_COOKIE)?.value;
  const lang: Lang =
    saved === "en" || saved === "id" ? saved : langFromAcceptLanguage((await headers()).get("accept-language"));
  const t = LANDING[lang];
  // The admin cookie is httpOnly, so only the server can tell who is logged in.
  const isAdmin = await isAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);

  return (
    <div className="min-h-dvh overflow-x-clip">
      <ScrollProgress />
      <Nav nav={t.nav} lang={lang} isAdmin={isAdmin} />
      <main>
        <Hero t={t} />
        <Manifesto t={t} />
        <ProgramBoard t={t} />
        <HalviInAction t={{ how: t.how, mock: t.mock }} />
        <FinalCta t={t} />
      </main>
      <Footer t={t} />
      <BackToTop label={t.nav.top} />
      <RevealFallback />
      <SmoothScroll anchorOffset={-76} />
    </div>
  );
}
