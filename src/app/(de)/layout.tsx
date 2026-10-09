import type { Metadata } from "next";
import type { ReactNode } from "react";
import { de } from "@/content/de";
import { MotionPolicyProvider } from "@/components/motion/MotionPolicy";
import { geistMono, geistSans } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: de.meta.title,
  description: de.meta.description,
  // Not indexable until the site launches on its own domain (WEBSITE.md).
  robots: { index: false, follow: false },
};

export default function GermanRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full font-sans">
        <MotionPolicyProvider>{children}</MotionPolicyProvider>
      </body>
    </html>
  );
}
