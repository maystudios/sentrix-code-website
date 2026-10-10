import type { Transition } from "motion/react";
import { ease } from "@/lib/motion";

// Choreography of the growing prototype (GrowingPrototype.tsx).
// Every element has one look per step (0 sketch, 1 wireframe, 2 working build, 3 live).
// A change of step is a small staged sequence: each element animates to its new look with
// the timing of the hop that changes it, so the eye follows one object. Jumps play the last
// hop in full and everything before it quickly; going back rewinds fast, bottom to top.

export type Step = 0 | 1 | 2 | 3;
export type Trans = { from: Step; to: Step; id: number };
export type Mode = "rest" | "fwd" | "back";
export type Cue = { trans: Trans | null; mode: Mode; reduced: boolean };

export function cueOf(trans: Trans | null, reduced: boolean): Cue {
  if (!trans || reduced) return { trans, mode: "rest", reduced };
  return { trans, mode: trans.to > trans.from ? "fwd" : "back", reduced };
}

// True while the transition arrives at `step` going forward (the hop that plays in full).
export function arriving(cue: Cue, step: Step) {
  return cue.mode === "fwd" && cue.trans?.to === step;
}

// `steps(n)` easing: frame-by-frame changes that suit pixel art.
export function stepped(count: number) {
  return (t: number) => (t >= 1 ? 1 : Math.floor(t * count) / count);
}

const QUICK: Transition = { duration: 0.2, ease: ease.outExpo };
const BACK: Transition = { duration: 0.18, ease: stepped(3) };

// Timing of one property for the current change of step.
export function at(cue: Cue, byStep: Partial<Record<Step, Transition>>, back: Transition = BACK): Transition {
  if (cue.mode === "rest") return { duration: 0 };
  if (cue.mode === "back") return back;
  return byStep[cue.trans!.to] ?? QUICK;
}

// Seconds after a change until its sequence has played and ambient loops may start.
export function settleTime(cue: Cue) {
  if (cue.mode === "rest") return 0;
  if (cue.mode === "back") return 0.9;
  return [0, 3.0, 2.5, 2.9][cue.trans!.to];
}

// The device is drawn in units: 100 wide, 136 high (1 unit = 1cqw of the stage).
export const DEVICE_H = 136;

export type BlockId = "header" | "hero" | "row0" | "row1" | "row2" | "button";
export type BlockSpec = { id: BlockId; x: number; y: number; w: number; h: number };

export const BLOCKS: BlockSpec[] = [
  { id: "header", x: 7, y: 8, w: 86, h: 10 },
  { id: "hero", x: 7, y: 22, w: 86, h: 40 },
  { id: "row0", x: 7, y: 66, w: 86, h: 11 },
  { id: "row1", x: 7, y: 80, w: 86, h: 11 },
  { id: "row2", x: 7, y: 94, w: 86, h: 11 },
  { id: "button", x: 7, y: 114, w: 86, h: 13 },
];

export const BLOCK_RADIUS = 2.4;

// Sketch → wireframe: the pencil traces the device outline clockwise from the top right,
// then turns round and rubs the scribbles out with its eraser.
export const FRAME_PATH = "M92 1A7 7 0 0 1 99 8V128A7 7 0 0 1 92 135H8A7 7 0 0 1 1 128V8A7 7 0 0 1 8 1Z";
const C = 7 * Math.SQRT1_2;
const FRAME_TRACK: [number, number][] = [
  [92, 1],
  [92 + C, 8 - C],
  [99, 8],
  [99, 128],
  [92 + C, 128 + C],
  [92, 135],
  [8, 135],
  [8 - C, 128 + C],
  [1, 128],
  [1, 8],
  [8 - C, 8 - C],
  [8, 1],
  [92, 1],
];

// Back-and-forth scrubbing, one stroke per row of scribbles, with short links between.
export const ERASE_TRACK: [number, number][] = [
  [6, 13],
  [40, 13],
  [88, 30],
  [12, 34],
  [88, 48],
  [12, 54],
  [56, 70],
  [10, 74],
  [56, 86],
  [10, 88],
  [58, 100],
  [10, 101],
  [38, 120],
  [66, 121],
];
export const ERASE_PATH = `M${ERASE_TRACK.map(([x, y]) => `${x} ${y}`).join("L")}`;

