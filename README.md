# Halvi: Haltev AI Assistant 🦊

Halvi is a demo AI assistant for **Haltev IT Learning Center** (PT Haltekom Media Inovasi). It answers questions about Haltev's bootcamps and courses, collects customer data for the sales team, registers customers into class batches, creates invoices, and collects proof of payment. Payments go through Haltev's QRIS, so there is no payment gateway.

> This is a **demo** for presentations, not a production system.

## Demo login

| Page | URL | Password |
|---|---|---|
| Admin dashboard | http://localhost:3000/admin | `haltev-admin-demo` |
| Customer chat | http://localhost:3000/chat | none (visitors are guests) |

The password comes from `ADMIN_PASSWORD` in `.env.local`. Change it before deploying or sharing the repo.

---

## Features

### Landing page (`/`)
- Light, human-made design (Unbounded + Be Vietnam Pro, Haltev blue palette, orange only on the "Chat dengan Halvi" buttons) with the Halvi mascot video on a gradient hero.
- Typing headline, program board (bootcamp, courses, kids, office, fundamentals, private) with prices, a replay of how Halvi works, and a final call to action. Rows and chips open the chat with that question already sent.
- Sticky navbar with ID / EN switch, a "Chat dengan Halvi" button, and an **Admin / Tamu** chip that shows who is logged in (admin links to the dashboard).
- Smooth scrolling (Lenis), reading-progress line, back-to-top button, fade-to-reveal sections, a thin top progress bar while pages load, and a looping hex loader for anything that loads.
- Server-rendered in the visitor's language, WebP images, H.264/WebM mascot video. Lighthouse: about 83 mobile, 99 desktop (production build).

### Customer chat (`/chat`)
| Feature | Details |
|---|---|
| ChatGPT-style chat | History sidebar (open/close, "Chat baru", "Beranda"), saved per browser |
| Answers from the knowledge base | Indonesian or English, follows the device language and the ID / EN switch |
| Lead form in the chat | Name, contact, and preferences, saved for the sales team |
| Batch picker | Schedule, tutor, and seats left (max 5 per class), booked atomically |
| Invoice | Number, amount, due date; view in the browser or download as PDF |
| QRIS | Opens in a popup, can be zoomed and downloaded; bank transfer details shown too |
| Payment proof upload | 📎 button or upload card; Gemini vision checks amount and merchant |
| Status check | Ask "status pembayaran saya?" and Halvi reports the invoice status |
| Search | Sidebar box filters chats by title; Ctrl/Cmd+K finds text inside the open chat with highlights |
| Jump to latest | Round arrow appears when you scroll up; new replies do not drag you down |
| Guest card | Bottom of the sidebar: "Tamu #XXXX" (anonymous browser id). A logged-in admin sees "Admin" with a Dashboard link and a log-out button instead |
| WhatsApp help | Green WhatsApp button for talking to a human (in the sidebar on phones) |

### Admin dashboard (`/admin`, password protected)
| Page | What it does |
|---|---|
| Ringkasan | What needs doing now: proofs waiting, latest leads and invoices, verified revenue |
| Leads | Search by name, phone, or email; status filter chips; change status in place; WhatsApp link per lead |
| Pembayaran | Review queue: screenshot, Gemini check (amount, recipient, notes), **Verifikasi lunas** / **Tolak**; all invoices with PDF links |
| Batch & Tutor | Calendar view (hover for details) or list view with numbers, filters, and seat bars |
| Navigation | Side rail on desktop, top bar on phones, buttons back to the landing page and the chat |

### Language and devices
- Indonesian by default. The app follows the device language (an English phone gets English) and has an **ID / EN** switch that is remembered. Halvi also replies in whatever language the customer types.
- Responsive from 360px: phones, tablets, and desktop. The sidebar becomes a slide-out drawer, inputs avoid iOS zoom-on-focus, and safe-area insets protect notched phones. The landing navbar shrinks to icons on small screens.

### Rules built into Halvi
- Halvi only talks about Haltev. Other requests (writing code, making images, homework, and so on) get a friendly refusal: *"Haha, that's nice! Tapi Halvi cuma bisa bantu soal Haltev ya, Kak…"*
- When a customer says "sudah bayar" or "payment done", Halvi **asks for a screenshot**. Halvi never marks a payment as paid. Only the admin can, after checking the proof.
- Prices always come from the database, never from the model.
- When the AI is unavailable (free quota used up, rate limit, outage), the chat shows *"Sorry, sepertinya Halvi lagi offline sekarang 😴 Please come again later!"* with a retry button. Halvi tries several free Gemini models before giving up.

---

## Tech stack

