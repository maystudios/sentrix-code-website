"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// Panel that leans gently towards the pointer: direct feedback, no light following it.
export function TiltPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { reduced } = useMotionPolicy();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), spring.ui);
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), spring.ui);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <div className="[perspective:1200px]">
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.94, y: 32 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.9, ease: ease.outExpo }}
        className={`relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
