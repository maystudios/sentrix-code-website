"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Dictionary } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { RevealHeading } from "@/components/ui/RevealHeading";

// Threads from both edges converge on the centre (the reference's "strings").
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

const ICONS = [
  "/images/icons/idea.webp",
  "/images/icons/concept.webp",
  "/images/icons/prototype.webp",
  "/images/icons/design.webp",
  "/images/icons/code.webp",
  "/images/icons/test.webp",
  "/images/sprites/rocket.webp",
];

// Horizontal anchor (% of the line) and string length (px) per chip.
const HANG = [
  { x: 8, length: 70 },
  { x: 22, length: 130 },
  { x: 36, length: 90 },
  { x: 50, length: 150 },
  { x: 64, length: 95 },
  { x: 78, length: 135 },
  { x: 92, length: 75 },
];

// A chip hanging on a thread: grab it, pull it, let go, and it swings back on a spring.
function HangingChip({ label, icon, index, reduced }: { label: string; icon: string; index: number; reduced: boolean }) {
  const { x, length } = HANG[index % HANG.length];
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  // The thread is taut at full length and sags when the chip is pushed closer.
  const thread = useTransform([dragX, dragY], ([dx, dy]) => {
    const ex = 60 + (dx as number);
    const ey = length + (dy as number);
    const slack = Math.max(0, length - Math.hypot(ex - 60, ey));
    return `M60,0 Q${(60 + ex) / 2 - slack * 0.15},${ey / 2 + slack * 0.75} ${ex},${ey}`;
  });
  const tilt = useSpring(useTransform(dragX, [-200, 200], [-14, 14]), spring.ui);
  return (
    <motion.div
      className="absolute top-0"
      style={{ left: `${x}%`, marginLeft: -60, width: 120 }}
      initial={{ opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 20% 0px" }}
      transition={{ ...spring.playful, delay: 0.1 + index * 0.06 }}
    >
      {/* Idle sway of the whole pendulum around its anchor. */}
      <div className="ambient origin-top" style={{ animation: reduced ? "none" : `sway ${3.2 + (index % 3) * 0.6}s ease-in-out ${index * 0.3}s infinite alternate` }}>
        <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width="120" height={length} aria-hidden="true">
          <motion.path d={thread} fill="none" stroke="var(--color-line-strong)" strokeWidth={1.5} />
          <circle cx={60} cy={0} r={3} fill="var(--color-ocean-400)" />
        </svg>
        <motion.div
          drag={!reduced}
          dragSnapToOrigin
          dragElastic={0.7}
          dragTransition={{ bounceStiffness: 260, bounceDamping: 9 }}
          style={{ x: dragX, y: dragY, rotate: tilt, top: length }}
          whileHover={{ scale: 1.06 }}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          className="absolute left-1/2 flex -translate-x-1/2 cursor-grab touch-none select-none items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-control)] border border-line-strong bg-base py-2 pl-2.5 pr-4 text-[15px] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] transition-colors duration-150 hover:border-ocean-400"
        >
          <img src={asset(icon)} alt="" draggable={false} className="size-6 object-contain" />
          {label}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Statement({ dict }: { dict: Dictionary }) {
  const { reduced } = useMotionPolicy();
  const chips = dict.statement.chips;
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface/40 py-24 md:py-32">
      <svg aria-hidden="true" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-line-strong">
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
        <RevealHeading text={dict.statement.title} className="text-h2-xl mx-auto max-w-3xl" />

        {/* Desktop: chips hang on threads from a line and can be pulled. */}
        <div className="relative mx-auto mt-16 hidden h-[260px] max-w-5xl md:block">
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-line-strong"
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: ease.outExpo }}
          />
          <ul>
            {chips.map((chip, index) => (
              <li key={chip}>
                <HangingChip label={chip} icon={ICONS[index % ICONS.length]} index={index} reduced={reduced} />
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: chips as a simple, tappable cluster. */}
        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-3 md:hidden">
          {chips.map((chip, index) => (
            <motion.li
              key={chip}
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring.playful, delay: 0.2 + index * 0.06 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-2 rounded-[var(--radius-control)] border border-line-strong bg-base py-2 pl-2 pr-3.5 text-sm"
            >
              <img src={asset(ICONS[index % ICONS.length])} alt="" className="size-5 object-contain" />
              {chip}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
