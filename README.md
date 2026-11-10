# Halvi: Haltev AI Assistant 🦊

Halvi is a demo AI assistant for **Haltev IT Learning Center** (PT Haltekom Media Inovasi). It answers questions about Haltev's bootcamps and courses, collects customer data for the sales team, registers customers into class batches, creates invoices, and collects proof of payment. Payments go through Haltev's QRIS, so there is no payment gateway.

> This is a **demo** for presentations, not a production system.

---

## Features

| For customers (chat page `/`) | For admin/sales (`/admin`) |
|---|---|
| Chat page in the style of ChatGPT, with chat history | Overview: leads, registrations, payments waiting for verification, verified revenue |
| Answers about Haltev from the knowledge base, in Indonesian or English | Leads list with status, plus a WhatsApp link |
| Lead form shown inside the chat | Payment proofs: screenshot, AI check, and **Approve / Reject** buttons |
| Batch picker showing schedule, tutor, and seats left (max 5 per class) | All invoices, with a PDF link for each |
| Invoice you can view or download as a PDF | Batch and tutor overview |
| QRIS you can view, zoom, or download | |
| Payment proof upload (📎 button or upload card) | |

**Language & devices:**
- Indonesian by default. The app follows the device language (an English phone/browser gets English) and has an **ID / EN** switch in the header that is remembered. Halvi also replies in whatever language the customer types.
- Fully responsive: phones (from 360px), tablets, and desktop. Includes a slide-out history drawer on mobile, safe-area support for notched iPhones, and no zoom-on-focus in iOS Safari.

**Rules built into Halvi:**
- Halvi only talks about Haltev. Other requests (writing code, making images, homework, and so on) get a friendly refusal: *"Haha, that's nice! Tapi Halvi cuma bisa bantu soal Haltev ya, Kak…"*
- When a customer says "sudah bayar" or "payment done", Halvi **asks for a screenshot**. Halvi never marks a payment as paid. Only the admin can, after checking the proof.
- When the AI is unavailable (free quota used up, rate limit, outage), the chat shows *"Sorry, sepertinya Halvi lagi offline sekarang 😴 Please come again later!"* with a retry button.

---

## Tech stack

- **Next.js 15** (App Router, TypeScript) + **Tailwind CSS v4**
- **Vercel AI SDK v7** + **Google Gemini** (free tier, default `gemini-3.5-flash`)
- **Supabase**: Postgres database + Storage for payment screenshots
- **@react-pdf/renderer** for invoice PDFs

---

## Running it locally

### 1. Requirements
- Node.js **22+** (tested on 24)
- A **Supabase** project (free plan is fine)
- A **Gemini API key** from https://aistudio.google.com/apikey (free)

### 2. Install
```bash
npm install
```

