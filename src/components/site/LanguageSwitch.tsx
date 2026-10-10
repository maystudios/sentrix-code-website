"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { duration, ease } from "@/lib/motion";

const NAMES: Record<Locale, string> = { de: "Deutsch", en: "English" };

// Language picker at the page end, like the reference's footer selector.
export function LanguageSwitch({ locale, alternateHref }: { locale: Locale; alternateHref: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const other: Locale = locale === "de" ? "en" : "de";

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? "language-list" : undefined}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-[var(--radius-control)] border border-line px-3 py-1.5 text-xs text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" />
          <path d="M1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13" fill="none" stroke="currentColor" />
        </svg>
        {NAMES[locale]}
        <motion.svg viewBox="0 0 10 6" className="h-1.5 w-2.5" animate={{ rotate: open ? 180 : 0 }} aria-hidden="true">
          <path d="M1 5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id="language-list"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: duration.fast, ease: ease.outExpo }}
            className="absolute bottom-full right-0 mb-2 min-w-36 origin-bottom-right overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-1"
          >
            <li>
              <span aria-current="true" className="flex items-center justify-between rounded-[4px] bg-raised px-3 py-2 text-sm">
                {NAMES[locale]} <span className="text-ocean-400">✓</span>
              </span>
            </li>
            <li>
              <Link
                href={alternateHref}
                transitionTypes={["nav-fade"]}
                lang={other}
                hrefLang={other}
                className="block rounded-[4px] px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
              >
                {NAMES[other]}
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
