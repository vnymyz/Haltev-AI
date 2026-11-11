"use client";
import { PendingIndicator } from "@/components/ui/SubmitButton";
import { setLeadStatus } from "./actions";

const OPTIONS = [
  ["new", "Baru"],
  ["contacted", "Sudah dihubungi"],
  ["registered", "Terdaftar"],
  ["paid", "Lunas"],
  ["lost", "Batal"],
] as const;

/** Saves as soon as the value changes. */
export function LeadStatusSelect({ leadId, status }: { leadId: string; status: string }) {
  return (
    <form action={setLeadStatus} className="flex items-center gap-2">
      <input type="hidden" name="leadId" value={leadId} />
      <select
        name="status"
        defaultValue={status}
        aria-label="Ubah status lead"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="min-h-9 rounded-lg border border-ink-700 bg-ink-900 px-2 text-sm text-ink-100 focus:border-volt-500 focus:outline-none"
      >
        {OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <PendingIndicator className="text-volt-500" />
    </form>
  );
}
