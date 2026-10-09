"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// Lines run from both edges towards the centre, like threads pulled together.
// Coordinates live in a fixed 1440 x 640 canvas so pathLength draws solid lines.
const LINES = [
  [0, 110, 560, 300],
  [0, 220, 580, 330],
  [0, 330, 540, 350],
  [0, 450, 570, 380],
  [0, 560, 600, 400],
  [1440, 90, 880, 300],
  [1440, 200, 860, 330],
  [1440, 320, 900, 350],
  [1440, 440, 870, 385],
  [1440, 580, 840, 410],
];

const TILTS = [-4, 3, -2, 4, -3, 2, -5];
const ICONS = [
  "/images/icons/idea.webp",
  "/images/icons/concept.webp",
  "/images/icons/prototype.webp",
  "/images/icons/design.webp",
  "/images/icons/code.webp",
  "/images/icons/test.webp",
  "/images/sprites/rocket.webp",
];

export function Statement({ dict }: { dict: Dictionary }) {
  const { reduced } = useMotionPolicy();
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface/40 py-24 md:py-32">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full text-line-strong"
      >
        {LINES.map(([x1, y1, x2, y2], index) => (
          <motion.line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 1.4, ease: ease.outExpo, delay: index * 0.05 }}
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-[1280px] px-6 text-center">
        <motion.h2
          className="text-h2-xl mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: ease.outExpo }}
        >
          {dict.statement.title}
        </motion.h2>

        <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {dict.statement.chips.map((chip, index) => (
            <motion.li
              key={chip}
              initial={{ opacity: 0, scale: 0.6, y: 30, rotate: TILTS[index % TILTS.length] * 3 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, rotate: TILTS[index % TILTS.length] }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ ...spring.playful, delay: 0.25 + index * 0.07 }}
              whileHover={{ rotate: 0, y: -4, scale: 1.06, transition: spring.ui }}
              className="flex cursor-default items-center gap-2.5 rounded-[var(--radius-control)] border border-line-strong bg-base py-2 pl-2.5 pr-4 text-[15px] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition-colors duration-150 hover:border-ocean-400 hover:text-ocean-300"
            >
              <img src={asset(ICONS[index % ICONS.length])} alt="" className="size-6 object-contain" />
              {chip}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
