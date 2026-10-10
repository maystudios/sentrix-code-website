"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { spring } from "@/lib/motion";
import { CHEVRON_PATH, X_PATH } from "@/components/brand/paths";
import { fallEase, fallSeconds } from "./physics";

export type Shape = "square" | "diamond" | "chevron" | "x";

export function BlockShape({ shape, color }: { shape: Shape; color: string }) {
  if (shape === "chevron" || shape === "x") {
    return (
      <svg viewBox={shape === "chevron" ? "0 0 110 140" : "100 0 130 140"} className="size-full" aria-hidden="true">
        <path d={shape === "chevron" ? CHEVRON_PATH : X_PATH} fill={color} />
      </svg>
    );
  }
  return (
    <span
      className={`block size-full ${shape === "diamond" ? "rotate-45 scale-[0.72]" : ""}`}
      style={{ background: color, boxShadow: "inset 0 3px 0 rgba(255,255,255,0.22), inset 0 -4px 0 rgba(0,0,0,0.28)" }}
    />
  );
}

// Pixel dust kicked up where something lands.
export function Dust({ burst, spread = 1 }: { burst: number; spread?: number }) {
  return (
    <AnimatePresence>
      {burst > 0 && (
        <span key={burst} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0">
          {[-3, -2, -1, 1, 2, 3].map((side) => (
            <motion.span
              key={side}
              className="absolute bottom-0 block size-1.5"
              style={{ left: side < 0 ? "0%" : "100%", background: Math.abs(side) === 2 ? "var(--color-ocean-300)" : "var(--color-ocean-100)" }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: side * 6 * spread, y: [0, -5 - Math.abs(side) * 2.5 * spread, 2], opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ))}
        </span>
      )}
    </AnimatePresence>
  );
}

// Fall height as a share of the viewport height, read from a "-NNNvh" start offset.
function fromVh(from: string) {
  const match = /^-?(\d+(?:\.\d+)?)vh$/.exec(from);
  return match ? Number(match[1]) / 100 : 1.15;
}

type LiveBlockProps = {
  style: CSSProperties;
  // Seconds before it drops, the angle it starts at (it straightens while falling) and the
  // height it falls from (CSS length, e.g. "-115vh").
  delay: number;
  tilt: number;
  from?: string;
  reduced: boolean;
  draggable?: boolean;
  onLand?: () => void;
  // Lets a block resting below be jolted when this one lands on it.
  registerJolt?: (jolt: () => void) => void;
  className?: string;
  children: ReactNode;
};

// A block that drops in with gravity, turning upright on the way, and lands flush: no
// rebound, but a squash that wobbles out like jelly, a puff of pixel dust and a jolt for
// whatever it lands on. Free blocks can be grabbed and thrown afterwards.
export function LiveBlock({ style, delay, tilt, from = "-115vh", reduced, draggable = false, onLand, registerJolt, className = "", children }: LiveBlockProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const body = useRef<HTMLDivElement>(null);
  const [dust, setDust] = useState(0);

  const jolt = useCallback(() => {
    if (body.current) animate(body.current, { scaleY: [0.9, 1], scaleX: [1.06, 1] }, { type: "spring", stiffness: 520, damping: 11 });
  }, [animate]);

  useEffect(() => {
    registerJolt?.(jolt);
  }, [registerJolt, jolt]);

  useEffect(() => {
    if (reduced || !scope.current) return;
    let cancelled = false;
    const element = scope.current;
    const seconds = fallSeconds(window.innerHeight * fromVh(from));
    (async () => {
      await Promise.all([
        animate(element, { y: [from, "0px"] }, { duration: seconds, delay, ease: fallEase }),
        animate(element, { rotate: [tilt, tilt * 0.6, 0] }, { duration: seconds, delay, times: [0, 0.55, 1], ease: ["easeInOut", "easeOut"] }),
      ]);
      if (cancelled || !body.current) return;
      setDust((value) => value + 1);
      onLand?.();
      await animate(body.current, { scaleY: [0.74, 1], scaleX: [1.16, 1] }, { type: "spring", stiffness: 520, damping: 9 });
    })();
    return () => {
      cancelled = true;
    };
    // Runs once per mount: the drop is the block's entrance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The outer element only falls; grabbing, hovering and pressing live on the inner one.
  // (A gesture on the falling element would return it to its start, 115 vh above.)
  return (
    <motion.div ref={scope} aria-hidden="true" className={`absolute ${className}`} style={style} initial={reduced ? false : { y: from, rotate: tilt }}>
      <motion.div
        className={`size-full ${draggable ? "pointer-events-auto cursor-grab touch-none active:cursor-grabbing" : ""}`}
        drag={draggable && !reduced}
        dragSnapToOrigin
        dragElastic={0.55}
        dragTransition={{ bounceStiffness: 320, bounceDamping: 12 }}
        whileHover={draggable && !reduced ? { y: -6, transition: spring.ui } : undefined}
        whileDrag={{ scale: 1.08, rotate: 6, zIndex: 20 }}
        whileTap={draggable && !reduced ? { scale: 0.94 } : undefined}
      >
        <div ref={body} className="size-full" style={{ transformOrigin: "50% 100%" }}>
          {children}
        </div>
      </motion.div>
      <Dust burst={dust} />
    </motion.div>
  );
}
