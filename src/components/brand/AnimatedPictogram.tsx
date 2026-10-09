"use client";

import { motion, useAnimate } from "motion/react";
import { useEffect } from "react";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { spring } from "@/lib/motion";
import { CHEVRON_PATH, X_PATH, VIEWBOX } from "./paths";

type AnimatedPictogramProps = {
  className?: string;
  chevronColor?: string;
  xColor?: string;
  // "hover": reacts to a parent with whileHover="hover"; "intro": assembles once on mount.
  mode?: "hover" | "intro";
  delay?: number;
  // After the intro, the x spins and the chevron nudges every few seconds.
  idle?: boolean;
};

// The Sentrix mark as a living element: the chevron steps aside and the x turns.
export function AnimatedPictogram({
  className,
  chevronColor = "var(--color-ocean-700)",
  xColor = "var(--color-ocean-400)",
  mode = "hover",
  delay = 0,
  idle = false,
}: AnimatedPictogramProps) {
  const intro = mode === "intro";
  const [scope, animate] = useAnimate();
  const { reduced } = useMotionPolicy();

  useEffect(() => {
    if (!idle || reduced) return;
    const timer = setInterval(() => {
      const x = scope.current?.querySelector("[data-part=x]");
      const chevron = scope.current?.querySelector("[data-part=chevron]");
      if (x) animate(x, { rotate: [0, 360] }, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
      if (chevron) animate(chevron, { x: [0, -16, 0] }, { duration: 0.6, ease: "easeInOut" });
    }, 5200);
    return () => clearInterval(timer);
  }, [idle, reduced, animate, scope]);
  return (
    <motion.svg ref={scope} viewBox={VIEWBOX} aria-hidden="true" className={className} overflow="visible">
      <motion.path
        data-part="chevron"
        d={CHEVRON_PATH}
        fill={chevronColor}
        initial={intro ? { x: -60, opacity: 0 } : false}
        animate={intro ? { x: 0, opacity: 1 } : undefined}
        variants={{ rest: { x: 0 }, hover: { x: -14 } }}
        transition={{ ...spring.playful, delay }}
      />
      <motion.path
        data-part="x"
        d={X_PATH}
        fill={xColor}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={intro ? { rotate: -180, scale: 0.3, opacity: 0 } : false}
        animate={intro ? { rotate: 0, scale: 1, opacity: 1 } : undefined}
        variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }}
        transition={{ ...spring.playful, delay: delay + 0.08 }}
      />
    </motion.svg>
  );
}