- **Next.js 15** (App Router, TypeScript) + **Tailwind CSS v4**
- **Vercel AI SDK v7** + **Google Gemini** (free tier, default `gemini-3.5-flash`)
- **Supabase**: Postgres database + Storage for payment screenshots
- **@react-pdf/renderer** for invoice PDFs
- **Lenis** for smooth scrolling, **lucide-react** icons

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
| `ADMIN_PASSWORD` | Password for `/admin`. The demo uses `haltev-admin-demo`; pick your own for anything real |

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
- Landing page: http://localhost:3000 (intro to Haltev, mascot, "Chat dengan Halvi" buttons)
- Chat: http://localhost:3000/chat
- Admin: http://localhost:3000/admin
  - **Demo password: `haltev-admin-demo`** (the value of `ADMIN_PASSWORD` in the local `.env.local`)
  - This is a demo credential. Change `ADMIN_PASSWORD` before the app is deployed or the repo is shared.

Other commands:
```bash
npm run build   # production build
npm run start   # run the production build
npm run lint
```

---

## How to use it (demo script)

**As a customer** on http://localhost:3000 (landing) then http://localhost:3000/chat:
1. Click a suggestion such as **🎓 Bootcamp**, or ask "Berapa harga bootcamp website?"
2. Say "Saya mau daftar". Halvi shows the **form**. Fill it in and click *Kirim data*.
3. Halvi shows the **batch picker**. Click a batch. For courses, Halvi asks *Regular* or *Intensive*.
4. Halvi creates the **invoice** and shows the **QRIS**. Try *Lihat invoice*, *Download PDF*, and *Download QRIS*.
5. Type "sudah bayar". Halvi asks for the screenshot and shows the upload card.
6. Upload a screenshot (PNG/JPG, max 5 MB). Halvi replies that the admin will verify it.

**As admin** on http://localhost:3000/admin (demo password: `haltev-admin-demo`):
1. **Pembayaran**: see the screenshot and the AI check (nominal ✓/✗, penerima Haltev ✓/✗, notes).
2. Click **Verifikasi lunas** or **Tolak**.
3. Back in the chat, ask "status pembayaran saya?" Halvi now reports the new status.
4. **Leads**: update each lead's status (new → contacted → registered → paid / lost).

**Off-topic test:** "buatkan kode python kalkulator" or "generate a cat image" should get the refusal line.

---

## Project structure

```
app/
  (site)/page.tsx           landing page (fonts: Unbounded + Be Vietnam Pro, scoped to this route group)
  chat/page.tsx             chat page
  api/chat/                 AI chat (Gemini + tools)
  api/leads/                save lead form
  api/upload-proof/         store screenshot + AI check
  api/invoice/[id]/pdf/     invoice PDF
  api/sessions/             chat history
  invoice/[id]/             invoice web page
  admin/                    admin dashboard (overview, leads, payments, batches; password protected)
  admin-login/
components/
  landing/                  landing sections (hero + mascot plate, manifesto, program board, chat replay, footer)
  chat/                     chat UI (sidebar, guest/admin card, messages, composer, find bar)
  cards/                    in-chat cards (form, batches, invoice, QRIS, upload)
  ui/                       shared pieces (hex loader, smooth scroll, navigation progress bar)
lib/
  ai/                       persona, system prompt, tools, proof checker
  db/                       Supabase client + queries
  invoice/                  PDF template
  constants.ts              Haltev contact, QRIS, bank, offline message
data/                       Supabase SQL (run in SQL Editor)
docs/                       knowledge base (gitignored)
public/                     logo + QRIS image
```

## Performance
Measure with a production build, not `npm run dev` (dev mode ships unminified React and scores far lower):
```bash
npm run build
npm run start
```
Then run Lighthouse on http://localhost:3000. On the landing page this scored about 83 on the mobile preset and 99 on desktop. What keeps it fast: the landing page is a server component (language comes from a cookie or the browser header), typing effects are CSS only, the hero poster is a preloaded image and the video starts after the page has loaded, markdown libraries load only inside the chat, and the icons are small.

## Customizing

| What | Where |
|---|---|
| Halvi's personality, rules, refusal line | `lib/ai/persona.ts` |
| All chat UI text (ID + EN), offline message, suggestion buttons | `lib/i18n.ts` |
| QRIS / bank / contact info | `lib/constants.ts` |
| Haltev facts | `docs/haltev_knowledge_base.md` |
| Prices, batches, tutors | Supabase Table Editor (`program_prices`, `batches`, `tutors`) or `data/03_seed.sql` |
| Landing copy (ID + EN) and program board rows | `lib/landing-i18n.ts` |
| Colors | `app/globals.css` (`@theme`; light tokens `paper`, `lp-*`, `signal`; chat and admin use `.theme-light`, which remaps the old `ink-*` and `volt-*` classes) |
| Design rules and palette | `docs/design-brief.md` |
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
