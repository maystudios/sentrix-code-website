"use client";

import { animate, motion, useInView, useMotionValue, useTransform, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/types";
import { spring } from "@/lib/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { GrowingPrototype } from "./GrowingPrototype";
import { stepped } from "./process/choreo";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

const STEP_SECONDS = 7;

// The marker on the progress line: a short travel with almost no overshoot.
const TRAVEL = { ...spring.ui, damping: 36 };

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

// Places on the step list, in px from its top: the progress line runs from the first number
// box to the last, `nodes` are the boxes as fractions of that line, `bars` the timer bars.
type Track = { top: number; length: number; nodes: number[]; bars: number[] };

function offsetIn(element: HTMLElement, root: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== root) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

function measure(root: HTMLElement): Track | null {
  const boxes = [...root.querySelectorAll<HTMLElement>("[data-node]")];
  const bars = [...root.querySelectorAll<HTMLElement>("[data-bar]")];
  if (boxes.length < 2) return null;
  const centres = boxes.map((box) => offsetIn(box, root) + box.offsetHeight / 2);
  const top = centres[0];
  const length = centres[centres.length - 1] - top;
  return {
    top,
    length,
    nodes: centres.map((centre) => (centre - top) / length),
    bars: bars.map((bar) => offsetIn(bar, root) + bar.offsetHeight / 2),
  };
}

// The four steps play through on their own while visible. The timer bar under the active
// step waits while the pointer is on the list or the prototype, or focus is in the list;
// the small control beside it pauses and resumes, and a click on a step pauses as well.
// A choice sends a marker along the progress line; the prototype follows when it arrives.
export function Process({ dict }: { dict: Dictionary }) {
  const steps = dict.process.steps;
  const labels = dict.process.prototype;
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoverList, setHoverList] = useState(false);
  const [hoverPanel, setHoverPanel] = useState(false);
  const [focusList, setFocusList] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const ref = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const { reduced } = useMotionPolicy();
  const autoplay = !reduced;
  const playing = autoplay && !paused && inView && !hoverList && !hoverPanel && !focusList;
  const progress = useMotionValue(0);
  const marker = useMotionValue(0);
  const markerY = useTransform(marker, (value) => `${value * 100}%`);

  const select = (index: number) => {
    if (index !== active) progress.set(0);
    setActive(index);
    setPaused(true);
  };
  const { tabProps } = useRovingTabs(steps.length, active, select, "vertical");

  useEffect(() => {
    const root = list.current;
    if (!root) return;
    const observer = new ResizeObserver(() => {
      const next = measure(root);
      setTrack((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Autoplay: the timer resumes from where it stopped.
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

  // The marker travels from the current step to the chosen one, the line fills or empties
  // behind it, and the prototype changes as soon as it arrives. Without motion: at once.
  useEffect(() => {
    if (!track) return;
    const target = track.nodes[active];
    if (reduced) {
      marker.set(target);
      return;
    }
    // It counts as arrived once it has covered most of the way (the rest is the settle).
    const near = Math.max(4, Math.abs(marker.get() - target) * track.length * 0.15);
    let arrived = false;
    const arrive = () => {
      if (arrived) return;
      arrived = true;
      setStage(active);
    };
    const travel = animate(marker, target, {
      ...TRAVEL,
      onUpdate: (value) => {
        if (Math.abs(value - target) * track.length < near) arrive();
      },
      onComplete: arrive,
    });
    return () => travel.stop();
  }, [active, track, reduced, marker]);

  const step = steps[active];

  return (
    <section ref={ref} id={dict.anchors.process} className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <h2 className="text-h2-xl">{dict.process.title}</h2>
          <p className="text-body-lg max-w-md text-muted md:justify-self-end">{dict.process.intro}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
          <div ref={list} className="relative">
            <ol
              role="tablist"
              aria-label={dict.process.title}
              aria-orientation="vertical"
              className="flex flex-col"
              onPointerEnter={(event) => event.pointerType === "mouse" && setHoverList(true)}
              onPointerLeave={() => setHoverList(false)}
              onFocus={() => setFocusList(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusList(false);
              }}
            >
              {steps.map((entry, index) => {
                const isActive = active === index;
                const done = index < active;
                return (
                  <li key={entry.title} role="presentation" className="relative border-t border-line last:border-b">
                    {/* Progress line between the number boxes; its fill and marker lie over it. */}
                    {index > 0 && <span aria-hidden="true" className="absolute left-[13px] top-0 h-5 w-0.5 bg-line-strong" />}
                    {index < steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[13px] top-12 w-0.5 bg-line-strong" />}
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
                          data-node
                          variants={boxVariants}
                          className={`relative z-10 grid size-7 shrink-0 place-items-center overflow-hidden rounded-[var(--radius-control)] border bg-base transition-colors duration-150 ${
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
                          <span className={`block pt-2 text-[15px] leading-relaxed transition-colors duration-300 ${isActive ? "text-fg/85" : "text-muted"}`}>
                            {entry.text}
                          </span>
                          {/* Autoplay timer: runs while the steps play by themselves, waits on hover or focus. */}
                          <span data-bar aria-hidden="true" className={`mt-4 block h-0.5 overflow-hidden rounded-full ${autoplay ? "mr-10" : ""}`}>
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

            {/* Filled progress line and the marker that travels along it, under the boxes. */}
            {track && (
              <div aria-hidden="true" className="pointer-events-none absolute left-[13px] w-0.5" style={{ top: track.top, height: track.length }}>
                <motion.span className="absolute inset-0 origin-top bg-ocean-400" style={{ scaleY: marker }} />
                <motion.span className="absolute inset-x-0 top-0 h-full" style={{ y: markerY }}>
                  <span className="absolute -left-0.5 -top-[3px] size-1.5 bg-ocean-100" />
                </motion.span>
              </div>
            )}

            {track && autoplay && (
              <PlayPause
                paused={paused}
                y={track.bars[active]}
                label={paused ? labels.play : labels.pause}
                onToggle={() => setPaused((value) => !value)}
              />
            )}
          </div>

          <div
            id="process-panel"
            role="tabpanel"
            aria-labelledby={`process-tab-${active}`}
            aria-live={playing ? "off" : "polite"}
            onPointerEnter={(event) => event.pointerType === "mouse" && setHoverPanel(true)}
            onPointerLeave={() => setHoverPanel(false)}
          >
            <p className="sr-only">{step.sceneAlt}</p>
            <GrowingPrototype step={reduced ? active : stage} labels={labels} locale={dict.locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Play and pause as six pixel columns of a 6 × 7 glyph. Each column grows or shrinks from
// its middle, so the symbol switches in a few stepped frames.
const GLYPH = { pause: [7, 7, 0, 0, 7, 7], play: [7, 5, 5, 3, 3, 1] };

// Sits at the end of the active step's timer bar and follows it from step to step. It is
// one element throughout, so keyboard focus stays on it while the steps change.
function PlayPause({ paused, y, label, onToggle }: { paused: boolean; y: number; label: string; onToggle: () => void }) {
  const columns = paused ? GLYPH.play : GLYPH.pause;
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-controls="process-panel"
      onClick={onToggle}
      className="absolute right-0 top-0 grid size-7 place-items-center rounded-[var(--radius-control)] border border-line-strong bg-base text-muted transition-colors duration-150 hover:border-ocean-700 hover:bg-raised hover:text-fg"
      initial={false}
      animate={{ y: y - 14 }}
      transition={spring.ui}
      whileTap={{ scale: 0.9 }}
    >
      <svg viewBox="0 0 6 7" className={`h-3.5 w-3 ${paused ? "translate-x-px" : ""}`} shapeRendering="crispEdges" aria-hidden="true">
        {columns.map((height, x) => (
          <motion.rect
            key={x}
            x={x}
            y={0}
            width={1}
            height={7}
            fill="currentColor"
            initial={false}
            animate={{ scaleY: height / 7 }}
            transition={{ duration: 0.16, ease: stepped(3) }}
          />
        ))}
      </svg>
    </motion.button>
  );
}
