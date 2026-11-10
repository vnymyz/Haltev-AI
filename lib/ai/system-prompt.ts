import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PERSONA } from "./persona";

let kb: string | null = null;

function knowledgeBase(): string {
  if (kb == null) {
    kb = readFileSync(path.join(process.cwd(), "docs", "haltev_knowledge_base.md"), "utf8");
  }
  return kb;
}

export function buildInstructions(lang: "id" | "en" = "id"): string {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
  return `${PERSONA}

# Context
Today is ${today} (Asia/Jakarta).
DEFAULT LANGUAGE: ${lang === "en" ? "English" : "Indonesian (Bahasa Indonesia)"}.

# KNOWLEDGE BASE (the only source of truth about Haltev)
<knowledge_base>
${knowledgeBase()}
</knowledge_base>`;
}
