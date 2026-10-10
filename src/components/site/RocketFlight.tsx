"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useMemo, useRef, type PointerEvent, type ReactNode } from "react";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { Mosaic } from "@/components/ui/Mosaic";
import { PixelCloud, PixelRocket } from "@/components/brand/PixelCharacters";
import { random } from "./process/choreo";

// The contact panel's rocket is always on its way up: stars and clouds stream past at
// their own depth, exhaust puffs trail behind it and the altitude counts up. When the
// pointer is on the contact button it goes full throttle: the engine roars, stars stretch
// into streaks, the puffs race and the altitude climbs faster. The rocket drifts towards
// the pointer. Everything moves with one shared distance, so a change of speed never jumps.

// Integer-seeded, rounded values: the server and the browser must render the same numbers.
const round = (value: number, places = 2) => Math.round(value * 10 ** places) / 10 ** places;
const STARS = Array.from({ length: 22 }, (_, index) => {
  const r = random(index * 31 + 7);
  const depth = round(0.35 + r() * 1.1);
  return { x: round(3 + r() * 94), from: round(r() * 100), depth, size: depth > 1 ? 3 : 2, bright: r() > 0.6 };
});

const CLOUDS = [
  { x: "2%", width: "34%", from: 10, depth: 1.4, opacity: 0.5 },
  { x: "62%", width: "40%", from: 85, depth: 1.9, opacity: 0.65 },
];

const PUFFS = 12;
// Sideways drift of each puff, alternating sides.
const SWAY = [0.6, -0.8, 0.3, -0.4, 0.9, -0.2, 0.5, -0.7, 0.1, -0.9, 0.7, -0.5];

// Ringed pixel planet, far away. Letters are palette colours, "." is empty.
const PLANET = ["......hhP......", "....hhPPPPP....", "...hPPPPPPPP...", "RR.PPPPPPPPP.RR", ".RRRRRRRRRRRRR.", "...ppppppppp...", "....ppppppp....", "......ppp......"];
const PLANET_COLOURS: Record<string, string> = { h: "#90e0ef", P: "#0096c7", p: "#0077b6", R: "#ffb703" };

// Position along a lane that wraps: `from` (in % of the lane) plus the distance travelled.
function useLane(travel: MotionValue<number>, from: number, depth: number, span = 110) {
  return useTransform(travel, (distance) => `${round(((from + distance * depth) % span) - (span - 100) / 2)}%`);
}

export function RocketFlight({ launch, locale }: { launch: boolean; locale: string }) {
  const { reduced } = useMotionPolicy();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const travel = useMotionValue(0);
  const speed = useSpring(1, { stiffness: 50, damping: 16 });
  useEffect(() => speed.set(launch ? 4.2 : 1), [launch, speed]);
  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return;
    travel.set(travel.get() + speed.get() * Math.min(delta, 50) * 0.0045);
  });
  const streak = useTransform(speed, (value) => 1 + (value - 1) * 1.6);

  // Altitude: grows with the distance travelled.
  const format = useMemo(() => new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale]);
  const altitude = useTransform(travel, (distance) => `${format.format(12.4 + distance * 0.031)} km`);

  // The rocket drifts towards the pointer (no rotation: the pixels stay square).
  const drift = useSpring(0, { stiffness: 120, damping: 14 });
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    drift.set(((event.clientX - box.left) / box.width - 0.5) * 36);
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={() => drift.set(0)}
      className="relative flex min-h-[260px] items-center justify-center overflow-hidden"
    >
      <Mosaic className="absolute inset-0" tile={28} from={1} to={6} direction="horizontal" seed={11} />

      {/* Far away: a planet drifting by very slowly. */}
      <Lane travel={travel} from={22} depth={0.12} span={140}>
        <svg viewBox="0 0 15 8" shapeRendering="crispEdges" className="absolute left-[72%] w-[15%] max-w-[64px] opacity-80">
          {PLANET.flatMap((row, y) =>
            [...row].map((cell, x) => (cell === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PLANET_COLOURS[cell]} />)),
          )}
        </svg>
      </Lane>

      {/* Stars, nearer ones larger and faster; at full throttle they stretch into streaks. */}
      {STARS.map((star, index) => (
        <Lane key={index} travel={travel} from={star.from} depth={star.depth}>
          <motion.span
            className={`absolute block origin-bottom ${star.bright ? "bg-white" : "bg-ocean-100/60"}`}
            style={{ left: `${star.x}%`, width: star.size, height: star.size, scaleY: streak }}
          />
        </Lane>
      ))}

      {CLOUDS.map((cloud, index) => (
        <Lane key={index} travel={travel} from={cloud.from} depth={cloud.depth} span={150}>
          <span className="absolute block" style={{ left: cloud.x, width: cloud.width, opacity: cloud.opacity }}>
            <PixelCloud className="w-full" />
          </span>
        </Lane>
      ))}

      {/* The rocket with its exhaust trail. */}
      <motion.div
        className="relative w-28 md:w-36"
        style={{ x: drift }}
        animate={launch ? { y: -22 } : { y: 0 }}
        transition={spring.playful}
      >
        <div className="absolute left-1/2 top-[96%] h-[90%] w-[60%] -translate-x-1/2">
          {Array.from({ length: PUFFS }, (_, index) => (
            <Puff key={index} travel={travel} index={index} hidden={reduced} />
          ))}
        </div>
        <PixelRocket engine={launch ? "roar" : "idle"} className="ambient relative w-full animate-bob" />
      </motion.div>

      {/* Altitude readout. */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-[var(--radius-control)] border border-white/10 bg-base/70 px-2.5 py-1.5 font-mono text-[11px] text-ocean-100">
        <span className="text-muted">ALT</span>
        <motion.span className="tabular-nums">{altitude}</motion.span>
        <motion.span
          className="block size-1.5 bg-ocean-300"
          animate={reduced ? { opacity: 1 } : { opacity: [1, 0.25, 1] }}
          transition={{ duration: launch ? 0.4 : 1.2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// A full-height lane that moves its content down as the rocket climbs, wrapping round.
function Lane({ travel, from, depth, span, children }: { travel: MotionValue<number>; from: number; depth: number; span?: number; children: ReactNode }) {
  const y = useLane(travel, from, depth, span);
  return (
    <motion.div className="pointer-events-none absolute inset-x-0 top-0 h-full" style={{ y }}>
      {children}
    </motion.div>
  );
}

// One exhaust puff: leaves the nozzle, falls behind, swells and fades. Its place in the
// cycle comes from the distance travelled, so the trail runs faster at full throttle.
function Puff({ travel, index, hidden }: { travel: MotionValue<number>; index: number; hidden: boolean }) {
  const phase = useTransform(travel, (distance) => (distance * 0.28 + index / PUFFS) % 1);
  const sway = SWAY[index % SWAY.length];
  const y = useTransform(phase, (p) => `${round(p * 100)}%`);
  const x = useTransform(phase, (p) => `${round(sway * p * 120)}%`);
  const scale = useTransform(phase, (p) => round(0.5 + p * 1.6, 3));
  const opacity = useTransform(phase, (p) => (hidden ? 0 : round(p < 0.08 ? p / 0.08 : 1 - p, 3)));
  const colour = index % 3 === 0 ? "#ffffff" : index % 3 === 1 ? "#caf0f8" : "#90e0ef";
  return (
    <motion.span className="absolute inset-x-0 top-0 block h-full" style={{ y }}>
      <motion.span className="absolute left-1/2 top-0 block size-3 -translate-x-1/2" style={{ x, scale, opacity, backgroundColor: colour }} />
    </motion.span>
  );
}
