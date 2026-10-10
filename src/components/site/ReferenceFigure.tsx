"use client";

import { motion } from "motion/react";
import type { CaseReference } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";

// A real project: the official image with a slow drift, the key facts as chips and the
// project's own links. No invented quotes (WEBSITE.md, "Wahrheit vor Wirkung").
export function ReferenceFigure({ reference, title }: { reference: CaseReference; title: string }) {
  return (
    <figure className="group relative w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-colors duration-200 hover:border-line-strong">
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={asset(reference.image.src)}
          alt={reference.image.alt}
          width={reference.image.width}
          height={reference.image.height}
          className="size-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: ease.outExpo }}
          whileHover={{ scale: 1.04, transition: { duration: 0.8, ease: ease.outExpo } }}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-base/80 to-transparent" aria-hidden="true" />
        <figcaption className="absolute bottom-3 left-4 text-sm font-medium text-fg">{title}</figcaption>
      </div>
      <ul className="flex flex-wrap gap-2 p-4">
        {reference.facts.map((fact, index) => (
          <motion.li
            key={fact}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.ui, delay: 0.15 + index * 0.05 }}
            className="rounded-[var(--radius-control)] border border-line-strong px-2.5 py-1 font-mono text-xs text-ocean-300"
          >
            {fact}
          </motion.li>
        ))}
      </ul>
    </figure>
  );
}

// The project's own pages, opened in a new tab.
export function ReferenceLinks({ reference }: { reference: CaseReference }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {reference.links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-fg transition-colors duration-150 hover:text-ocean-300"
          >
            {link.label}
            <svg viewBox="0 0 10 10" className="size-2.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
              <path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
