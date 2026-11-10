// UI strings for the customer chat. Indonesian is the default language.
import { HALTEV } from "./constants";

export type Lang = "id" | "en";
export const LANG_KEY = "halvi_lang";

/** Saved choice → device language → Indonesian. */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "id" || saved === "en") return saved;
  } catch {}
  if (typeof navigator === "undefined") return "id";
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  const first = (langs[0] ?? "id").toLowerCase();
  if (first.startsWith("id") || first.startsWith("ms")) return "id";
  return first.startsWith("en") ? "en" : "id";
}

const id = {
  newChat: "Chat baru",
  history: "Riwayat",
  noHistory: "Belum ada percakapan.",
  untitled: "Percakapan baru",
  deleteChat: "Hapus chat",
  needHelp: "Butuh bantuan?",
  waButton: "Chat admin via WhatsApp",
  waPrefill: "Halo admin Haltev, saya butuh bantuan.",
  online: "Haltev AI Assistant · Online",
  openMenu: "Buka menu",
  closeMenu: "Tutup menu",
  // welcome
  welcomeTitle: "Selamat datang di Haltev",
  welcomeSub: "Halvi · Admin virtual Haltev IT Learning Center",
  // Halvi's first message. Static (no AI call, always the same). Markdown.
  welcome: `Halo Kak, selamat datang di **Haltev IT Learning Center**! 👋
Aku **Halvi**, admin virtual Haltev 🦊

Sedikit tentang kami: Haltev adalah lembaga pelatihan **IT & digital berbasis AI**. Kami bantu siapa saja, dari yang belum punya background IT sampai yang sudah bekerja, untuk naik level lewat **Bootcamp**, **Kursus**, **Kelas Private**, sampai **Coding for Kids**.

Kelasnya kecil (3–5 orang), bisa online/offline, ada sertifikasi BNSP, bisa cicilan, dan lulusan bootcamp disalurkan ke 250+ hiring partner kami.

Biar Halvi bisa kasih rekomendasi yang pas, boleh cerita dulu ya, Kak: **Kakak lagi cari kelas untuk tujuan apa?** 😊`,
  suggestions: [
    { label: "💼 Mau pindah karier ke IT", text: "Saya mau pindah karier ke IT, tapi belum punya background IT. Program apa yang cocok?" },
    { label: "📈 Upgrade skill untuk kerja", text: "Saya sudah bekerja dan mau upgrade skill. Ada kursus apa yang cocok?" },
    { label: "🎓 Mahasiswa / pelajar", text: "Saya mahasiswa, mau belajar coding untuk bantu kuliah dan persiapan kerja. Ada kelas apa?" },
    { label: "🧒 Kelas coding untuk anak", text: "Saya cari kelas coding untuk anak saya. Ada kelas untuk anak SD atau SMP?" },
    { label: "🏢 Training untuk perusahaan", text: "Saya mau cari training untuk karyawan di perusahaan saya." },
    { label: "📅 Lihat jadwal & harga", text: "Boleh lihat jadwal dan harga kelas yang tersedia?" },
  ],
  // composer
  placeholder: "Tanya Halvi soal kelas, harga, jadwal…",
  send: "Kirim",
  uploadProof: "Upload bukti pembayaran",
  noInvoiceYet: "Belum ada invoice di chat ini. Daftar kelas dulu ya, nanti Halvi buatkan invoicenya 😊",
  disclaimer: "Halvi bisa keliru. Jadwal & harga final dikonfirmasi admin Haltev.",
  // errors
  offline: `Sorry, sepertinya Halvi lagi offline sekarang 😴 Coba lagi nanti ya, Kak! Kalau butuh cepat, chat admin Haltev di WhatsApp ${HALTEV.whatsapp}.`,
  retry: "Coba lagi",
  // tool progress
  pending: {
    "tool-search_programs": "Mencari program…",
    "tool-list_available_batches": "Mengecek jadwal & kursi…",
    "tool-show_registration_form": "Menyiapkan form…",
    "tool-register_class": "Mendaftarkan kelas…",
    "tool-create_invoice": "Membuat invoice…",
    "tool-request_payment_proof": "Menyiapkan upload…",
    "tool-check_invoice_status": "Mengecek status pembayaran…",
  } as Record<string, string>,
  wait: "Sebentar…",
  // batch picker
  schedule: "Jadwal",
  flexible: "Jadwal fleksibel — diatur bersama admin sesuai waktu Kakak.",
  seats: (n: number) => (n <= 0 ? "Penuh" : `${n} kursi`),
  pickHint: "Ketuk batch untuk memilih. Kelas semi-private, maksimal 5 orang.",
  pickedMsg: (batch: string, desc: string, program: string, id: number) =>
    `Saya pilih Batch ${batch} (${desc}) untuk ${program}. [batch_id: ${id}]`,
  dayType: { weekday: "Weekday", weekend: "Weekend", after_office: "After office" } as Record<string, string>,
  // form
  formTitle: "Form data pendaftar",
  formDoneTitle: "Data pendaftar",
  formSaved: (name: string) => `Tersimpan. Terima kasih, ${name}!`,
  formLabel: "Form registrasi",
  fName: "Nama lengkap",
  fNamePh: "Nama Kakak",
  fEmail: "Email",
  fPhone: "No. WhatsApp",
  fProgram: "Program yang diminati",
  fProgramPh: "mis. Website Bootcamp",
  fDays: "Hari favorit",
  fTime: "Jam favorit",
  any: "Bebas",
  fType: "Tipe kelas",
  typePublic: "Public (semi-private 3–5 orang)",
  typePrivate: "Private 1-on-1",
  fMethod: "Metode",
  fSource: "Tahu Haltev dari",
  choose: "Pilih…",
  sources: ["Instagram", "TikTok", "Google", "YouTube", "Teman / keluarga", "Kampus / sekolah", "Lainnya"],
  fPromo: "Kode promo",
  optional: "opsional",
  fNotes: "Catatan",
  submit: "Kirim data",
  privacy: "Data hanya dipakai tim Haltev untuk menghubungi Kakak.",
  sendFail: "Gagal mengirim, coba lagi.",
  formMsg: (name: string) => `✅ Data saya sudah saya isi (nama: ${name}). Lanjut ya!`,
  // invoice
  name: "Nama",
  program: "Program",
  pkg: "Paket",
  due: "Jatuh tempo",
  total: "Total",
  viewInvoice: "Lihat invoice",
  downloadPdf: "Download PDF",
  payQris: "Bayar via QRIS",
  zoom: "Perbesar",
  download: "Download",
  orTransfer: "Atau transfer",
  payExact: "Bayar tepat",
  close: "Tutup",
  // proof
  proofTitle: "Upload bukti pembayaran",
  alreadyPaid: "Invoice sudah lunas.",
  proofSent: "Bukti terkirim — menunggu verifikasi admin.",
  uploading: "Mengupload & mengecek…",
  pickFile: "Ketuk untuk pilih screenshot (PNG/JPG, maks 5 MB)",
  proofMsg: (n: string) => `📎 Saya sudah upload bukti pembayaran untuk invoice ${n}.`,
  // status
  status: {
    unpaid: "Menunggu pembayaran",
    pending_verification: "Menunggu verifikasi admin",
    paid: "Lunas — terverifikasi",
    rejected: "Bukti ditolak",
  },
};

