"use client";

import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/types";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { PixelIcon } from "@/components/brand/PixelIcon";
import { Mosaic } from "@/components/ui/Mosaic";
import { RevealHeading } from "@/components/ui/RevealHeading";

const STEP_MS = 1300;
const REST_MS = 2800;

// Our own development infrastructure as a row of stations: a task card travels from station
// to station, each one it leaves is ticked, and at the last one it is signed off. Then the
// next task starts. On phones the stations stack and the card travels down.
export function Engine({ dict }: { dict: Dictionary }) {
  const { title, text, task, done, stations } = dict.engine;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -25% 0px" });
  const { reduced } = useMotionPolicy();
  const [step, setStep] = useState(0);
  const finished = step >= stations.length;
  const at = Math.min(step, stations.length - 1);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(
      () => setStep(reduced ? stations.length : finished ? 0 : step + 1),
      reduced ? 0 : finished ? REST_MS : STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [inView, reduced, finished, step, stations.length]);

  return (
    <section ref={ref} className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <RevealHeading text={title} className="text-h2-xl" />
          <p className="text-body-lg max-w-xl text-muted md:justify-self-end">{text}</p>
        </div>

        <div aria-hidden="true" className="relative mt-14 overflow-hidden rounded-[var(--radius-card)] border border-line bg-ocean-950">
          <Mosaic className="absolute inset-0" from={1} to={4} seed={21} />
          <LayoutGroup>
            <ol className="relative grid gap-2 p-3 sm:p-5 md:grid-cols-5 md:gap-3">
              {stations.map((station, index) => {
                const passed = index < step;
                const here = index === at;
                return (
                  <li
                    key={station.label}
                    className={`relative flex items-center gap-3 rounded-[var(--radius-control)] border p-3 transition-colors duration-300 md:min-h-44 md:flex-col md:items-start md:p-4 ${
                      here ? "border-ocean-400/70 bg-base" : passed ? "border-white/10 bg-base/90" : "border-white/10 bg-base/70"
                    }`}
                  >
                    <motion.span
                      className="block shrink-0"
                      animate={here && !reduced ? { y: [0, -4, 0] } : { y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <PixelIcon name={station.icon} px={2} />
                    </motion.span>
                    <span className="min-w-0 flex-1 md:flex-none">
                      <span className="block text-sm font-medium">{station.label}</span>
                      <span className="mt-0.5 hidden text-xs text-muted sm:block">{station.note}</span>
                    </span>
                    <AnimatePresence>
                      {passed && (
                        <motion.span
                          className="shrink-0 text-ocean-400 md:absolute md:right-3 md:top-3"
                          initial={reduced ? false : { scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ opacity: 0 }}
                          transition={spring.playful}
                        >
                          ✓
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {here && (
                      <motion.span
                        layoutId="engine-task"
                        transition={reduced ? { duration: 0 } : spring.ui}
                        className={`shrink-0 rounded-[var(--radius-control)] px-2 py-1 font-mono text-[10px] sm:text-[11px] md:mt-auto ${
                          finished ? "bg-success/15 text-success" : "bg-ocean-700 text-white"
                        }`}
                      >
                        {/* Phones: the row is too narrow for the task, a short marker travels instead. */}
                        <span className="sm:hidden">{finished ? "✓" : "•••"}</span>
                        <span className="hidden sm:inline">{finished ? `✓ ${done}` : task}</span>
                      </motion.span>
                    )}
                  </li>
                );
              })}
            </ol>
          </LayoutGroup>
        </div>
      </div>
    </section>
  );
}