function lengths(track: [number, number][]) {
  const result = [0];
  for (let i = 1; i < track.length; i++) {
    const [ax, ay] = track[i - 1];
    const [bx, by] = track[i];
    result.push(result[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  return result;
}

const FRAME_LENGTHS = lengths(FRAME_TRACK);
const FRAME_TOTAL = FRAME_LENGTHS[FRAME_LENGTHS.length - 1];
const ERASE_LENGTHS = lengths(ERASE_TRACK);
const ERASE_TOTAL = ERASE_LENGTHS[ERASE_LENGTHS.length - 1];

// Timeline of the trace, in seconds from the click.
export const TRACE = { start: 0.3, duration: 1.0 };
export const ERASE = { start: 1.66, duration: 0.92 };
export const WIRE_CONTENT = 2.36;

// When the pencil passes a height on the right edge, the box at that height inks in.
export function traceDelay(y: number) {
  return TRACE.start + (TRACE.duration * (FRAME_LENGTHS[2] + (y - 8))) / FRAME_TOTAL;
}

// Pencil poses: tip position in device units. Idle hovers right of the sketch, parked lies
// beside the wireframe, gone has flown off to the right.
export const PENCIL_POSE = {
  idle: { x: 103, y: 34 },
  parked: { x: 105, y: 80 },
  gone: { x: 140, y: 40 },
} as const;

// One keyframe track for the whole trace: fly in, trace, flip, erase, flip back, park.
export function pencilTrace() {
  // `drawing` marks keys reached at constant speed along a line; the moves between phases ease.
  const keys: { t: number; x: number; y: number; flip: number; drawing: boolean }[] = [];
  const add = (t: number, x: number, y: number, flip: number, drawing = false) => keys.push({ t, x, y, flip, drawing });
  add(0, PENCIL_POSE.idle.x, PENCIL_POSE.idle.y, 0);
  // A little wind-up before it starts.
  add(0.12, PENCIL_POSE.idle.x + 3, PENCIL_POSE.idle.y - 5, 0);
  FRAME_TRACK.forEach(([x, y], i) => add(TRACE.start + (TRACE.duration * FRAME_LENGTHS[i]) / FRAME_TOTAL, x, y, 0, i > 0));
  // Lift off and turn round over the page, eraser first.
  add(TRACE.start + TRACE.duration + 0.2, 32, 16, 180);
  ERASE_TRACK.forEach(([x, y], i) => add(ERASE.start + (ERASE.duration * ERASE_LENGTHS[i]) / ERASE_TOTAL, x, y, 180, i > 0));
  const end = ERASE.start + ERASE.duration;
  add(end + 0.18, 86, 110, 0);
  add(end + 0.46, PENCIL_POSE.parked.x, PENCIL_POSE.parked.y, 0);
  const total = keys[keys.length - 1].t;
  return {
    duration: total,
    times: keys.map((key) => key.t / total),
    x: keys.map((key) => key.x),
    y: keys.map((key) => key.y),
    flip: keys.map((key) => key.flip),
    ease: keys.slice(1).map((key) => (key.drawing ? "linear" : "easeInOut")) as ("linear" | "easeInOut")[],
  };
}

// Crumbs fall where the eraser has been.
export function crumbSpots(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = ((i + 0.5) / count) * ERASE_TOTAL;
    let k = 1;
    while (k < ERASE_LENGTHS.length - 1 && ERASE_LENGTHS[k] < d) k++;
    const [ax, ay] = ERASE_TRACK[k - 1];
    const [bx, by] = ERASE_TRACK[k];
    const f = (d - ERASE_LENGTHS[k - 1]) / (ERASE_LENGTHS[k] - ERASE_LENGTHS[k - 1]);
    return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f, t: ERASE.start + (ERASE.duration * d) / ERASE_TOTAL };
  });
}

// Small deterministic random numbers, so renders stay pure.
export function random(seed: number) {
  let value = (Math.abs(Math.round(seed)) * 2654435761 + 12345) % 4294967296;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

// Hand-drawn outline: four strokes that overshoot the corners and bow a little.
export function roughRect(w: number, h: number, seed: number, overshoot = 1.4) {
  const r = random(seed);
  const j = (amount = 0.7) => (r() - 0.5) * 2 * amount;
  const n = (value: number) => value.toFixed(2);
  const i = 0.6;
  return [
    `M${n(-overshoot + j())} ${n(i + j(0.4))}Q${n(w / 2)} ${n(i + j(1.1))} ${n(w + overshoot + j())} ${n(i + j(0.4))}`,
    `M${n(w - i + j(0.4))} ${n(-overshoot + j())}Q${n(w - i + j(1.1))} ${n(h / 2)} ${n(w - i + j(0.4))} ${n(h + overshoot + j())}`,
    `M${n(w + overshoot + j())} ${n(h - i + j(0.4))}Q${n(w / 2)} ${n(h - i + j(1.1))} ${n(-overshoot + j())} ${n(h - i + j(0.4))}`,
    `M${n(i + j(0.4))} ${n(h + overshoot + j())}Q${n(i + j(1.1))} ${n(h / 2)} ${n(i + j(0.4))} ${n(-overshoot + j())}`,
  ].join("");
}

// Clean rounded outline in two halves that start on the right edge, where the pencil passes,
// and meet on the left.
export function outlineHalves(w: number, h: number, radius = BLOCK_RADIUS) {
  const i = 0.5;
  const r = radius;
  const m = h / 2;
  const top = `M${w - i} ${m}V${i + r}A${r} ${r} 0 0 0 ${w - i - r} ${i}H${i + r}A${r} ${r} 0 0 0 ${i} ${i + r}V${m}`;
  const bottom = `M${w - i} ${m}V${h - i - r}A${r} ${r} 0 0 1 ${w - i - r} ${h - i}H${i + r}A${r} ${r} 0 0 1 ${i} ${h - i - r}V${m}`;
  return [top, bottom];
}

// A square-pixel confetti burst with gravity, sampled into keyframes.
export type Particle = { x: number[]; y: number[]; size: number; colour: string; spin: number; delay: number };

const CONFETTI = ["#ffb703", "#48cae4", "#caf0f8", "#00b4d8", "#ffffff", "#90e0ef"];

export function burst(seed: number, count: number, power = 1, spread = 140): Particle[] {
  const r = random(seed);
  const samples = 9;
  const duration = 1.5;
  const gravity = 235;
  return Array.from({ length: count }, () => {
    const angle = ((-90 + (r() - 0.5) * spread) * Math.PI) / 180;
    const speed = (105 + r() * 95) * power;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const x: number[] = [];
    const y: number[] = [];
    for (let s = 0; s < samples; s++) {
      const t = (s / (samples - 1)) * duration;
      // Light air drag on the horizontal drift.
      x.push(vx * t * (1 - t * 0.25));
      y.push(vy * t + 0.5 * gravity * t * t);
    }
    return {
      x,
      y,
      size: 2.2 + Math.round(r() * 3) * 0.7,
      colour: CONFETTI[Math.floor(r() * CONFETTI.length)],
      spin: 0.25 + r() * 0.35,
      delay: r() * 0.08,
    };
  });
}
