import "server-only";
import { generateText, Output } from "ai";
import { z } from "zod";
import { visionModel, describeAiError, hasAiKey } from "./model";
import { HALTEV } from "@/lib/constants";

const extraction = z.object({
  is_payment_receipt: z.boolean().describe("True only if this looks like a real payment/transfer receipt or QRIS success screen"),
  amount: z.number().nullable().describe("Paid amount in Rupiah as an integer, null if unreadable"),
  merchant_or_recipient: z.string().nullable(),
  transaction_date: z.string().nullable(),
  reference_id: z.string().nullable(),
  payment_app: z.string().nullable().describe("e.g. BCA mobile, GoPay, OVO, DANA, BSI Mobile"),
  status_text: z.string().nullable().describe("e.g. Berhasil / Success"),
  suspicious_signs: z.array(z.string()).describe("Signs of editing, mismatched fonts, cropped totals, etc."),
});
export type ProofExtraction = z.infer<typeof extraction>;

/**
 * Reads a payment screenshot with Gemini vision and compares it with the invoice.
 * This is only a HELPER for the admin — the admin makes the final decision.
 */
export async function verifyProof(image: Uint8Array, mediaType: string, expectedAmount: number) {
  if (!hasAiKey()) return { extracted: null, amount_match: null, merchant_match: null, note: "AI check unavailable" };
  try {
    const { output } = await generateText({
      model: visionModel(),
      output: Output.object({ schema: extraction }),
      temperature: 0,
      maxRetries: 1,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `Extract the payment details from this screenshot. Expected: Rp ${expectedAmount} paid to ` +
                `"${HALTEV.qris.merchant}" (QRIS NMID ${HALTEV.qris.nmid}) or ${HALTEV.bank.holder} (${HALTEV.bank.name} ${HALTEV.bank.account}). ` +
                `Report what you actually see; do not assume.`,
            },
            { type: "file", data: image, mediaType },
          ],
        },
      ],
    });
    const amount_match = output.amount != null ? output.amount === expectedAmount : null;
    const who = (output.merchant_or_recipient ?? "").toUpperCase();
    const merchant_match = who ? /HALTEV|HALTEKOM/.test(who) || who.includes(HALTEV.bank.account) : null;
    const flags: string[] = [];
    if (!output.is_payment_receipt) flags.push("Not a payment receipt");
    if (amount_match === false) flags.push(`Amount ${output.amount} ≠ invoice ${expectedAmount}`);
    if (merchant_match === false) flags.push(`Recipient "${output.merchant_or_recipient}" is not Haltev`);
    if (output.suspicious_signs.length) flags.push(...output.suspicious_signs);
    return {
      extracted: output,
      amount_match,
      merchant_match,
      note: flags.length ? flags.join("; ") : "Looks consistent with the invoice",
    };
  } catch (e) {
    console.error("[verify-proof]", describeAiError(e), e);
    return { extracted: null, amount_match: null, merchant_match: null, note: "AI check unavailable" };
  }
}
