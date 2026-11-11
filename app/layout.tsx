import { NavProgress } from "@/components/ui/NavProgress";
import type { Metadata, Viewport } from "next";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Halvi, asisten AI Haltev",
  description: "Tanya apa saja soal bootcamp & kursus Haltev, daftar kelas, dan bayar langsung lewat chat.",
};

export const viewport: Viewport = {
  themeColor: "#f4f7fc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets the layout use env(safe-area-inset-*) on notched phones
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${fontVars} font-sans`}>
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
