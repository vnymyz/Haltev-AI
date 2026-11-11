// Shared, client-safe constants (no secrets here).

export const HALTEV = {
  legalName: "PT Haltekom Media Inovasi",
  brand: "Haltev IT Learning Center",
  email: "admin@haltev.id",
  whatsapp: "0878 0009 2728",
  whatsappLink: "https://wa.me/6287800092728",
  phone: "(021) 8274 0767",
  website: "https://haltev.id",
  bank: { name: "Bank BSI (Bank Syariah Indonesia)", account: "9901181180", holder: "PT Haltekom Media Inovasi" },
  qris: {
    merchant: "HALTEV IT LEARNING CENTER",
    nmid: "ID2023298329152",
    image: "/Qris-Haltev.png", // PNG: invoice PDF and the download button
    imageWeb: "/Qris-Haltev.webp", // WebP: what is shown on screen
  },
  logo: "/Logo-Haltev.png", // PNG: invoice PDF
  logoWeb: "/Logo-Haltev.webp",
} as const;

export const BOT = {
  name: "Halvi",
  tagline: "Haltev AI Learning Buddy",
  avatar: "/Logo-Haltev.webp",
} as const;
