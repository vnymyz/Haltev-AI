import type { Lang } from "./i18n";

export const LANG_COOKIE = "halvi_lang";

/** First language in an Accept-Language header: Indonesian/Malay → id, English → en, anything else → id. */
export function langFromAcceptLanguage(header: string | null | undefined): Lang {
  const first = (header ?? "").split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("en")) return "en";
  return "id";
}

/** Client side: remember the choice for a year so the server can render the right language. */
export function setLangCookie(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}
