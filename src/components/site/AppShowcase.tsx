"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { AppShowcase as App } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { Mosaic } from "@/components/ui/Mosaic";

const STEP_MS = 3400;

// Our own apps in one phone: the screen slides from app to app on its own, a thin bar runs
// under the active app, and pointing at an app shows it right away (and pauses the tour).
export function AppShowcase({ apps }: { apps: App[] }) {
  const shown = apps.filter((app) => app.screen);
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const { reduced } = useMotionPolicy();
  const running = inView && !held && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((value) => (value + 1) % shown.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, index, shown.length]);

  const app = shown[index];
  return (
    <div ref={ref} className="relative aspect-video overflow-hidden bg-ocean-950" onPointerLeave={() => setHeld(false)}>
      <Mosaic className="absolute inset-0" from={6} to={1} seed={5} />

      {/* The phone. */}
      <motion.div
        className="absolute left-[9%] top-[7%] h-[86%] overflow-hidden rounded-[var(--radius-device)] border-[3px] border-base bg-base shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
        style={{ aspectRatio: "9 / 19.5" }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={spring.playful}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={app.name}
            src={asset(app.screen!)}
            alt={app.screenAlt ?? app.name}
            className="absolute inset-0 size-full object-cover object-top"
            initial={reduced ? false : { x: "100%", opacity: 0.6 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-35%", opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.outExpo }}
          />
        </AnimatePresence>
        <span className="absolute left-1/2 top-1.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-base/80" aria-hidden="true" />
      </motion.div>

      {/* The apps. */}
      <ul className="absolute right-[5%] top-1/2 flex w-[46%] -translate-y-1/2 flex-col gap-1.5">
        {shown.map((entry, position) => {
          const active = position === index;
          return (
            <motion.li
              key={entry.name}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring.ui, delay: 0.25 + position * 0.07 }}
            >
              <button
                type="button"
                onPointerEnter={() => {
                  setHeld(true);
                  setIndex(position);
                }}
                onFocus={() => {
                  setHeld(true);
                  setIndex(position);
                }}
                onClick={() => setIndex(position)}
                aria-pressed={active}
                className={`relative flex w-full items-center gap-2.5 overflow-hidden rounded-[var(--radius-control)] border px-2.5 py-2 text-left transition-colors duration-200 ${
                  active ? "border-ocean-400/60 bg-base/95" : "border-white/10 bg-base/70 hover:bg-base/90"
                }`}
              >
                {entry.icon ? (
                  <motion.img
                    src={asset(entry.icon)}
                    alt=""
                    className="size-7 shrink-0 rounded-[7px] sm:size-8"
                    animate={{ scale: active ? 1.08 : 1, rotate: active ? -4 : 0 }}
                    transition={spring.playful}
                  />
                ) : (
                  <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-ocean-700 text-xs font-medium sm:size-8" aria-hidden="true">
                    {entry.name.slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-xs font-medium sm:text-sm">{entry.name}</span>
                  <span className="hidden truncate text-[11px] text-muted md:block">{entry.text}</span>
                </span>
                {active && running && (
                  <motion.span
                    key={`bar-${index}`}
                    className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-ocean-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    aria-hidden="true"
                  />
                )}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
