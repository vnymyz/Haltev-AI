import { Be_Vietnam_Pro, Unbounded } from "next/font/google";

// Two families for the whole site. Unbounded is for headlines and prices only.
const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const body = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const fontVars = `${display.variable} ${body.variable}`;
