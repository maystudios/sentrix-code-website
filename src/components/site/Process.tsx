"use client";

import { animate, motion, useInView, useMotionValue, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/types";
import { spring } from "@/lib/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { GrowingPrototype } from "./GrowingPrototype";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

const STEP_SECONDS = 7;

// Number box, title and fill react to hover (a preview), press and selection.
const boxVariants: Variants = {
  rest: { scale: 1, transition: spring.ui },
  hover: { scale: 1.08, transition: spring.ui },
  press: { scale: 0.9, transition: spring.ui },
  active: { scale: [1, 1.22, 1], transition: { duration: 0.4, ease: "easeOut" } },
};
const fillVariants: Variants = {
  rest: { scaleY: 0, transition: spring.ui },
  hover: { scaleY: 1, transition: spring.ui },
  press: { scaleY: 1 },
  active: { scaleY: 1, transition: { ...spring.ui, delay: 0.05 } },
};
const titleVariants: Variants = {
  rest: { x: 0, transition: spring.ui },
  hover: { x: 5, transition: spring.ui },
  press: { x: 3 },
  active: { x: 0, transition: spring.playful },
};

// The four steps play through on their own while visible; a click takes over. The timer
// bar under the active step pauses while the pointer or focus is inside the section.
export function Process({ dict }: { dict: Dictionary }) {
  const steps = dict.process.steps;
  const [active, setActive] = useState(0);
  const [taken, setTaken] = useState(false);
  const [hold, setHold] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const { reduced } = useMotionPolicy();
  const autoplay = !taken && !reduced;
  const playing = autoplay && inView && !hold && !focusInside;
  const progress = useMotionValue(0);

  // Where the progress line comes from, so it fills (or empties) one segment after another.
  const [shown, setShown] = useState(0);
  const [from, setFrom] = useState(0);
  if (active !== shown) {
    setFrom(shown);
    setShown(active);
  }

  const select = (index: number) => {
    progress.set(0);
    setActive(index);
    setTaken(true);
  };
  const { tabProps } = useRovingTabs(steps.length, active, select, "vertical");

  useEffect(() => {
    if (!playing) return;
    const timer = animate(progress, 1, {
      duration: STEP_SECONDS * (1 - progress.get()),
      ease: "linear",
      onComplete: () => {
        progress.set(0);
        setActive((value) => (value + 1) % steps.length);
      },
    });
    return () => timer.stop();
  }, [playing, active, steps.length, progress]);

  const step = steps[active];

  // Segment k joins step k and k + 1: it runs down the rest of row k and the top of row k + 1.
  const segment = (k: number, part: "lower" | "upper") => {
    const forward = active >= from;
    const filled = active > k;
    const order = forward ? Math.max(0, k - from) : Math.max(0, from - 1 - k);
    const delay = forward ? order * 0.26 + (part === "upper" ? 0.18 : 0) : order * 0.08 + (part === "lower" ? 0.05 : 0);
    return (
      <motion.span
        className="absolute block w-full origin-top bg-ocean-400"
        style={{ top: 0, bottom: 0 }}
        initial={false}
        animate={{ scaleY: filled ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { delay, duration: part === "lower" ? 0.2 : 0.08, ease: "linear" }}
      />
    );
  };

  return (
    <section
      ref={ref}
      id={dict.anchors.process}
      className="border-b border-line"
      onFocus={() => setFocusInside(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusInside(false);
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <h2 className="text-h2-xl">{dict.process.title}</h2>
          <p className="text-body-lg max-w-md text-muted md:justify-self-end">{dict.process.intro}</p>
        </div>

        <div
          className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12"
          onPointerEnter={(event) => event.pointerType === "mouse" && setHold(true)}
          onPointerLeave={() => setHold(false)}
        >
          <ol role="tablist" aria-label={dict.process.title} aria-orientation="vertical" className="flex flex-col">
            {steps.map((entry, index) => {
              const isActive = active === index;
              const done = index < active;
              return (
                <li key={entry.title} role="presentation" className="relative border-t border-line last:border-b">
                  {/* Progress line between the number boxes. */}
                  {index > 0 && (
                    <span aria-hidden="true" className="absolute left-[13px] top-0 h-5 w-0.5 overflow-hidden bg-line-strong">
                      {segment(index - 1, "upper")}
                    </span>
                  )}
                  {index < steps.length - 1 && (
                    <span aria-hidden="true" className="absolute bottom-0 left-[13px] top-12 w-0.5 overflow-hidden bg-line-strong">
                      {segment(index, "lower")}
                    </span>
                  )}
                  <motion.button
                    type="button"
                    role="tab"
                    id={`process-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls="process-panel"
                    {...tabProps(index)}
                    onClick={() => select(index)}
                    initial={false}
                    animate={isActive ? "active" : "rest"}
                    whileHover="hover"
                    whileTap="press"
                    className="group relative w-full py-5 text-left"
                  >
                    <span className="flex items-start gap-4">
                      <motion.span
                        variants={boxVariants}
                        className={`relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-[var(--radius-control)] border transition-colors duration-150 ${
                          isActive ? "border-ocean-400" : done ? "border-ocean-700" : "border-line-strong group-hover:border-ocean-700"
                        }`}
                      >
                        <motion.span
                          aria-hidden="true"
                          variants={fillVariants}
                          className={`absolute inset-0 origin-bottom ${isActive ? "bg-ocean-700" : "bg-ocean-950"}`}
                        />
                        <span
                          className={`relative font-mono text-[13px] transition-colors duration-150 ${
                            isActive ? "text-white" : done ? "text-ocean-300" : "text-muted group-hover:text-ocean-100"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </motion.span>
                      <span className="min-w-0 flex-1 pt-0.5">
                        <motion.span
                          variants={titleVariants}
                          className={`block text-xl font-medium tracking-tight transition-colors duration-150 ${isActive ? "text-fg" : "text-muted group-hover:text-fg"}`}
                        >
                          {entry.title}
                        </motion.span>
                        <span className={`block pt-2 text-[15px] leading-relaxed transition-colors duration-300 ${isActive ? "text-fg/85" : "text-muted/70 group-hover:text-muted"}`}>
                          {entry.text}
                        </span>
                        {/* Autoplay timer: runs while the steps play by themselves, waits on hover or focus. */}
                        <span aria-hidden="true" className="mt-4 block h-0.5 overflow-hidden rounded-full">
                          {isActive && autoplay && (
                            <span className={`block h-full bg-line transition-opacity duration-150 ${playing ? "opacity-100" : "opacity-50"}`}>
                              <motion.span className="block h-full origin-left bg-ocean-400" style={{ scaleX: progress }} />
                            </span>
                          )}
                        </span>
                      </span>
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </ol>

          <div id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${active}`} aria-live="polite">
            <p className="sr-only">{step.sceneAlt}</p>
            <GrowingPrototype step={active} labels={dict.process.prototype} />
          </div>
        </div>
      </div>
    </section>
  );
}
