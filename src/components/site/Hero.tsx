"use client";

import { AnimatePresence, motion, useAnimate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from "react";
import type { Dictionary } from "@/content/types";
import { asset } from "@/lib/asset";
import { duration, ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { AnimatedPictogram } from "@/components/brand/AnimatedPictogram";
import { PixelRobot, PixelRocket } from "@/components/brand/PixelCharacters";
import { CHEVRON_PATH, X_PATH } from "@/components/brand/paths";
import { Button } from "@/components/ui/Button";

type Shape = "square" | "diamond" | "chevron" | "x";

type Block = {
  shape: Shape;
  // Position and size in hero units (--u), measured from the outer edge and the floor.
  edge: number;
  floor: number;
  w: number;
  h: number;
  color: string;
  delay: number;
  tilt: number;
};

const LEFT: Block[] = [
  { shape: "square", edge: 0, floor: 0, w: 2, h: 2, color: "var(--color-ocean-700)", delay: 0.15, tilt: -14 },
  { shape: "square", edge: 0, floor: 2, w: 2, h: 2, color: "var(--color-ocean-500)", delay: 0.45, tilt: 10 },
  { shape: "diamond", edge: 2.25, floor: 0.12, w: 1.3, h: 1.3, color: "var(--color-ocean-400)", delay: 0.3, tilt: 30 },
  { shape: "square", edge: 3.75, floor: 0, w: 1, h: 1, color: "var(--color-ocean-300)", delay: 0.6, tilt: -20 },
  { shape: "chevron", edge: 5, floor: 0, w: 1.9, h: 1, color: "var(--color-ocean-600)", delay: 0.72, tilt: 18 },
];

const RIGHT: Block[] = [
  { shape: "square", edge: 0, floor: 0, w: 2, h: 2, color: "var(--color-ocean-900)", delay: 0.22, tilt: 12 },
  { shape: "square", edge: 0, floor: 2, w: 2, h: 2, color: "var(--color-ocean-700)", delay: 0.52, tilt: -10 },
  { shape: "diamond", edge: 2.3, floor: 0.12, w: 1.3, h: 1.3, color: "var(--color-ocean-500)", delay: 0.38, tilt: -30 },
  { shape: "square", edge: 3.8, floor: 0, w: 1.6, h: 1.6, color: "var(--color-ocean-600)", delay: 0.64, tilt: 16 },
  { shape: "x", edge: 5.75, floor: 0, w: 1.2, h: 1.2, color: "var(--color-ocean-400)", delay: 0.82, tilt: -40 },
];

const DROP_COLORS = ["var(--color-ocean-300)", "var(--color-ocean-500)", "var(--color-ocean-100)"];

function BlockShape({ shape, color }: { shape: Shape; color: string }) {
  if (shape === "chevron" || shape === "x") {
    return (
      <svg viewBox={shape === "chevron" ? "0 0 110 140" : "100 0 130 140"} className="size-full" aria-hidden="true">
        <path d={shape === "chevron" ? CHEVRON_PATH : X_PATH} fill={color} />
      </svg>
    );
  }
  return (
    <span
      className={`block size-full ${shape === "diamond" ? "rotate-45 scale-[0.72]" : ""}`}
      style={{ background: color, boxShadow: "inset 0 3px 0 rgba(255,255,255,0.22), inset 0 -4px 0 rgba(0,0,0,0.28)" }}
    />
  );
}

// Blocks fall in, then they can be grabbed, thrown and spring back into place.
function Stack({ blocks, side, reduced }: { blocks: Block[]; side: "left" | "right"; reduced: boolean }) {
  return (
    <>
      {blocks.map((block, index) => (
        <motion.div
          key={index}
          aria-hidden="true"
          className="pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing"
          style={{
            [side]: `calc(var(--u) * ${block.edge})`,
            bottom: `calc(var(--u) * ${block.floor})`,
            width: `calc(var(--u) * ${block.w})`,
            height: `calc(var(--u) * ${block.h})`,
          }}
          initial={{ y: "-120vh", rotate: block.tilt }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ ...spring.playful, delay: block.delay }}
          drag={!reduced}
          dragSnapToOrigin
          dragElastic={0.55}
          dragTransition={{ bounceStiffness: 320, bounceDamping: 12 }}
          whileHover={{ y: -6, transition: spring.ui }}
          whileDrag={{ scale: 1.08, rotate: side === "left" ? -8 : 8, zIndex: 20 }}
          whileTap={{ scale: 0.94 }}
        >
          <BlockShape shape={block.shape} color={block.color} />
        </motion.div>
      ))}
    </>
  );
}

function Sprite({ children, className, delay, style }: { children: ReactNode; className?: string; delay: number; style: React.CSSProperties }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute ${className ?? ""}`}
      style={style}
      initial={{ opacity: 0, y: -40, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring.playful, delay }}
      whileHover={{ y: -10, rotate: -4, transition: spring.ui }}
    >
      {children}
    </motion.div>
  );
}

function Img({ src, className = "" }: { src: string; className?: string }) {
  return <img src={asset(src)} alt="" draggable={false} className={`size-full object-contain object-bottom ${className}`} />;
}

// The drone sways above the right tower, opens its claw and drops blocks that bounce onto
// the tower; three blocks later they pop and the game starts over (the reference's claw).
function DroneDrop({ reduced, slotRef, onTowerDone }: { reduced: boolean; slotRef: RefObject<HTMLDivElement | null>; onTowerDone: () => void }) {
  const drone = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<{ id: number; distance: number }[]>([]);
  const [popping, setPopping] = useState(false);
  const [dust, setDust] = useState<{ id: number; level: number }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const step = (count: number) => {
      timer = setTimeout(() => {
        if (count >= 3) {
          onTowerDone();
          setPopping(true);
          timer = setTimeout(() => {
            setDrops([]);
            setPopping(false);
            step(0);
          }, 2600);
          return;
        }
        const droneBox = drone.current?.getBoundingClientRect();
        const slotBox = slotRef.current?.getBoundingClientRect();
        if (!droneBox || !slotBox) return step(count);
        const cube = slotBox.width;
        const distance = slotBox.top - cube * (count + 1) - (droneBox.bottom - cube * 0.2);
        counter.current += 1;
        setDrops((current) => [...current, { id: counter.current, distance }]);
        step(count + 1);
      }, count === 0 ? 1800 : 3000 + Math.random() * 1400);
    };
    step(0);
    return () => clearTimeout(timer);
  }, [reduced, slotRef, onTowerDone]);

  return (
    <>
      <motion.div
        ref={drone}
        aria-hidden="true"
        className="absolute right-[calc(var(--u)*0.35)] top-16 z-10 w-[calc(var(--u)*1.3)] md:top-20"
        initial={{ opacity: 0, y: -90 }}
        animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -6, 0], x: [0, -10, 8, 0] }}
        transition={reduced ? { duration: 0 } : { y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }, x: { duration: 6, repeat: Infinity, ease: "easeInOut" }, opacity: { delay: 0.6 } }}
      >
        <Img src="/images/sprites/drone.webp" />
      </motion.div>
      {/* Landing slots on top of the right tower. */}
      <div aria-hidden="true" className="absolute bottom-[calc(var(--u)*4)] right-[calc(var(--u)*0.5)] w-[calc(var(--u)*1)]">
        <AnimatePresence>
          {drops.map((drop, index) => (
            <motion.span
              key={drop.id}
              className="absolute left-0 block aspect-square w-full"
              style={{
                bottom: `calc(var(--u) * ${index})`,
                background: DROP_COLORS[index % DROP_COLORS.length],
                boxShadow: "inset 0 3px 0 rgba(255,255,255,0.3), inset 0 -4px 0 rgba(0,0,0,0.25)",
              }}
              initial={{ y: -drop.distance, rotate: index % 2 === 0 ? -12 : 12 }}
              animate={popping ? { scale: 0, rotate: 45, transition: { delay: (2 - index) * 0.08, duration: 0.25 } } : { y: 0, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 14, mass: 1.1 }}
              onAnimationComplete={() => {
                if (!popping) setDust((current) => [...current.slice(-6), { id: drop.id, level: index }]);
              }}
            />
          ))}
        </AnimatePresence>
        {/* Pixel dust where a block lands. */}
        {dust.map((puff) =>
          [-1, 1].map((side) => (
            <motion.span
              key={`${puff.id}-${side}`}
              className="absolute block size-1.5 bg-ocean-100"
              style={{ bottom: `calc(var(--u) * ${puff.level})`, left: side < 0 ? "-6%" : "100%" }}
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, x: side * 14, y: -10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          )),
        )}
        <AnimatePresence>
          {popping && (
            <motion.img
              src={asset("/images/sprites/sparkle-1.webp")}
              alt=""
              className="absolute -left-1/2 bottom-[calc(var(--u)*1)] w-[200%]"
              initial={{ scale: 0, rotate: -30, opacity: 1 }}
              animate={{ scale: 1.2, rotate: 20, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: ease.outExpo }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
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

const SPARKLES = [
  { src: "/images/sprites/sparkle-2.webp", className: "left-[8%] top-[34%] w-6", delay: "0s" },
  { src: "/images/sprites/sparkle-3.webp", className: "left-[22%] top-[60%] w-4", delay: "1.7s" },
  { src: "/images/sprites/sparkle-4.webp", className: "right-[24%] top-[42%] w-5", delay: "0.9s" },
  { src: "/images/sprites/sparkle-2.webp", className: "right-[9%] top-[62%] w-4", delay: "2.4s" },
  { src: "/images/sprites/sparkle-5.webp", className: "left-[38%] top-[18%] w-3", delay: "3.1s" },
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
  const slot = useRef<HTMLDivElement>(null);
  const [rocketScope, animateRocket] = useAnimate();
  const [launching, setLaunching] = useState(false);
  const launch = useCallback(async () => {
    if (!rocketScope.current) return;
    setLaunching(true);
    await animateRocket(rocketScope.current, { y: [0, 3, -4, 0] }, { duration: 0.6 });
    await animateRocket(rocketScope.current, { y: "-115vh" }, { duration: 1.1, ease: [0.5, 0, 0.9, 0.6] });
    setLaunching(false);
    await animateRocket(rocketScope.current, { y: 0 }, { type: "spring", stiffness: 70, damping: 14, delay: 0.9 });
  }, [animateRocket, rocketScope]);

  function handlePointer(event: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  const wordsA = dict.hero.headlineA.split(" ");
  const wordsB = dict.hero.headlineB.split(" ");
  const textDelay = 0.25;

  return (
    <section onPointerMove={handlePointer} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden [--u:clamp(26px,4.4vw,64px)]">
      {/* Sky: arcs drawn on load, clouds drifting, sparkles, a satellite passing now and then. */}
      <svg aria-hidden="true" className="absolute -left-24 -top-40 -z-10 size-[640px] text-line" fill="none">
        {[300, 220].map((radius, index) => (
          <motion.circle
            key={radius}
            cx="320"
            cy="320"
            r={radius}
            stroke="currentColor"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, ease: ease.outExpo, delay: 0.2 + index * 0.25 }}
          />
        ))}
      </svg>
      <div aria-hidden="true" className="ambient pointer-events-none absolute inset-0 -z-10">
        <img src={asset("/images/sprites/cloud-2.webp")} alt="" className="absolute top-[14%] w-28 animate-[cloud_95s_linear_infinite] opacity-25 [animation-delay:-30s] md:w-40" />
        <img src={asset("/images/sprites/cloud-3.webp")} alt="" className="absolute top-[30%] w-16 animate-[cloud_70s_linear_infinite] opacity-20 [animation-delay:-50s] md:w-24" />
        <img src={asset("/images/sprites/cloud-4.webp")} alt="" className="absolute top-[8%] w-14 animate-[cloud_120s_linear_infinite] opacity-15 [animation-delay:-5s] md:w-20" />
        {SPARKLES.map((sparkle, index) => (
          <img key={index} src={asset(sparkle.src)} alt="" className={`absolute animate-twinkle ${sparkle.className}`} style={{ animationDelay: sparkle.delay }} />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-6 pb-[calc(var(--u)*6.4)] pt-24 text-center md:pb-[calc(var(--u)*5)]">
        <h1 className="text-display flex max-w-5xl flex-wrap items-center justify-center gap-x-[0.28em]">
          {wordsA.map((word, index) => (
            <Word key={`a-${index}`} delay={textDelay + index * 0.08}>
              {word}
            </Word>
          ))}
          <span className="inline-flex h-[0.62em] items-center px-[0.06em]" aria-hidden="true">
            <AnimatedPictogram mode="intro" idle delay={textDelay + 0.3} className="h-full w-auto" />
          </span>
          {wordsB.map((word, index) => (
            <Word key={`b-${index}`} delay={textDelay + 0.36 + index * 0.08}>
              {word}
            </Word>
          ))}
        </h1>

        <motion.p
          className="text-body-lg mt-6 max-w-2xl text-muted"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.55 }}
        >
          {dict.hero.subline}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.68 }}
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
          transition={{ duration: duration.slow, delay: 1.1 }}
        >
          {[0, 1, 2].map((index) => (
            <svg key={index} viewBox="0 0 7 4" className="ambient h-2 w-3.5 animate-scroll-cue" style={{ animationDelay: `${index * 0.2}s` }} aria-hidden="true">
              <path d="M0 0h1v1h1v1h1v1h1V2h1V1h1V0h1v1H6v1H5v1H4v1H3V3H2V2H1V1H0z" fill="currentColor" />
            </svg>
          ))}
        </motion.a>
      </div>

      {/* Falling blocks with pixel figures, framed like the reference but in ocean blues. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div className="absolute inset-y-0 left-0 w-1/2" style={{ x: leftX, y: stackY }}>
          <Stack blocks={LEFT} side="left" reduced={reduced} />
          <Sprite className="pointer-events-auto cursor-pointer" delay={0.7} style={{ left: "calc(var(--u) * 0.25)", bottom: "calc(var(--u) * 4)", width: "calc(var(--u) * 1.5)", height: "calc(var(--u) * 2.28)" }}>
            <PixelRobot className="size-full" waves watching />
          </Sprite>
          <Sprite className="pointer-events-auto" delay={0.78} style={{ left: "calc(var(--u) * 3.55)", bottom: "calc(var(--u) * 0.98)", width: "calc(var(--u) * 1.4)", height: "calc(var(--u) * 1.1)" }}>
            <Img src="/images/sprites/gamepad.webp" className="ambient animate-bob" />
          </Sprite>
        </motion.div>
        <motion.div className="absolute inset-y-0 right-0 w-1/2" style={{ x: rightX, y: stackY }}>
          <Stack blocks={RIGHT} side="right" reduced={reduced} />
          <div ref={slot} aria-hidden="true" className="absolute bottom-[calc(var(--u)*4)] right-[calc(var(--u)*0.5)] h-px w-[calc(var(--u)*1)]" />
          <DroneDrop reduced={reduced} slotRef={slot} onTowerDone={launch} />
          <Sprite className="pointer-events-auto" delay={0.82} style={{ right: "calc(var(--u) * 3.85)", bottom: "calc(var(--u) * 1.55)", width: "calc(var(--u) * 1.5)", height: "calc(var(--u) * 1.5)" }}>
            <Img src="/images/sprites/laptop.webp" className="ambient animate-bob" />
          </Sprite>
          <Sprite className="pointer-events-auto hidden sm:block" delay={0.9} style={{ right: "calc(var(--u) * 7.15)", bottom: "calc(var(--u) * 0.55)", width: "calc(var(--u) * 1.3)", height: "calc(var(--u) * 2.05)" }}>
            <div ref={rocketScope} className="size-full">
              <PixelRocket className="size-full" launching={launching} />
            </div>
          </Sprite>
        </motion.div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line" />
    </section>
  );
}
