"use client";

import { AnimatePresence, motion, useInView, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { AppShowcase as App } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { Mosaic } from "@/components/ui/Mosaic";

// One tour stop per app: the screen arrives, a notification drops in and leaves again, then a
// finger swipes on to the next app. Pointing at an app in the list shows it and holds the tour.
const NOTIFY_MS = 900;
const CLEAR_MS = 2700;
const SWIPE_MS = 3400;
const NEXT_MS = 4300;

type Phase = "arrive" | "notify" | "rest" | "swipe";

// The outgoing screen sinks back while the next one slides over it, like switching apps.
const slide: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", scale: 1, opacity: 1, zIndex: 1 }),
  center: { x: "0%", scale: 1, opacity: 1, zIndex: 1 },
  pulled: { x: "-8%", scale: 1, opacity: 1, zIndex: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? "-30%" : "30%", scale: 0.9, opacity: 0.3, zIndex: 0 }),
};

const fade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  pulled: { opacity: 1 },
  exit: { opacity: 0 },
};

export function AppShowcase({ apps }: { apps: App[] }) {
  const shown = apps.filter((app) => app.screen);
  const count = shown.length;
  const [[index, direction], setCurrent] = useState<[number, number]>([0, 1]);
  const [phase, setPhase] = useState<Phase>("arrive");
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const { reduced } = useMotionPolicy();
  const live = inView && !reduced;

  useEffect(() => {
    if (!live) return;
    const timers = [
      window.setTimeout(() => setPhase("notify"), NOTIFY_MS),
      window.setTimeout(() => setPhase("rest"), CLEAR_MS),
    ];
    if (!held) {
      timers.push(
        window.setTimeout(() => setPhase("swipe"), SWIPE_MS),
        window.setTimeout(() => {
          setCurrent(([value]) => [(value + 1) % count, 1]);
          setPhase("arrive");
        }, NEXT_MS),
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [live, held, index, count]);

  const show = (position: number) => {
    setHeld(true);
    if (position !== index) {
      setCurrent([position, position > index ? 1 : -1]);
      setPhase("arrive");
    } else if (phase === "swipe") {
      setPhase("rest");
    }
  };

  const app = shown[index];
  const variants = reduced ? fade : slide;

  return (
    <div ref={ref} className="relative aspect-video overflow-hidden bg-ocean-950" onPointerLeave={() => setHeld(false)}>
      <Mosaic className="absolute inset-0" from={6} to={1} seed={5} />

      {/* The phone is taller than the panel and runs out at the bottom edge, as if held up to the viewer. */}
      <motion.div
        className="absolute left-[9%] top-[8%] h-[122%]"
        style={{ aspectRatio: "9 / 19.5" }}
        initial={{ opacity: 0, y: 48, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: -3 }}
        viewport={{ once: true }}
        transition={spring.playful}
      >
        <motion.div
          className="relative size-full"
          animate={live ? { y: [0, -6, 0] } : { y: 0 }}
          transition={live ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        >
          <span className="absolute -left-[3px] top-[15%] h-[4%] w-[3px] rounded-l-sm bg-ocean-100/25" aria-hidden="true" />
          <span className="absolute -left-[3px] top-[22%] h-[8%] w-[3px] rounded-l-sm bg-ocean-100/25" aria-hidden="true" />
          <span className="absolute -left-[3px] top-[31%] h-[8%] w-[3px] rounded-l-sm bg-ocean-100/25" aria-hidden="true" />
          <span className="absolute -right-[3px] top-[24%] h-[11%] w-[3px] rounded-r-sm bg-ocean-100/25" aria-hidden="true" />

          <div className="absolute inset-0 rounded-[var(--radius-device)] bg-base p-[3.5%] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)] ring-1 ring-white/15">
            <div className="relative size-full overflow-hidden rounded-[calc(var(--radius-device)_-_4px)] bg-base">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={app.name}
                  src={asset(app.screen!)}
                  alt={app.screenAlt ?? app.name}
                  className="absolute inset-0 size-full object-cover object-top"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate={phase === "swipe" ? "pulled" : "center"}
                  exit="exit"
                  transition={reduced ? { duration: 0.2 } : { duration: 0.75, ease: ease.outExpo }}
                />
              </AnimatePresence>

              <span className="absolute left-1/2 top-[1.8%] z-20 h-[3.6%] w-[32%] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />

              <AnimatePresence>
                {phase === "notify" && app.note && (
                  <motion.div
                    key={`note-${app.name}`}
                    className="absolute inset-x-[5%] top-[7%] z-10 flex items-center gap-[6%] rounded-[10px] border border-white/10 bg-raised/95 p-[5%] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)]"
                    initial={{ y: "-140%", scale: 0.92, opacity: 0 }}
                    animate={{ y: "0%", scale: 1, opacity: 1 }}
                    exit={{ y: "-140%", scale: 0.96, opacity: 0, transition: { duration: 0.35, ease: ease.standard } }}
                    transition={spring.playful}
                    aria-hidden="true"
                  >
                    <AppIcon app={app} className="w-[18%] shrink-0 text-[9px]" />
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate text-[9px] font-medium sm:text-[10px]">{app.name}</span>
                      <span className="line-clamp-2 text-[8px] text-muted sm:text-[9px]">{app.note}</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase === "swipe" && (
                  <motion.span
                    key={`finger-${index}`}
                    className="pointer-events-none absolute inset-0 z-30"
                    initial={{ x: "0%" }}
                    animate={{ x: ["0%", "0%", "-46%"] }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.85, times: [0, 0.3, 1], ease: "easeInOut" }}
                    aria-hidden="true"
                  >
                    <span className="absolute left-[74%] top-[58%] aspect-square w-[20%] -translate-x-1/2 -translate-y-1/2">
                      <motion.span
                        className="absolute inset-0 rounded-full bg-white/45 ring-1 ring-white/80"
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 0.8 }}
                        transition={{ duration: 0.25, ease: ease.outExpo }}
                      />
                      <motion.span
                        className="absolute inset-0 rounded-full ring-1 ring-white/80"
                        initial={{ opacity: 0.8, scale: 0.8 }}
                        animate={{ opacity: 0, scale: 2.2 }}
                        transition={{ duration: 0.6, delay: 0.18, ease: ease.outExpo }}
                      />
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* The apps. */}
      <ul className="absolute right-[5%] top-1/2 flex w-[44%] -translate-y-1/2 flex-col gap-1">
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
              <motion.button
                type="button"
                onPointerEnter={() => show(position)}
                onFocus={() => show(position)}
                onClick={() => show(position)}
                aria-pressed={active}
                animate={{ x: active ? -6 : 0 }}
                whileTap={{ scale: 0.97 }}
                transition={spring.ui}
                className={`relative flex w-full items-center gap-2 overflow-hidden rounded-[var(--radius-control)] border px-2 py-1.5 text-left transition-colors duration-200 ${
                  active ? "border-ocean-400/60 bg-base/95" : "border-white/10 bg-base/70 hover:bg-base/90"
                }`}
              >
                <motion.span
                  className="relative shrink-0"
                  animate={{ scale: active ? 1.08 : 1, rotate: active ? -4 : 0 }}
                  transition={spring.playful}
                >
                  <AppIcon app={entry} className="size-6 text-[10px] sm:size-7 sm:text-xs" />
                  <AnimatePresence>
                    {active && phase === "notify" && (
                      <motion.span
                        className="absolute -right-1 -top-1 size-2.5 rounded-full bg-ocean-400 ring-2 ring-base"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={spring.playful}
                        aria-hidden="true"
                      />
                    )}
                  </AnimatePresence>
                </motion.span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium">{entry.name}</span>
                  <span className="hidden truncate text-[11px] text-muted md:block">{entry.text}</span>
                </span>
                {active && live && !held && (
                  <motion.span
                    key={`bar-${index}`}
                    className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-ocean-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: NEXT_MS / 1000, ease: "linear" }}
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function AppIcon({ app, className }: { app: App; className: string }) {
  if (app.icon) return <img src={asset(app.icon)} alt="" className={`aspect-square rounded-[22%] ${className}`} />;
  return (
    <span className={`grid aspect-square place-items-center rounded-[22%] bg-ocean-700 font-medium ${className}`} aria-hidden="true">
      {app.name.slice(0, 1)}
    </span>
  );
}
