"use client";

import { animate, motion } from "motion/react";
import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";
import { spring } from "@/lib/motion";
import {
  arriving,
  at,
  BLOCK_RADIUS,
  BLOCKS,
  ERASE,
  ERASE_PATH,
  outlineHalves,
  rewound,
  roughRect,
  traceDelay,
  undo,
  undoAt,
  type BlockSpec,
  type Cue,
  type Step,
} from "./choreo";

export const WIRE = "#8691a6";
const SKETCH = "#90e0ef";

// Moment a block snaps into colour on the way to the working build.
export function snapDelay(index: number) {
  return 0.42 + index * 0.1;
}

// Going back, blocks run bottom to top inside each undo (choreo.ts, undoAt).
export function backDelay(index: number) {
  return (BLOCKS.length - 1 - index) * 0.035;
}

type BlockProps = {
  spec: BlockSpec;
  index: number;
  step: Step;
  cue: Cue;
  // Fill once it is built, and once it is live.
  build: string;
  live?: string;
  liveAt?: number;
  // Scribbles on the sketch, in block units.
  scribble: string;
  // Sketch lines "boil" like hand-drawn animation while idle.
  boil: boolean;
  // Flip over on the way to live (the button).
  flips?: boolean;
  // Live only: the block reacts to a click, and stays highlighted while it is open.
  onPress?: (event: MouseEvent<HTMLDivElement>) => void;
  pressed?: boolean;
  // The robot works on it: it glows softly and takes small knocks.
  worked?: boolean;
  children?: ReactNode;
};

