// Display-time clean-up so customers never see internal/technical names,
// even if the AI model slips and narrates its tool calls.

const INTERNAL = [
  "search_programs",
  "list_available_batches",
  "show_registration_form",
  "register_class",
  "create_invoice",
  "request_payment_proof",
  "check_invoice_status",
  "invoice_number",
  "program_slug",
  "batch_id",
  "registration_id",
  "day_type",
  "owner_id",
  "lead_id",
];
const INTERNAL_RE = new RegExp(`\\b(${INTERNAL.join("|")})\\b`, "i");

/** Remove lines (or sentences) of an assistant reply that mention internal tool/field names. */
export function cleanAssistantText(text: string): string {
  if (!INTERNAL_RE.test(text)) return text;
  return text
    .split("\n")
    .map((line) => {
      if (!INTERNAL_RE.test(line)) return line;
      // Keep the sentences of this line that don't leak anything.
      const kept = line.split(/(?<=[.!?])\s+/).filter((s) => !INTERNAL_RE.test(s));
      return kept.join(" ");
    })
    .filter((line, i, all) => line.trim() !== "" || (i > 0 && all[i - 1].trim() !== ""))
    .join("\n")
    .trim();
}

/** Hide machine hints the cards add to user messages, e.g. "[batch_id: 12]". */
export function cleanUserText(text: string): string {
  return text.replace(/\s*\[batch_id:\s*\d+\]/gi, "").trim();
}
