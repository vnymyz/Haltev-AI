export function rupiah(n: number | null | undefined): string {
  if (n == null) return "-";
  return "Rp " + n.toLocaleString("id-ID");
}

const DAY_TYPE_LABEL: Record<string, string> = {
  weekday: "Weekday",
  weekend: "Weekend",
  after_office: "After office",
};
export const dayTypeLabel = (t: string) => DAY_TYPE_LABEL[t] ?? t;

const MODE_LABEL: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  online_offline: "Online / Offline",
};
export const modeLabel = (m: string) => MODE_LABEL[m] ?? m;

export function shortDate(d: string | null | undefined, lang: "id" | "en" = "id"): string {
  if (!d) return "-";
  return new Date(d).toLocaleDateString(lang === "en" ? "en-GB" : "id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function hhmm(t: string | null | undefined): string {
  return t ? t.slice(0, 5) : "-";
}
