"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/types";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { GrowingPrototype } from "./GrowingPrototype";
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
                    <span className={`block pl-8 pt-2 text-[15px] leading-relaxed transition-colors duration-300 ${isActive ? "text-fg/85" : "text-muted/70"}`}>
                      {entry.text}
                    </span>
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

          <div id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${active}`} aria-live="polite">
            <p className="sr-only">{step.sceneAlt}</p>
            <GrowingPrototype step={active} labels={dict.process.prototype} />
          </div>
        </div>
      </div>
    </section>
  );
}
