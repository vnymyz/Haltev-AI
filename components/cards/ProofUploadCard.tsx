"use client";
import { useRef, useState } from "react";
import { CheckCircle2, ImageUp } from "lucide-react";
import { HexLoader } from "@/components/ui/HexLoader";
import { Card } from "./Card";
import { useChatActions } from "@/components/chat/chat-context";
import { uploadProof } from "@/components/chat/upload";
import type { ProofOutput } from "@/lib/ai/ui-types";
import { rupiah } from "@/lib/format";

export function ProofUploadCard({ data }: { data: ProofOutput }) {
  const { ownerId, send, t, lang } = useChatActions();
  const inv = data.invoice;
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "uploading" | "done">(inv.status === "paid" ? "done" : "idle");
  const [err, setErr] = useState<string | null>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setErr(null);
    setState("uploading");
    const res = await uploadProof(file, inv.id, ownerId, lang);
    if (!res.ok) {
      setErr(res.error);
      setState("idle");
      return;
    }
    setState("done");
    send(t.proofMsg(res.invoiceNumber));
  }

  return (
    <Card title={t.proofTitle} icon={<ImageUp size={15} className="text-amber-300" />} accent="amber">
      <p className="text-sm text-ink-300">
        Invoice <b className="break-all text-ink-100">{inv.number}</b> · {rupiah(inv.amount)}
      </p>
      {state === "done" ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
          <CheckCircle2 size={16} className="shrink-0" /> {inv.status === "paid" ? t.alreadyPaid : t.proofSent}
        </p>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          disabled={state === "uploading"}
          className="mt-3 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-ink-600 px-4 py-6 text-center text-sm text-ink-300 transition hover:border-amber-300/60 hover:text-ink-100 disabled:opacity-60"
        >
          {state === "uploading" ? <HexLoader size={28} className="text-volt-500" /> : <ImageUp />}
          {state === "uploading" ? t.uploading : t.pickFile}
        </button>
      )}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="mt-3 max-h-48 max-w-full rounded-lg border border-ink-700" />
      )}
      {err && <p className="mt-2 text-sm text-red-300">{err}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </Card>
  );
}