### 3. Environment variables
Copy the example file and fill in your keys:
```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio → API keys |
| `GEMINI_MODEL` | Optional, first model to try (default `gemini-3.5-flash`); falls back to other free models on quota errors |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys → **Secret key** (`sb_secret_…`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → API Keys → Publishable key (not used by the app yet) |
| `ADMIN_PASSWORD` | Any password you choose for `/admin` |

> ⚠️ Never commit `.env.local` or share the secret key. Both are already in `.gitignore`.

### 4. Set up the database
In **Supabase → SQL Editor**, open each file from the `data/` folder, paste its contents, and run it **in this order**:

1. `data/01_schema.sql`: tables, seat-booking function, row-level security
2. `data/02_storage.sql`: the private `payment-proofs` storage bucket
3. `data/03_seed.sql`: programs, prices, tutors (demo names), and batches from the Haltev website

To start over, run `data/99_reset.sql` and then run steps 1–3 again. Also empty the `payment-proofs` bucket in Storage.

### 5. Add the knowledge base
Halvi's knowledge comes from `docs/haltev_knowledge_base.md`. Make sure the file exists. The `docs/` folder is gitignored, so you need to copy it in yourself after cloning.

### 6. Start
```bash
npm run dev
```
- Chat: http://localhost:3000
- Admin: http://localhost:3000/admin (log in with `ADMIN_PASSWORD`)

Other commands:
```bash
npm run build   # production build
npm run start   # run the production build
npm run lint
```

---

## How to use it (demo script)

**As a customer** on http://localhost:3000:
1. Click a suggestion such as **🎓 Bootcamp**, or ask "Berapa harga bootcamp website?"
2. Say "Saya mau daftar". Halvi shows the **form**. Fill it in and click *Kirim data*.
3. Halvi shows the **batch picker**. Click a batch. For courses, Halvi asks *Regular* or *Intensive*.
4. Halvi creates the **invoice** and shows the **QRIS**. Try *Lihat invoice*, *Download PDF*, and *Download QRIS*.
5. Type "sudah bayar". Halvi asks for the screenshot and shows the upload card.
6. Upload a screenshot (PNG/JPG, max 5 MB). Halvi replies that the admin will verify it.

**As admin** on http://localhost:3000/admin:
1. **Pembayaran**: see the screenshot and the AI check (nominal ✓/✗, penerima Haltev ✓/✗, notes).
2. Click **Verifikasi lunas** or **Tolak**.
3. Back in the chat, ask "status pembayaran saya?" Halvi now reports the new status.
4. **Leads**: update each lead's status (new → contacted → registered → paid / lost).

**Off-topic test:** "buatkan kode python kalkulator" or "generate a cat image" should get the refusal line.

---

## Project structure

```
app/
  page.tsx                  chat page
  api/chat/                 AI chat (Gemini + tools)
  api/leads/                save lead form
  api/upload-proof/         store screenshot + AI check
  api/invoice/[id]/pdf/     invoice PDF
  api/sessions/             chat history
  invoice/[id]/             invoice web page
  admin/                    admin dashboard (password protected)
  admin-login/
components/
  chat/                     chat UI (sidebar, messages, composer)
  cards/                    in-chat cards (form, batches, invoice, QRIS, upload)
lib/
  ai/                       persona, system prompt, tools, proof checker
  db/                       Supabase client + queries
  invoice/                  PDF template
  constants.ts              Haltev contact, QRIS, bank, offline message
data/                       Supabase SQL (run in SQL Editor)
docs/                       knowledge base (gitignored)
public/                     logo + QRIS image
```

## Customizing

| What | Where |
|---|---|
| Halvi's personality, rules, refusal line | `lib/ai/persona.ts` |
| All chat UI text (ID + EN), offline message, suggestion buttons | `lib/i18n.ts` |
| QRIS / bank / contact info | `lib/constants.ts` |
| Haltev facts | `docs/haltev_knowledge_base.md` |
| Prices, batches, tutors | Supabase Table Editor (`program_prices`, `batches`, `tutors`) or `data/03_seed.sql` |
| Colors | `app/globals.css` (`@theme`) |
| AI model | `GEMINI_MODEL` in `.env.local` |

## Troubleshooting

| Problem | Fix |
|---|---|
| Chat always says "Halvi lagi offline" | Check `GOOGLE_GENERATIVE_AI_API_KEY`. Free-tier Gemini has small **daily** quotas per model (e.g. 20 requests/day for gemini-3.5-flash; one chat turn can use 2–4). The app already falls back through several models (`GEMINI_MODELS`); if all are used up, wait until the quota resets (midnight Pacific time) or enable billing in Google AI Studio. The server log shows `[ai] … unavailable` lines. |
| Halvi answers, but no batches, form, or invoice appear | The database isn't set up. Run the `data/` SQL files. |
| `Missing SUPABASE_URL or SUPABASE_SECRET_KEY` | Fill in `.env.local`, then restart `npm run dev`. |
| Upload fails | Run `data/02_storage.sql`. Files must be PNG/JPG/WEBP, max 5 MB. |
| Can't open `/admin` | Set `ADMIN_PASSWORD` in `.env.local` and restart. |

## Notes
- Tutor names in the seed data are **fictional**.
- Schedules and prices come from haltev.id (November 2026) and will change.
- The only valid payment destinations are the Haltev QRIS and **BSI 9901181180 a.n. PT Haltekom Media Inovasi**.
