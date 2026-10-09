import type { Metadata } from "next";
import type { ReactNode } from "react";
import { en } from "@/content/en";
import { MotionPolicyProvider } from "@/components/motion/MotionPolicy";
import { geistMono, geistSans } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  // Not indexable until the site launches on its own domain (WEBSITE.md).
  robots: { index: false, follow: false },
};

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full font-sans">
        <MotionPolicyProvider>{children}</MotionPolicyProvider>
      </body>
    </html>
  );
}
