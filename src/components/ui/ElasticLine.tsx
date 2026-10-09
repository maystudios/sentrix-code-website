"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// A section divider that bends like a plucked rubber band where the pointer passes and
// wobbles back when it leaves. It never blocks clicks: it only listens to the window.
export function ElasticLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPolicy();
  const bend = useMotionValue(0);
  const at = useMotionValue(500);
  const smoothBend = useSpring(bend, { stiffness: 320, damping: 9 });
  const smoothAt = useSpring(at, { stiffness: 260, damping: 30 });
  const path = useTransform([smoothBend, smoothAt], ([b, x]) => `M0,40 Q${x},${40 + (b as number) * 2} 1000,40`);

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.abs(dy) < 36 && event.clientX >= rect.left && event.clientX <= rect.right) {
        at.set(((event.clientX - rect.left) / rect.width) * 1000);
        bend.set(Math.max(-16, Math.min(16, dy)));
      } else if (bend.get() !== 0) {
        bend.set(0);
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, at, bend]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none relative -my-10 h-20">
      <svg viewBox="0 0 1000 80" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <motion.path d={path} fill="none" stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
