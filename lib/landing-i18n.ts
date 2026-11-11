// Landing page copy (Indonesian is the default). All facts come from docs/haltev_knowledge_base.md.
import type { Lang } from "./i18n";

export type Program = {
  id: string;
  name: string;
  who: string;
  format: string;
  duration: string;
  from: string;
  ask: string; // question sent to Halvi when the row is opened
};

export type Step = { title: string; body: string };

export type LandingCopy = {
  nav: { program: string; how: string; chat: string; chatShort: string; home: string; top: string; guest: string; admin: string };
  hero: {
    title: string;
    sub: string;
    cta: string;
    secondary: string;
    greeting: string;
    chips: { label: string; ask: string }[];
  };
  manifesto: { heading: string; parts: (string | { b: string })[] };
  programs: {
    title: string;
    head: { program: string; format: string; duration: string; from: string };
    ask: string;
    note: string;
    items: Program[];
  };
  how: { title: string; steps: Step[] };
  mock: {
    you1: string;
    halvi1: string;
    halvi1b: string;
    batchIntro: string;
    batch: { name: string; days: string; time: string; mode: string; seats: string; price: string };
    invoiceIntro: string;
    invoice: { number: string; total: string; label: string };
    paid: string;
    proofSent: string;
    pending: string;
  };
  final: { title: string; sub: string; cta: string };
  footer: { about: string; contact: string; locations: string; hq: string; demo: string; rights: string; pages: string; chat: string; admin: string };
};

const priceId = (n: number) => "Rp " + n.toLocaleString("id-ID");

