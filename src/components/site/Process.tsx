"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

const STEP_SECONDS = 7;

// The four steps play through on their own while visible; a click takes over.
export function Process({ dict }: { dict: Dictionary }) {
  const steps = dict.process.steps;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const { reduced } = useMotionPolicy();
  const playing = inView && !paused && !focusInside && !reduced;
  const select = (index: number) => {
    setActive(index);
    setPaused(true);
  };
  const { tabProps } = useRovingTabs(steps.length, active, select, "vertical");

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setActive((value) => (value + 1) % steps.length), STEP_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [playing, active, steps.length]);

  const step = steps[active];

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

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
          <ol role="tablist" aria-label={dict.process.title} aria-orientation="vertical" className="flex flex-col">
            {steps.map((entry, index) => {
              const isActive = active === index;
              return (
                <li key={entry.title} role="presentation" className="border-t border-line last:border-b">
                  <button
                    type="button"
                    role="tab"
                    id={`process-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls="process-panel"
                    {...tabProps(index)}
                    onClick={() => select(index)}
                    className="relative w-full py-5 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className={`font-mono text-sm ${isActive ? "text-ocean-400" : "text-muted"}`}>
                        {index + 1}
                      </span>
                      <span className={`text-xl font-medium tracking-tight transition-colors duration-150 ${isActive ? "text-fg" : "text-muted hover:text-fg"}`}>
                        {entry.title}
                      </span>
                    </span>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: ease.outExpo }}
                          className="overflow-hidden pl-8 text-muted"
                        >
                          <span className="block pt-3">{entry.text}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <span className="absolute inset-x-0 -top-px h-px overflow-hidden bg-line">
                        <motion.span
                          key={`${active}-${playing}`}
                          className="block h-full origin-left bg-ocean-400"
                          initial={{ scaleX: playing ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: playing ? STEP_SECONDS : 0, ease: "linear" }}
                        />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            id="process-panel"
            role="tabpanel"
            aria-labelledby={`process-tab-${active}`}
            className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] border border-line bg-ocean-900"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={step.scene}
                src={asset(`${step.scene}.webp`)}
                srcSet={`${asset(`${step.scene}-800.webp`)} 800w, ${asset(`${step.scene}.webp`)} 1600w`}
                sizes="(min-width: 1024px) 680px, 92vw"
                alt={step.sceneAlt}
                width={1600}
                height={900}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: ease.outExpo }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
            <motion.span
              key={`badge-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.playful, delay: 0.25 }}
              className="absolute bottom-4 left-4 rounded-[var(--radius-control)] bg-base/90 px-3 py-1.5 text-sm"
            >
              {active + 1} / {steps.length} · {step.title}
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}
