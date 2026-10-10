import type { Metadata } from "next";
import Link from "next/link";
import { de } from "@/content/de";
import { en } from "@/content/en";
import { asset } from "@/lib/asset";
import { geistMono, geistSans } from "./fonts";
import "./globals.css";
import { PixelCompanion } from "@/components/brand/PixelCharacters";

export const metadata: Metadata = {
  title: "404 · Sentrix Code",
  robots: { index: false, follow: false },
};

// Served for every unknown URL (out/404.html on GitHub Pages). Bilingual, because the
// requested language is unknown here.
export default function GlobalNotFound() {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full font-sans">
        <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
          <img
            src={asset("/images/scenes/404.png")}
            alt=""
            className="absolute inset-0 -z-10 size-full object-cover opacity-25 [image-rendering:pixelated]"
          />
          <PixelCompanion name="robot-astronaut" className="ambient aspect-[29/35] w-32 animate-bob md:w-40" />
          <p className="mt-8 font-mono text-sm text-ocean-400">404</p>
          <h1 className="text-h2-xl mt-3">{de.pages.notFound.title}</h1>
          <p className="text-body-lg mt-4 max-w-md text-muted">{de.pages.notFound.text}</p>
          <p lang="en" className="mt-6 max-w-md text-sm text-muted">
            {en.pages.notFound.title} {en.pages.notFound.text}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex h-11 items-center rounded-[var(--radius-control)] bg-ocean-700 px-5 font-medium text-white">
              {de.pages.notFound.home}
            </Link>
            <Link href="/en/" lang="en" className="inline-flex h-11 items-center rounded-[var(--radius-control)] border border-line-strong bg-surface px-5 font-medium">
              {en.pages.notFound.home}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
