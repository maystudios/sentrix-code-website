"use client";

import { motion, useAnimate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { Dictionary } from "@/content/types";
import { duration, ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { AnimatedPictogram } from "@/components/brand/AnimatedPictogram";
import { PixelCloud, PixelGamepad, PixelLaptop, PixelRobot, PixelRocket, PixelSparkle } from "@/components/brand/PixelCharacters";
import { BlockShape, LiveBlock, type Shape } from "./hero/LiveBlock";
import { DroneScene } from "./hero/DroneScene";
import { fallEase } from "./hero/physics";
import { Button } from "@/components/ui/Button";

type Block = {
  shape: Shape;
  // Position and size in hero units (--u), measured from the outer edge and the floor.
  edge: number;
  floor: number;
  w: number;
  h: number;
  color: string;
  delay: number;
  // Angle it starts its fall at; it straightens on the way down.
  tilt: number;
  // Carries a figure, so it does not move once landed.
  fixed?: boolean;
};

const LEFT: Block[] = [
  { shape: "square", edge: 0, floor: 0, w: 2, h: 2, color: "var(--color-ocean-700)", delay: 0.15, tilt: -12, fixed: true },
  { shape: "square", edge: 0, floor: 2, w: 2, h: 2, color: "var(--color-ocean-500)", delay: 0.45, tilt: 9, fixed: true },
  { shape: "diamond", edge: 2.25, floor: 0.12, w: 1.3, h: 1.3, color: "var(--color-ocean-400)", delay: 0.3, tilt: 24 },
  { shape: "square", edge: 3.75, floor: 0, w: 1, h: 1, color: "var(--color-ocean-300)", delay: 0.6, tilt: -16, fixed: true },
  { shape: "chevron", edge: 5, floor: 0, w: 1.9, h: 1, color: "var(--color-ocean-600)", delay: 0.72, tilt: 14 },
];

// The right tower (two big squares at the edge) belongs to the drone scene below.
const RIGHT: Block[] = [
  { shape: "diamond", edge: 2.3, floor: 0.12, w: 1.3, h: 1.3, color: "var(--color-ocean-500)", delay: 0.38, tilt: -22 },
  { shape: "square", edge: 3.8, floor: 0, w: 1.6, h: 1.6, color: "var(--color-ocean-600)", delay: 0.64, tilt: 13, fixed: true },
  { shape: "x", edge: 5.75, floor: 0, w: 1.2, h: 1.2, color: "var(--color-ocean-400)", delay: 0.82, tilt: -30 },
];

// Blocks drop in with gravity, straighten on the way and land flush with a jelly squash;
// a block landing on another jolts it. Free blocks can be grabbed and thrown afterwards,
// blocks that carry a figure stay put.
function Stack({ blocks, side, reduced }: { blocks: Block[]; side: "left" | "right"; reduced: boolean }) {
  const jolts = useRef(new Map<number, () => void>());
  return (
    <>
      {blocks.map((block, index) => {
        const below = blocks.findIndex((other) => other.edge === block.edge && Math.abs(other.floor + other.h - block.floor) < 0.01);
        return (
          <LiveBlock
            key={index}
            style={{
              [side]: `calc(var(--u) * ${block.edge})`,
              bottom: `calc(var(--u) * ${block.floor})`,
              width: `calc(var(--u) * ${block.w})`,
              height: `calc(var(--u) * ${block.h})`,
            }}
            delay={block.delay}
            tilt={block.tilt}
            reduced={reduced}
            draggable={!block.fixed}
            registerJolt={(jolt) => jolts.current.set(index, jolt)}
            onLand={below >= 0 ? () => jolts.current.get(below)?.() : undefined}
          >
            <BlockShape shape={block.shape} color={block.color} />
          </LiveBlock>
        );
      })}
    </>
  );
}

// A figure drops onto its block after the block has landed and gives under its own weight
// for a moment (a short dip, no rebound).
function Sprite({ children, className, delay, style }: { children: ReactNode; className?: string; delay: number; style: React.CSSProperties }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute ${className ?? ""}`}
      style={style}
      initial={{ opacity: 0, y: -260 }}
      animate={{ opacity: 1, y: [-260, 0, 5, 0] }}
      transition={{ delay, duration: 0.62, times: [0, 0.62, 0.8, 1], ease: [fallEase, "easeOut", "easeInOut"], opacity: { delay, duration: 0.1 } }}
      whileHover={{ y: -8, transition: spring.ui }}
    >
      {children}
    </motion.div>
  );
}

// Hero figures share one pixel size: one art pixel is 0.06 hero units.
const cells = (count: number) => `calc(var(--u) * ${(count * 0.06).toFixed(3)})`;

// A burst of pixel smoke at the rocket's base, for launch and landing.
function Smoke({ burst }: { burst: number }) {
  if (!burst) return null;
  return (
    <span key={burst} aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2">
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((side) => (
        <motion.span
          key={`${burst}-${side}`}
          className="absolute block size-2.5 bg-[#caf0f8]"
          initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.6 }}
          animate={{ x: side * 9, y: -6 - (4 - Math.abs(side)) * 3, opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: Math.abs(side) * 0.03 }}
        />
      ))}
    </span>
  );
}

function Word({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom">
      <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: ease.outExpo, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

// Kept clear of the headline (review: a star sat on a letter).
const SPARKLES = [
  { className: "left-[7%] top-[30%]", delay: 0 },
  { className: "left-[17%] top-[64%]", delay: 1.7 },
  { className: "right-[18%] top-[70%]", delay: 0.9 },
];

export function Hero({ dict }: { dict: Dictionary }) {
  const { reduced } = useMotionPolicy();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 20 });
  const leftX = useTransform(smoothX, (value) => value * -18);
  const rightX = useTransform(smoothX, (value) => value * 18);
  const stackY = useTransform(smoothY, (value) => value * -10);
  const [rocketScope, animateRocket] = useAnimate();
  const [decoScope, animateDeco] = useAnimate<HTMLDivElement>();
  const [launching, setLaunching] = useState(false);
  const [smoke, setSmoke] = useState(0);
  // Startled by the falling tower: the rocket rumbles in a puff of smoke, lifts off, and a
  // moment later comes back down on its thrusters and lands softly.
  const launch = useCallback(async () => {
    if (!rocketScope.current) return;
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    await wait(350);
    setLaunching(true);
    setSmoke((value) => value + 1);
    await wait(650);
    await animateRocket(rocketScope.current, { y: "-115vh" }, { duration: 1, ease: [0.5, 0, 0.9, 0.6] });
    await wait(1100);
    await animateRocket(rocketScope.current, { y: ["-70vh", "0vh"] }, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    setSmoke((value) => value + 1);
    await wait(250);
    setLaunching(false);
  }, [animateRocket, rocketScope]);
  // The tower hitting the ground outside the picture shakes the scene a little.
  const shake = useCallback(() => {
    if (decoScope.current) animateDeco(decoScope.current, { y: [0, 4, -3, 2, 0] }, { duration: 0.35 });
  }, [animateDeco, decoScope]);

  function handlePointer(event: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  const wordsA = dict.hero.headlineA.split(" ");
  const wordsB = dict.hero.headlineB.split(" ");
  const textDelay = 0.08;

  return (
    <section onPointerMove={handlePointer} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden [--u:clamp(26px,4.4vw,64px)]">
      {/* Sky: drifting pixel clouds and twinkling stars. */}
      <div aria-hidden="true" className="ambient pointer-events-none absolute inset-0 -z-10">
        {/* Deep-blue pixel clouds, opaque so they read as shapes, not haze. */}
        <div className="absolute top-[6%] animate-[cloud_95s_linear_infinite] [animation-delay:-30s]" style={{ width: cells(51), height: cells(18) }}>
          <PixelCloud className="size-full" />
        </div>
        <div className="absolute top-[62%] animate-[cloud_120s_linear_infinite] [animation-delay:-80s]" style={{ width: cells(51), height: cells(18) }}>
          <PixelCloud className="size-full" />
        </div>
        {SPARKLES.map((sparkle, index) => (
          <div key={index} className={`absolute ${sparkle.className}`} style={{ width: cells(13), height: cells(13) }}>
            <PixelSparkle className="size-full" delay={sparkle.delay} />
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-6 pb-[calc(var(--u)*6.4)] pt-24 text-center md:pb-[calc(var(--u)*5)]">
        <h1 className="text-display flex max-w-5xl flex-wrap items-center justify-center gap-x-[0.28em]">
          {wordsA.map((word, index) => (
            <Word key={`a-${index}`} delay={textDelay + index * 0.05}>
              {word}
            </Word>
          ))}
          <span className="inline-flex h-[0.62em] items-center px-[0.06em]" aria-hidden="true">
            <AnimatedPictogram mode="intro" idle delay={textDelay + 0.16} className="h-full w-auto" />
          </span>
          {wordsB.map((word, index) => (
            <Word key={`b-${index}`} delay={textDelay + 0.2 + index * 0.05}>
              {word}
            </Word>
          ))}
        </h1>

        <motion.p
          className="text-body-lg mt-6 max-w-2xl text-muted"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.3 }}
        >
          {dict.hero.subline}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.4 }}
        >
          <Button href={dict.pages.routes.contact}>{dict.hero.primaryCta}</Button>
          <Button href={`#${dict.anchors.services}`} variant="secondary">
            {dict.hero.secondaryCta}
          </Button>
        </motion.div>

        {/* Scroll cue: three pixel chevrons that light up in turn, as in the reference. */}
        <motion.a
          href={`#${dict.anchors.services}`}
          aria-label={dict.hero.secondaryCta}
          className="mt-14 flex flex-col items-center gap-0.5 p-3 text-ocean-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.slow, delay: 0.9 }}
        >
          {[0, 1, 2].map((index) => (
            <svg key={index} viewBox="0 0 7 4" className="ambient h-2 w-3.5 animate-scroll-cue" style={{ animationDelay: `${index * 0.2}s` }} aria-hidden="true">
              <path d="M0 0h1v1h1v1h1v1h1V2h1V1h1V0h1v1H6v1H5v1H4v1H3V3H2V2H1V1H0z" fill="currentColor" />
            </svg>
          ))}
        </motion.a>
      </div>

      {/* Falling blocks with pixel figures, framed like the reference but in ocean blues. */}
      <div ref={decoScope} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div className="absolute inset-y-0 left-0 w-1/2" style={{ x: leftX, y: stackY }}>
          <Stack blocks={LEFT} side="left" reduced={reduced} />
          <Sprite className="pointer-events-auto cursor-pointer" delay={1.45} style={{ left: "calc(var(--u) * 0.25)", bottom: "calc(var(--u) * 4)", width: cells(25), height: cells(35) }}>
            <PixelRobot className="size-full" waves watching />
          </Sprite>
          <Sprite className="pointer-events-auto" delay={1.55} style={{ left: "calc(var(--u) * 3.4)", bottom: "calc(var(--u) * 1)", width: cells(34), height: cells(24) }}>
            <PixelGamepad className="size-full" />
          </Sprite>
        </motion.div>
        <motion.div className="absolute inset-y-0 right-0 w-1/2" style={{ x: rightX, y: stackY }}>
          <Stack blocks={RIGHT} side="right" reduced={reduced} />
          <DroneScene reduced={reduced} onImpact={shake} onTopple={launch} />
          <Sprite className="pointer-events-auto" delay={1.6} style={{ right: "calc(var(--u) * 3.5)", bottom: "calc(var(--u) * 1.6)", width: cells(38), height: cells(32) }}>
            <PixelLaptop className="size-full" />
          </Sprite>
          <Sprite className="pointer-events-auto hidden sm:block" delay={1.3} style={{ right: "calc(var(--u) * 7.1)", bottom: "calc(var(--u) * 0.55)", width: cells(22), height: cells(35) }}>
            <div ref={rocketScope} className="size-full">
              <PixelRocket className="size-full" launching={launching} />
            </div>
            <Smoke burst={smoke} />
          </Sprite>
        </motion.div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line" />
    </section>
  );
}
