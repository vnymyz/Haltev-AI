import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Halvi, asisten AI Haltev IT Learning Center",
  description:
    "Kenalan sama Halvi, admin virtual Haltev. Tanya program, cek jadwal, daftar kelas, dan bayar lewat QRIS langsung di chat.",
  openGraph: {
    title: "Halvi, asisten AI Haltev IT Learning Center",
    description: "Tanya program, cek jadwal, daftar kelas, dan bayar lewat QRIS langsung di chat.",
    images: ["/mascot-haltev/Halvi-Waving-poster.webp"],
  },
};

export default function Home() {
  return <LandingPage />;
}