// One element of the app screen. It keeps its place through all four steps and only its
// look changes: dashed sketch, traced wireframe, coloured build. Hovering lifts it.
export function Block({ spec, index, step, cue, build, live, liveAt = 1, scribble, boil, flips, onPress, pressed, worked, children }: BlockProps) {
  const popper = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const mask = useId();
  const { w, h } = spec;
  const inkAt = traceDelay(spec.y + h / 2);
  const snapAt = snapDelay(index);
  // Going back: colour gives way to the wireframe, the outline un-inks, then the sketch returns.
  const lag = backDelay(index);
  const sketchBack = undo(cue, 1, lag + 0.06, 0.1);
  const [top, bottom] = outlineHalves(w, h);
  const sketchA = roughRect(w, h, index * 7 + 3, 1.2);
  const sketchB = roughRect(w, h, index * 7 + 5, 1.2);

  // One-shot pops for the change of step: snap into colour, or flip over to live.
  useEffect(() => {
    const box = popper.current;
    const light = flash.current;
    if (!box || !light) return;
    const running: { complete: () => void }[] = [];
    if (arriving(cue, 2)) {
      running.push(animate(box, { scale: [1, 1.07, 0.98, 1] }, { delay: snapAt, duration: 0.34, ease: "easeOut" }));
      running.push(animate(light, { opacity: [0, 0.85, 0] }, { delay: snapAt - 0.03, duration: 0.18, ease: "linear" }));
    }
    if (flips && arriving(cue, 3)) {
      running.push(animate(box, { scaleY: [1, 0.06, 1.12, 1] }, { delay: liveAt - 0.13, duration: 0.36, times: [0, 0.36, 0.75, 1], ease: "easeInOut" }));
      running.push(animate(light, { opacity: [0, 0.7, 0] }, { delay: liveAt, duration: 0.2, ease: "linear" }));
    }
    return () => running.forEach((animation) => animation.complete());
  }, [cue, snapAt, flips, liveAt]);

  useEffect(() => {
    const box = popper.current;
    const light = flash.current;
    if (!worked || !box || !light) return;
    const glow = animate(light, { opacity: [0, 0.16, 0.04, 0.12, 0] }, { duration: 0.44, repeat: Infinity, ease: "linear" });
    const knock = animate(box, { x: [0, -2, 0] }, { duration: 0.22, repeat: Infinity, ease: "easeOut" });
    return () => {
      glow.stop();
      knock.stop();
      animate(light, { opacity: 0 }, { duration: 0.1 });
      animate(box, { x: 0 }, { duration: 0.1 });
    };
  }, [worked]);

  const [fill, fillBack] = rewound(cue, ["rgba(134,145,166,0)", "rgba(134,145,166,0.12)", build, live ?? build], step, lag);
  const fillTransition =
    fillBack ??
    at(cue, {
      1: { delay: inkAt + 0.12, duration: 0.3 },
      2: { delay: snapAt + 0.05, duration: 0 },
      3: { delay: liveAt, duration: 0 },
    });

  const drawn = step >= 1;
  const strokeTransition = {
    pathLength: at(cue, { 1: { delay: inkAt, duration: 0.3, ease: "easeOut" } }, undo(cue, 1, lag, 0.14)),
    opacity: at(cue, { 2: { delay: snapAt, duration: 0 } }, undo(cue, 2, lag, 0)),
    stroke: arriving(cue, 1) ? { delay: inkAt + 0.25, duration: 0.6 } : { duration: 0 },
  };

  return (
    <motion.div
      className={`group absolute ${onPress ? "cursor-pointer" : ""}`}
      style={{ left: `${spec.x}cqw`, top: `${spec.y}cqw`, width: `${w}cqw`, height: `${h}cqw` }}
      whileHover={{ y: -3 }}
      whileTap={onPress ? { scale: 0.97 } : undefined}
      transition={spring.ui}
      onClick={onPress}
    >
      {/* Once built, a hard shadow stays put while the block lifts on hover. */}
      {step >= 2 && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-y-[3px] bg-ocean-950 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{ borderRadius: `${BLOCK_RADIUS}cqw` }}
        />
      )}
      <div ref={popper} className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ borderRadius: `${BLOCK_RADIUS}cqw` }}
          initial={false}
          animate={{ backgroundColor: fill }}
          transition={fillTransition}
        />
        {children}
        <svg viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <defs>
            <mask id={mask} maskUnits="userSpaceOnUse" x={-6} y={-6} width={w + 12} height={h + 12}>
              <rect x={-6} y={-6} width={w + 12} height={h + 12} fill="white" />
              {/* The eraser's path across the whole device, moved into this block. */}
              <motion.path
                d={ERASE_PATH}
                transform={`translate(${-spec.x} ${-spec.y})`}
                fill="none"
                stroke="black"
                strokeWidth={21}
                strokeLinecap="square"
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: step >= 1 ? 1 : 0 }}
                transition={at(cue, { 1: { delay: ERASE.start, duration: ERASE.duration, ease: "linear" } }, { duration: 0 })}
              />
            </mask>
          </defs>

          {/* Scribbles on the sketch: rubbed out on the way to the wireframe, redrawn last on rewind. */}
          <motion.g
            mask={`url(#${mask})`}
            initial={false}
            animate={{ opacity: step === 0 ? 1 : 0 }}
            transition={at(cue, { 1: { delay: ERASE.start + ERASE.duration, duration: 0.1 } }, { ...sketchBack, duration: 0 })}
          >
            <motion.path
              d={scribble}
              fill="none"
              stroke="#caf0f8"
              strokeOpacity={0.75}
              strokeWidth={0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: cue.mode === "back" && step === 0 ? [0, 1] : 1 }}
              transition={cue.mode === "back" ? { delay: undoAt(cue, 1) + lag + 0.06, duration: 0.18, ease: "easeOut" } : { duration: 0 }}
            />
          </motion.g>

          {/* Dashed sketch outline in two hand-drawn variants that alternate. */}
          <motion.g
            initial={false}
            animate={{ opacity: step === 0 ? 1 : 0 }}
            transition={at(cue, { 1: { delay: inkAt, duration: 0.18 } }, sketchBack)}
            fill="none"
            stroke={SKETCH}
            strokeOpacity={0.7}
            strokeWidth={0.7}
            strokeDasharray="2.6 1.7"
            strokeLinecap="round"
          >
            <motion.path d={sketchA} animate={{ opacity: boil ? [1, 1, 0, 0] : 1 }} transition={boil ? { duration: 0.56, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" } : { duration: 0 }} />
            <motion.path d={sketchB} initial={{ opacity: 0 }} animate={{ opacity: boil ? [0, 0, 1, 1] : 0 }} transition={boil ? { duration: 0.56, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" } : { duration: 0 }} />
          </motion.g>

          {/* Clean outline, inked from the right edge where the pencil passes. */}
          {[top, bottom].map((d) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              strokeWidth={0.8}
              strokeLinecap="round"
              initial={false}
              animate={{
                pathLength: drawn ? 1 : 0,
                opacity: step >= 2 ? 0 : 1,
                stroke: arriving(cue, 1) ? ["#caf0f8", WIRE] : WIRE,
              }}
              transition={strokeTransition}
            />
          ))}
        </svg>
        <div ref={flash} className="pointer-events-none absolute inset-0 bg-white opacity-0" style={{ borderRadius: `${BLOCK_RADIUS}cqw` }} />
      </div>
      {/* Hover highlight; stays while the block's detail is open. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-[0.9cqw] border-[0.5cqw] border-ocean-300 transition-opacity duration-150 group-hover:opacity-100 ${pressed ? "opacity-100" : "opacity-0"}`}
        style={{ borderRadius: `${BLOCK_RADIUS + 0.9}cqw` }}
      />
    </motion.div>
  );
}