export const LANDING: Record<Lang, LandingCopy> = {
  id: {
    nav: { program: "Program", how: "Cara kerja", chat: "Chat dengan Halvi", chatShort: "Chat Halvi", home: "Beranda Haltev", top: "Kembali ke atas", guest: "Tamu", admin: "Admin" },
    hero: {
      title: "Belajar IT dari nol sampai siap kerja.",
      sub: "Kelas cuma 3–5 orang, diajar praktisi, ada sertifikat BNSP, dan lulusan bootcamp dibantu cari kerja.",
      cta: "Chat dengan Halvi sekarang",
      secondary: "Lihat program",
      greeting: "Halo Kak! Mau belajar apa hari ini?",
      chips: [
        { label: "Pindah karier ke IT", ask: "Saya mau pindah karier ke IT, tapi belum punya background IT. Program apa yang cocok?" },
        { label: "Upgrade skill untuk kerja", ask: "Saya sudah bekerja dan mau upgrade skill. Ada kursus apa yang cocok?" },
        { label: "Kelas coding untuk anak", ask: "Saya cari kelas coding untuk anak saya. Ada kelas untuk anak SD atau SMP?" },
      ],
    },
    manifesto: {
      heading: "Tentang Haltev",
      parts: [
        "Haltev melatih keterampilan IT dan digital dengan kurikulum berbasis AI, untuk siapa saja, dari yang belum pernah ngoding sampai yang sudah bekerja. Kelasnya ",
        { b: "hanya 3–5 orang" },
        ", online atau offline, diajar praktisi yang bekerja di perusahaan teknologi. Lulusan bootcamp disalurkan ke ",
        { b: "250+ perusahaan mitra" },
        " tanpa biaya, dan bisa ikut ujian ",
        { b: "sertifikasi BNSP" },
        ". Biayanya bisa dicicil.",
      ],
    },
    programs: {
      title: "Pilih kelas yang pas buat kamu.",
      head: { program: "Program", format: "Format", duration: "Durasi", from: "Mulai dari" },
      ask: "Tanya Halvi",
      note: "Harga promo. Jadwal dan harga final dicek bersama Halvi atau admin Haltev.",
      items: [
        {
          id: "bootcamp",
          name: "Bootcamp",
          who: "Untuk pindah karier. Belajar 4 bulan, lalu magang 2 bulan dan disalurkan kerja.",
          format: "Weekday atau weekend, online atau offline",
          duration: "6 bulan",
          from: priceId(14990000),
          ask: "Saya mau tahu program Bootcamp di Haltev: apa saja pilihannya dan berapa harganya?",
        },
        {
          id: "kursus",
          name: "Kursus",
          who: "Satu topik dari pemula sampai mahir: web, mobile, data, AI, cyber security.",
          format: "Paket Regular atau Intensive",
          duration: "16 atau 24 pertemuan",
          from: priceId(1800000),
          ask: "Kursus apa saja yang ada di Haltev dan berapa harganya?",
        },
        {
          id: "kids",
          name: "Coding untuk anak dan remaja",
          who: "SD kelas 1–6 belajar Scratch dan Roblox. SMP kelas 7–9 belajar Python.",
          format: "Weekday atau weekend",
          duration: "12 pertemuan × 90 menit",
          from: priceId(2490000),
          ask: "Ada kelas coding untuk anak SD dan SMP? Berapa harganya?",
        },
        {
          id: "office",
          name: "Microsoft Office",
          who: "Word, Excel, PowerPoint, dan Power BI, lengkap dengan trik AI.",
          format: "Beginner atau Intermediate",
          duration: "3 sesi × 90 menit",
          from: priceId(490000),
          ask: "Kelas Microsoft Office apa saja yang tersedia dan berapa harganya?",
        },
        {
          id: "fundamentals",
          name: "Fundamentals",
          who: "Coba ngoding dulu: PHP, Python, JavaScript, HTML, SQL, sampai Figma.",
          format: "Online atau offline",
          duration: "3 pertemuan × 2 jam",
          from: priceId(550000),
          ask: "Saya mau coba belajar ngoding dulu. Apa isi program Fundamentals dan berapa harganya?",
        },
        {
          id: "private",
          name: "Private 1-on-1",
          who: "Satu mentor untuk satu murid, jadwalnya kamu yang atur.",
          format: "Online atau offline",
          duration: "Jadwal fleksibel",
          from: priceId(9600000),
          ask: "Saya tertarik kelas Private 1-on-1. Programnya apa saja dan berapa harganya?",
        },
      ],
    },
    how: {
      title: "Tanya, daftar, dan bayar. Semuanya di satu chat.",
      steps: [
        { title: "Ceritakan tujuanmu", body: "Halvi bertanya soal latar belakang dan waktumu, lalu merekomendasikan program." },
        { title: "Pilih batch dan jadwal", body: "Lihat batch yang buka, jam belajar, dan sisa kursus. Isi data dalam satu formulir." },
        { title: "Bayar lewat QRIS", body: "Invoice terbit otomatis. Lihat atau unduh invoice dan kode QRIS Haltev." },
        { title: "Kirim bukti, admin verifikasi", body: "Unggah screenshot pembayaran. Tim Haltev memeriksa dan mengonfirmasi." },
      ],
    },
    mock: {
      you1: "Saya mau pindah karier ke IT, tapi belum punya background IT.",
      halvi1: "Untuk pemula, Haltev punya Bootcamp 6 bulan: 4 bulan belajar, 2 bulan magang, lalu dibantu cari kerja.",
      halvi1b: "Kakak lebih suka belajar di weekday atau weekend?",
      batchIntro: "Ini batch Website Bootcamp yang masih buka:",
      batch: { name: "Batch 40 · Weekday", days: "Senin–Selasa–Rabu, mulai 16 Nov 2026", time: "08:00–10:00 WIB", mode: "Online / Offline", seats: "3 kursi", price: priceId(14990000) },
      invoiceIntro: "Pendaftaran berhasil. Ini invoice dan QRIS untuk pembayaran:",
      invoice: { number: "HLV-20261116-A1B2", total: priceId(14990000), label: "Bayar via QRIS" },
      paid: "Sudah bayar kak",
      proofSent: "Boleh kirim screenshot bukti pembayarannya, Kak?",
      pending: "Bukti terkirim, menunggu verifikasi admin.",
    },
    final: {
      title: "Tanya Halvi sekarang.",
      sub: "Tanya harga, cek jadwal, dan daftar langsung di chat. Tidak perlu akun.",
      cta: "Chat dengan Halvi sekarang",
    },
    footer: {
      about: "PT Haltekom Media Inovasi. Pusat pelatihan IT dan digital berbasis AI.",
      contact: "Kontak",
      locations: "Pusat pelatihan",
      hq: "Kantor pusat: South Quarter Dome Tower A, lantai 18, Jakarta Selatan",
      demo: "Halvi adalah demo asisten AI untuk Haltev. Jadwal dan harga final dikonfirmasi admin.",
      rights: "Seluruh materi merek milik Haltev.",
      pages: "Halaman",
      chat: "Chat dengan Halvi",
      admin: "Dasbor admin",
    },
  },
  en: {
    nav: { program: "Programs", how: "How it works", chat: "Chat with Halvi", chatShort: "Chat Halvi", home: "Haltev home", top: "Back to top", guest: "Guest", admin: "Admin" },
    hero: {
      title: "Learn IT from zero to job-ready.",
      sub: "Classes of just 3–5 students, taught by practitioners, with a BNSP certificate and job-search help for bootcamp graduates.",
      cta: "Chat with Halvi now",
      secondary: "See programs",
      greeting: "Hi there! What would you like to learn today?",
      chips: [
        { label: "Switch careers into IT", ask: "I want to switch careers into IT, but I have no IT background. Which program fits me?" },
        { label: "Upskill for my job", ask: "I'm already working and want to upskill. Which course would suit me?" },
        { label: "Coding classes for kids", ask: "I'm looking for a coding class for my child. Do you have classes for elementary or junior high students?" },
      ],
    },
    manifesto: {
      heading: "About Haltev",
      parts: [
        "Haltev trains IT and digital skills with an AI-based curriculum, for everyone from people who have never written code to working professionals. Classes have ",
        { b: "only 3–5 students" },
        ", online or offline, taught by practitioners who work at tech companies. Bootcamp graduates are connected to ",
        { b: "250+ partner companies" },
        " at no cost, and can sit the ",
        { b: "BNSP certification" },
        " exam. Fees can be paid in installments.",
      ],
    },
    programs: {
      title: "Pick the class that fits you.",
      head: { program: "Program", format: "Format", duration: "Duration", from: "From" },
      ask: "Ask Halvi",
      note: "Promo prices. Final schedules and prices are confirmed with Halvi or Haltev admin.",
      items: [
        {
          id: "bootcamp",
          name: "Bootcamp",
          who: "For career switchers. 4 months of classes, then a 2-month internship and job placement.",
          format: "Weekday or weekend, online or offline",
          duration: "6 months",
          from: priceId(14990000),
          ask: "I'd like to know about Haltev's Bootcamp programs: what are the options and how much do they cost?",
        },
        {
          id: "kursus",
          name: "Courses",
          who: "One topic from beginner to advanced: web, mobile, data, AI, cyber security.",
          format: "Regular or Intensive package",
          duration: "16 or 24 meetings",
          from: priceId(1800000),
          ask: "What courses does Haltev offer and how much are they?",
        },
        {
          id: "kids",
          name: "Coding for kids and teens",
          who: "Grades 1–6 learn Scratch and Roblox. Grades 7–9 learn Python.",
          format: "Weekday or weekend",
          duration: "12 meetings × 90 minutes",
          from: priceId(2490000),
          ask: "Do you have coding classes for elementary and junior high students? How much are they?",
        },
        {
          id: "office",
          name: "Microsoft Office",
          who: "Word, Excel, PowerPoint, and Power BI, with AI tips.",
          format: "Beginner or Intermediate",
          duration: "3 sessions × 90 minutes",
          from: priceId(490000),
          ask: "Which Microsoft Office classes are available and how much are they?",
        },
        {
          id: "fundamentals",
          name: "Fundamentals",
          who: "Try coding first: PHP, Python, JavaScript, HTML, SQL, even Figma.",
          format: "Online or offline",
          duration: "3 meetings × 2 hours",
          from: priceId(550000),
          ask: "I want to try coding first. What does the Fundamentals program cover and how much is it?",
        },
        {
          id: "private",
          name: "Private 1-on-1",
          who: "One mentor for one student, on a schedule you set.",
          format: "Online or offline",
          duration: "Flexible schedule",
          from: priceId(9600000),
          ask: "I'm interested in Private 1-on-1 classes. Which programs are there and how much are they?",
        },
      ],
    },
    how: {
      title: "Ask, sign up, and pay. All in one chat.",
      steps: [
        { title: "Tell Halvi your goal", body: "Halvi asks about your background and availability, then recommends a program." },
        { title: "Pick a batch and schedule", body: "See open batches, class hours, and seats left. Fill in your details in one form." },
        { title: "Pay with QRIS", body: "Your invoice is created automatically. View or download the invoice and Haltev's QRIS." },
        { title: "Send proof, admin verifies", body: "Upload your payment screenshot. The Haltev team checks and confirms it." },
      ],
    },
    mock: {
      you1: "I want to switch careers into IT, but I have no IT background.",
      halvi1: "For beginners, Haltev has a 6-month Bootcamp: 4 months of classes, a 2-month internship, then help finding a job.",
      halvi1b: "Would you prefer weekday or weekend classes?",
      batchIntro: "These Website Bootcamp batches are still open:",
      batch: { name: "Batch 40 · Weekday", days: "Mon–Tue–Wed, starts 16 Nov 2026", time: "08:00–10:00 WIB", mode: "Online / Offline", seats: "3 seats left", price: priceId(14990000) },
      invoiceIntro: "You're registered. Here's your invoice and the QRIS to pay:",
      invoice: { number: "HLV-20261116-A1B2", total: priceId(14990000), label: "Pay with QRIS" },
      paid: "I've paid",
      proofSent: "Could you send a screenshot of the payment proof?",
      pending: "Proof sent, waiting for admin verification.",
    },
    final: {
      title: "Ask Halvi now.",
      sub: "Ask about prices, check schedules, and sign up right in the chat. No account needed.",
      cta: "Chat with Halvi now",
    },
    footer: {
      about: "PT Haltekom Media Inovasi. AI-based IT and digital training center.",
      contact: "Contact",
      locations: "Training centers",
      hq: "Head office: South Quarter Dome Tower A, 18th floor, South Jakarta",
      demo: "Halvi is a demo AI assistant for Haltev. Final schedules and prices are confirmed by admin.",
      rights: "All brand materials belong to Haltev.",
      pages: "Pages",
      chat: "Chat with Halvi",
      admin: "Admin dashboard",
    },
  },
};
