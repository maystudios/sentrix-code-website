"use client";

import { motion } from "motion/react";
import type { Locale } from "@/content/types";
import { spring } from "@/lib/motion";
import { useMotionPolicy, type MotionPreference } from "./MotionPolicy";

const LABELS: Record<Locale, { legend: string; options: Record<MotionPreference, string> }> = {
  de: { legend: "Bewegung", options: { system: "System", full: "Voll", reduced: "Ruhig" } },
  en: { legend: "Motion", options: { system: "System", full: "Full", reduced: "Calm" } },
};

const ORDER: MotionPreference[] = ["system", "full", "reduced"];

// Footer switch, like the reference's theme switch: lets visitors pick full or calm
// motion regardless of their operating system setting.
export function MotionSwitch({ locale }: { locale: Locale }) {
  const { preference, setPreference } = useMotionPolicy();
  const labels = LABELS[locale];
  return (
    <fieldset className="flex items-center gap-3">
      <legend className="sr-only">{labels.legend}</legend>
      <span aria-hidden="true" className="text-xs text-muted">
        {labels.legend}
      </span>
      <div className="flex rounded-[var(--radius-control)] border border-line p-0.5">
        {ORDER.map((option) => (
          <label key={option} className="relative cursor-pointer">
            <input
              type="radio"
              name="motion-preference"
              value={option}
              checked={preference === option}
              onChange={() => setPreference(option)}
              className="peer sr-only"
            />
            {preference === option && (
              <motion.span layoutId="motion-switch" className="absolute inset-0 rounded-[4px] bg-raised" transition={spring.ui} />
            )}
            <span className="relative block px-2.5 py-1 font-mono text-[11px] text-muted transition-colors duration-150 peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-ocean-400 hover:text-fg">
              {labels.options[option]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
