"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// Panel that drifts a few pixels towards the pointer and lifts while hovered. It no longer
// rotates or scales: its contents are pixel art, which must stay on a square grid
// (review round 5).
export function TiltPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { reduced } = useMotionPolicy();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const x = useSpring(useTransform(px, [0, 1], [-5, 5]), spring.ui);
  const y = useSpring(useTransform(py, [0, 1], [-4, 4]), spring.ui);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.9, ease: ease.outExpo }}
    >
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ x, y }}
        whileHover={reduced ? undefined : { y: -4 }}
        className={`relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-colors duration-200 hover:border-line-strong ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
