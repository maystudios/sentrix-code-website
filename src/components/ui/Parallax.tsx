"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// Scroll depth: the content drifts against the scroll direction by up to `distance` pixels
// while its section passes through the viewport, smoothed by a soft spring. Positive values
// lag behind (further away), negative ones run ahead (closer).
export function Parallax({ children, distance = 40, className = "" }: { children: ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPolicy();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 24, mass: 0.4 });
  return (
    <motion.div ref={ref} className={className} style={{ y: reduced ? 0 : y }}>
      {children}
    </motion.div>
  );
}
