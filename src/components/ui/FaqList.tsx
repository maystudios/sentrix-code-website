"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import type { FaqItem } from "@/content/types";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// Accordion of questions; the plus turns into a cross, answers unfold.
export function FaqList({ items, initialOpen = 0 }: { items: FaqItem[]; initialOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(initialOpen);
  const { reduced } = useMotionPolicy();
  const base = useId();
  return (
    <ul className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = open === index;
        const id = `${base}-${index}`;
        return (
          <li key={item.question} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={isOpen ? id : undefined}
              onClick={() => setOpen(isOpen ? null : index)}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-lg font-medium tracking-tight transition-colors duration-150 group-hover:text-ocean-300">
                {item.question}
              </span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={spring.ui}
                className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-line-strong text-ocean-400 transition-colors duration-150 group-hover:border-ocean-400"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.4, ease: ease.outExpo }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
