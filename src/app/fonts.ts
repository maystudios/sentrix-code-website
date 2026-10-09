import { Geist, Geist_Mono } from "next/font/google";

// next/font downloads the fonts at build time and serves them from this site,
// so visitors never connect to Google (WEBSITE.md, "Rechtliches").
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