export type Dict = typeof id;

const en: Dict = {
  newChat: "New chat",
  history: "History",
  noHistory: "No conversations yet.",
  untitled: "New conversation",
  deleteChat: "Delete chat",
  needHelp: "Need help?",
  waButton: "Chat with admin on WhatsApp",
  waPrefill: "Hi Haltev admin, I need some help.",
  online: "Haltev AI Assistant · Online",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  welcomeTitle: "Welcome to Haltev",
  welcomeSub: "Halvi · Virtual admin of Haltev IT Learning Center",
  welcome: `Hi, welcome to **Haltev IT Learning Center**! 👋
I'm **Halvi**, Haltev's virtual admin 🦊

A little about us: Haltev is an **AI-powered IT & digital skills training center**. We help everyone, from people with no IT background to working professionals, level up through **Bootcamps**, **Courses**, **Private Classes**, and even **Coding for Kids**.

Classes are small (3–5 students), online or offline, with BNSP certification and installment options, and bootcamp graduates are connected to our 250+ hiring partners.

So I can recommend the right program, tell me a bit about yourself: **what are you looking to learn, and for what goal?** 😊`,
  suggestions: [
    { label: "💼 Switch careers into IT", text: "I want to switch careers into IT, but I have no IT background. Which program fits me?" },
    { label: "📈 Upskill for my job", text: "I'm already working and want to upskill. Which course would suit me?" },
    { label: "🎓 Student", text: "I'm a university student and want to learn coding to help with my studies and prepare for work. What classes do you have?" },
    { label: "🧒 Coding classes for kids", text: "I'm looking for a coding class for my child. Do you have classes for elementary or junior high students?" },
    { label: "🏢 Corporate training", text: "I'm looking for training for the employees at my company." },
    { label: "📅 Schedules & prices", text: "Can I see the available class schedules and prices?" },
  ],
  placeholder: "Ask Halvi about classes, prices, schedules…",
  send: "Send",
  uploadProof: "Upload payment proof",
  noInvoiceYet: "There's no invoice in this chat yet. Register for a class first and Halvi will create one 😊",
  disclaimer: "Halvi can make mistakes. Final schedules & prices are confirmed by Haltev admin.",
  offline: `Sorry, I think Halvi is not online at the moment 😴 Please come again later! For urgent help, WhatsApp Haltev admin at ${HALTEV.whatsapp}.`,
  retry: "Try again",
  pending: {
    "tool-search_programs": "Searching programs…",
    "tool-list_available_batches": "Checking schedules & seats…",
    "tool-show_registration_form": "Preparing the form…",
    "tool-register_class": "Registering…",
    "tool-create_invoice": "Creating invoice…",
    "tool-request_payment_proof": "Preparing upload…",
    "tool-check_invoice_status": "Checking payment status…",
  },
  wait: "One moment…",
  schedule: "Schedule",
  flexible: "Flexible schedule — arranged with our admin to fit your time.",
  seats: (n: number) => (n <= 0 ? "Full" : `${n} seat${n === 1 ? "" : "s"} left`),
  pickHint: "Tap a batch to choose it. Semi-private classes, max 5 students.",
  pickedMsg: (batch: string, desc: string, program: string, id: number) =>
    `I choose Batch ${batch} (${desc}) for ${program}. [batch_id: ${id}]`,
  dayType: { weekday: "Weekday", weekend: "Weekend", after_office: "After office" },
  formTitle: "Registration form",
  formDoneTitle: "Your details",
  formSaved: (name: string) => `Saved. Thank you, ${name}!`,
  formLabel: "Registration form",
  fName: "Full name",
  fNamePh: "Your name",
  fEmail: "Email",
  fPhone: "WhatsApp number",
  fProgram: "Program of interest",
  fProgramPh: "e.g. Website Bootcamp",
  fDays: "Preferred days",
  fTime: "Preferred time",
  any: "Any",
  fType: "Class type",
  typePublic: "Public (semi-private, 3–5 people)",
  typePrivate: "Private 1-on-1",
  fMethod: "Method",
  fSource: "How did you hear about Haltev",
  choose: "Choose…",
  sources: ["Instagram", "TikTok", "Google", "YouTube", "Friends / family", "Campus / school", "Other"],
  fPromo: "Promo code",
  optional: "optional",
  fNotes: "Notes",
  submit: "Submit",
  privacy: "Your data is only used by the Haltev team to contact you.",
  sendFail: "Failed to send, please try again.",
  formMsg: (name: string) => `✅ I've filled in my details (name: ${name}). Let's continue!`,
  name: "Name",
  program: "Program",
  pkg: "Package",
  due: "Due date",
  total: "Total",
  viewInvoice: "View invoice",
  downloadPdf: "Download PDF",
  payQris: "Pay with QRIS",
  zoom: "Enlarge",
  download: "Download",
  orTransfer: "Or transfer to",
  payExact: "Pay exactly",
  close: "Close",
  proofTitle: "Upload payment proof",
  alreadyPaid: "This invoice is already paid.",
  proofSent: "Proof sent — waiting for admin verification.",
  uploading: "Uploading & checking…",
  pickFile: "Tap to choose a screenshot (PNG/JPG, max 5 MB)",
  proofMsg: (n: string) => `📎 I've uploaded the payment proof for invoice ${n}.`,
  status: {
    unpaid: "Waiting for payment",
    pending_verification: "Waiting for admin verification",
    paid: "Paid — verified",
    rejected: "Proof rejected",
  },
};

export const DICT: Record<Lang, Dict> = { id, en };
