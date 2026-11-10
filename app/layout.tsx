import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb" });

export const metadata: Metadata = {
  title: "Halvi — Haltev AI",
  description: "Tanya apa saja soal bootcamp & kursus Haltev, daftar kelas, dan bayar langsung lewat chat.",
  icons: { icon: "/Logo-Haltev.png" },
};

export const viewport: Viewport = {
  themeColor: "#040b1c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets the layout use env(safe-area-inset-*) on notched phones
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${mono.variable} font-sans`}>{children}</body>
    </html>
  );
}
