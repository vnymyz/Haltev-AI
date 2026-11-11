"use client";
import { useState } from "react";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { HexLoader } from "@/components/ui/HexLoader";
import { Card } from "./Card";
import { useChatActions } from "@/components/chat/chat-context";
import type { FormOutput } from "@/lib/ai/ui-types";

const DAYS = ["Mon–Tue–Wed", "Wed–Thu–Fri", "Sat & Sun"];
const TIMES = ["09:00–12:00", "13:00–16:00", "15:30–18:00", "18:30–21:00"];

// text-base on phones prevents iOS Safari from zooming into inputs
const input =
  "w-full rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2.5 text-base text-ink-100 placeholder:text-ink-400 focus:border-volt-500/70 focus:outline-none sm:py-2 sm:text-sm";
const label = "mb-1 block text-xs font-semibold text-ink-300";

export function LeadFormCard({ data, active }: { data: FormOutput; active: boolean }) {
  const { ownerId, send, t, lang } = useChatActions();
  const p = data.prefill;
  const [f, setF] = useState({
    name: p.name ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    interest_program: p.interest_program ?? "",
    preferred_days: "",
    preferred_time: "",
    class_type: p.class_type ?? "public",
    method: p.method ?? "online",
    source: "",
    promo_code: "",
    notes: "",
  });
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setErr(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, lang, ...f }),
      });
      const json = await res.json();
      if (!json.ok) {
        setErr(json.error);
        setState("idle");
        return;
      }
      setState("done");
      send(t.formMsg(f.name));
    } catch {
      setErr(t.sendFail);
      setState("idle");
    }
  }

  if (state === "done" || !active) {
    return (
      <Card title={t.formDoneTitle} icon={<ClipboardList size={15} className="text-emerald-300" />} accent="emerald">
        <p className="flex items-center gap-2 text-sm text-ink-200">
          <CheckCircle2 size={16} className="text-emerald-300" />
          {state === "done" ? t.formSaved(f.name) : t.formLabel}
        </p>
      </Card>
    );
  }

  return (
    <Card title={t.formTitle} icon={<ClipboardList size={15} className="text-volt-400" />}>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>{t.fName} *</label>
          <input required autoComplete="name" className={input} value={f.name} onChange={set("name")} placeholder={t.fNamePh} />
        </div>
        <div>
          <label className={label}>{t.fEmail} *</label>
          <input required type="email" autoComplete="email" inputMode="email" className={input} value={f.email} onChange={set("email")} placeholder="nama@email.com" />
        </div>
        <div>
          <label className={label}>{t.fPhone} *</label>
          <input required type="tel" autoComplete="tel" inputMode="tel" className={input} value={f.phone} onChange={set("phone")} placeholder="0812xxxxxxx" />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>{t.fProgram}</label>
          <input className={input} value={f.interest_program} onChange={set("interest_program")} placeholder={t.fProgramPh} />
        </div>
        <div>
          <label className={label}>{t.fDays}</label>
          <select className={input} value={f.preferred_days} onChange={set("preferred_days")}>
            <option value="">{t.any}</option>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>{t.fTime}</label>
          <select className={input} value={f.preferred_time} onChange={set("preferred_time")}>
            <option value="">{t.any}</option>
            {TIMES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>{t.fType}</label>
          <select className={input} value={f.class_type} onChange={set("class_type")}>
            <option value="public">{t.typePublic}</option>
            <option value="private">{t.typePrivate}</option>
          </select>
        </div>
        <div>
          <label className={label}>{t.fMethod}</label>
          <select className={input} value={f.method} onChange={set("method")}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div>
          <label className={label}>{t.fSource}</label>
          <select className={input} value={f.source} onChange={set("source")}>
            <option value="">{t.choose}</option>
            {t.sources.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>{t.fPromo}</label>
          <input className={input} value={f.promo_code} onChange={set("promo_code")} placeholder={t.optional} />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>{t.fNotes}</label>
          <textarea rows={2} className={input} value={f.notes} onChange={set("notes")} placeholder={t.optional} />
        </div>
        {err && <p className="text-sm text-red-300 sm:col-span-2">{err}</p>}
        <button
          disabled={state === "saving"}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-volt-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-volt-400 disabled:opacity-60 sm:col-span-2"
        >
          {state === "saving" && <HexLoader size={17} />} {t.submit}
        </button>
        <p className="text-[11px] text-ink-400 sm:col-span-2">{t.privacy}</p>
      </form>
    </Card>
  );
}
