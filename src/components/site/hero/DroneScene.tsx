"use client";

import { motion, useAnimate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PixelDrone } from "@/components/brand/PixelCharacters";
import { BlockShape, Dust, LiveBlock } from "./LiveBlock";
import { GRAVITY_PX, fallEase, fallSeconds, tumble, type TumblePlan } from "./physics";

// The delivery drone and the right tower (owner's direction, rounds 4–5).
// The drone flies in from outside the picture with a flat block between the prongs of its
// claw (prongs in front, block behind), drops it and flies out to fetch the next one.
// Blocks fall with gravity, straighten from a small swing and land flush with a squash
// that wobbles out; the stack below takes the jolt. The third block lands too far right:
// it tips over the edge at once, and its push brings the stack down piece by piece, each
// with its own pivot, flight and spin, out of the picture to the right. New tower blocks
// drop in from above and the round starts again. Sizes in hero units (--u); the drone uses
// 0.05 u per art pixel.

const S = 0.05;
const BLOCK = 18 * S;
const TOWER = { w: 2, h: 4 };
const STACK_X = 1.3; // block centre, from the right edge of the picture
const THIRD_X = STACK_X - 0.62; // centre of the third block: past the edge of the one below
const DRONE = { w: 60 * S, h: 57 * S, blockLeft: 20 * S };
const HOVER = TOWER.h + 2 * BLOCK + 1.4; // drone bottom (= held block bottom) while hovering
const BLOCK_COLORS = ["var(--color-ocean-300)", "var(--color-ocean-500)", "var(--color-ocean-100)"];
const TOWER_COLORS = ["var(--color-ocean-900)", "var(--color-ocean-700)"];
const u = (value: number) => `calc(var(--u) * ${value.toFixed(3)})`;

type Drop = { id: number; level: number; centre: number };

function FlatBlock({ color }: { color: string }) {
  return <BlockShape shape="square" color={color} />;
}

// One delivered block: released with a small swing, falls with gravity, straightens and
// lands flush with a jelly squash and dust.
function DroppedBlock({ drop, onLand, register }: { drop: Drop; onLand: (drop: Drop) => void; register: (id: number, element: HTMLElement | null) => void }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const body = useRef<HTMLDivElement>(null);
  const [dust, setDust] = useState(0);
  useEffect(() => {
    register(drop.id, scope.current);
    return () => register(drop.id, null);
  }, [register, drop.id, scope]);
  useEffect(() => {
    if (!scope.current) return;
    const element = scope.current;
    const unit = element.offsetWidth / BLOCK;
    const fall = (HOVER - (TOWER.h + drop.level * BLOCK)) * unit;
    const seconds = fallSeconds(fall);
    const swing = drop.level % 2 ? 7 : -6;
    let cancelled = false;
    (async () => {
      await Promise.all([
        animate(element, { y: [-fall, 0] }, { duration: seconds, ease: fallEase }),
        animate(element, { rotate: [swing, -swing * 0.4, 0] }, { duration: seconds, times: [0, 0.6, 1], ease: ["easeInOut", "easeOut"] }),
      ]);
      if (cancelled || !body.current) return;
      setDust((value) => value + 1);
      onLand(drop);
      await animate(body.current, { scaleY: [0.72, 1], scaleX: [1.18, 1] }, { type: "spring", stiffness: 520, damping: 9 });
    })();
    return () => {
      cancelled = true;
    };
    // The drop plays once, when the block is released.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.div
      ref={scope}
      className="absolute"
      style={{ bottom: u(TOWER.h + drop.level * BLOCK), right: u(drop.centre - BLOCK / 2), width: u(BLOCK), height: u(BLOCK), zIndex: drop.level + 2 }}
      initial={{ y: "-200vh" }}
    >
      <div ref={body} className="size-full" style={{ transformOrigin: "50% 100%" }}>
        <FlatBlock color={BLOCK_COLORS[drop.level % BLOCK_COLORS.length]} />
      </div>
      <Dust burst={dust} spread={0.8} />
    </motion.div>
  );
}

export function DroneScene({ reduced, onImpact, onTopple }: { reduced: boolean; onImpact: () => void; onTopple: () => void }) {
  const [droneScope, animateDrone] = useAnimate<HTMLDivElement>();
  const [towerScope, animateTower] = useAnimate<HTMLDivElement>();
  const unitRef = useRef<HTMLSpanElement>(null);
  const [carrying, setCarrying] = useState(true);
  const [open, setOpen] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [round, setRound] = useState(0);
  const [crumbs, setCrumbs] = useState(0);
  const counter = useRef(0);
  const pieces = useRef(new Map<string, HTMLElement>());
  const jolts = useRef(new Map<string, () => void>());
  const landed = useRef<() => void>(() => {});
  const nextColor = BLOCK_COLORS[drops.length % BLOCK_COLORS.length];

  const registerPiece = useCallback((key: string, element: HTMLElement | null) => {
    if (element) pieces.current.set(key, element);
    else pieces.current.delete(key);
  }, []);

  // A landing jolts what it lands on: the top tower block or the block below.
  const onLand = useCallback(
    (drop: Drop) => {
      (drop.level === 0 ? jolts.current.get("tower-1") : undefined)?.();
      if (drop.level > 0) {
        const below = pieces.current.get(`drop-${drop.level - 1}`);
        if (below) animateTower(below.firstElementChild as HTMLElement, { scaleY: [0.92, 1] }, { type: "spring", stiffness: 520, damping: 11 });
      }
      landed.current();
    },
    [animateTower],
  );

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const unit = () => unitRef.current?.offsetWidth ?? 48;
    const outside = () => window.innerWidth * 0.5;
    const landing = () => new Promise<void>((resolve) => (landed.current = resolve));

    const flyOut = () =>
      Promise.all([
        animateDrone(droneScope.current, { x: outside() }, { duration: 1.05, ease: [0.7, 0, 0.84, 0] }),
        animateDrone(droneScope.current, { rotate: [0, -12, -12] }, { duration: 1.05, times: [0, 0.3, 1] }),
      ]);

    // The stack comes down: every piece tips over its own edge and flies with gravity and
    // spin. Frame: origin at the tower's bottom-right corner, pixels, y down.
    const topple = async () => {
      const px = unit();
      const b = BLOCK * px;
      const plans: [string, TumblePlan][] = [
        // The third block, already past the edge, goes first.
        ["drop-2", { centre: { x: -THIRD_X * px, y: -(TOWER.h * px + 2.5 * b) }, pivot: { x: -(STACK_X * px - b / 2), y: -(TOWER.h * px + 2 * b) }, start: 0, alpha: 26, release: 0.85, spin: 2 }],
        // Its push tips the upper tower block, with the two delivered blocks riding on it.
        ["tower-1", { centre: { x: -px, y: -3 * px }, pivot: { x: 0, y: -2 * px }, start: 0.14, alpha: 11, release: 0.7, kick: { x: 60, y: 0 } }],
        ["drop-1", { centre: { x: -STACK_X * px, y: -(TOWER.h * px + 1.5 * b) }, pivot: { x: 0, y: -2 * px }, start: 0.14, alpha: 11, release: 0.7, spin: 3, kick: { x: 160, y: -120 } }],
        ["drop-0", { centre: { x: -STACK_X * px, y: -(TOWER.h * px + 0.5 * b) }, pivot: { x: 0, y: -2 * px }, start: 0.14, alpha: 11, release: 0.7, spin: -1.5, kick: { x: 90, y: -40 } }],
        // Last, the base block tips off the floor's edge.
        ["tower-0", { centre: { x: -px, y: -px }, pivot: { x: 0, y: 0 }, start: 0.36, alpha: 8, release: 0.95 }],
      ];
      // Grit flies where the pieces scrape over their edges; the crash outside the picture
      // shakes the scene and startles the rocket.
      setCrumbs((value) => value + 1);
      window.setTimeout(() => setCrumbs((value) => value + 1), 380);
      window.setTimeout(() => {
        if (cancelled) return;
        onImpact();
        onTopple();
      }, 620);
      const runs = plans.map(([key, plan]) => {
        const element = pieces.current.get(key);
        if (!element) return Promise.resolve();
        const path = tumble(plan, 1.5, GRAVITY_PX);
        return animateTower(element, { x: path.x, y: path.y, rotate: path.rotate }, { duration: path.duration, times: path.times, ease: "linear" });
      });
      await Promise.all(runs);
    };

    const run = async () => {
      await wait(1700);
      while (!cancelled) {
        for (let level = 0; level < 3 && !cancelled; level++) {
          const centre = level === 2 ? THIRD_X : STACK_X;
          setCarrying(true);
          setOpen(false);
          // In from the right: nose down while flying, a lean back to brake, then level.
          await Promise.all([
            animateDrone(droneScope.current, { x: [outside(), (STACK_X - centre) * unit()] }, { duration: 1.6, ease: [0.16, 1, 0.3, 1] }),
            animateDrone(droneScope.current, { rotate: [-10, -10, 6, -2, 0] }, { duration: 1.75, times: [0, 0.48, 0.72, 0.88, 1] }),
          ]);
          if (cancelled) return;
          await wait(380);
          // Release: the prongs spread, the block drops, the drone bobs up as the weight goes.
          setOpen(true);
          setCarrying(false);
          counter.current += 1;
          const land = landing();
          setDrops((current) => [...current, { id: counter.current, level, centre }]);
          animateDrone(droneScope.current, { y: [0, -12, 2, 0] }, { duration: 0.7, ease: "easeOut" });
          await land;
          if (cancelled) return;
          if (level === 2) {
            // Too far right: no pause, it goes over the edge and takes the stack with it.
            const away = (async () => {
              await wait(200);
              setOpen(false);
              await flyOut();
            })();
            await topple();
            await away;
            break;
          }
          await wait(240);
          setOpen(false);
          await flyOut();
          await wait(450);
        }
        if (cancelled) return;
        await wait(250);
        // Rebuild: clear the pieces and let new tower blocks drop in from above.
        await animateTower(towerScope.current, { opacity: 0 }, { duration: 0 });
        setDrops([]);
        setRound((value) => value + 1);
        await animateTower(towerScope.current, { opacity: 1 }, { duration: 0 });
        await wait(1900);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [reduced, onImpact, onTopple, animateDrone, droneScope, animateTower, towerScope]);

  return (
    <>
      <span ref={unitRef} aria-hidden="true" className="pointer-events-none absolute w-[var(--u)]" />

      <div ref={towerScope} aria-hidden="true" className="absolute bottom-0 right-0" style={{ width: u(TOWER.w), height: u(TOWER.h) }}>
        {[0, 1].map((index) => (
          <div key={`${round}-${index}`} ref={(element) => registerPiece(`tower-${index}`, element)} className="absolute right-0" style={{ bottom: u(index * 2), width: u(2), height: u(2) }}>
            <LiveBlock
              style={{ inset: 0 }}
              delay={round === 0 ? 0.22 + index * 0.32 : index * 0.32}
              tilt={index ? -9 : 11}
              reduced={reduced}
              registerJolt={(jolt) => jolts.current.set(`tower-${index}`, jolt)}
              onLand={index === 1 ? () => jolts.current.get("tower-0")?.() : undefined}
            >
              <BlockShape shape="square" color={TOWER_COLORS[index]} />
            </LiveBlock>
          </div>
        ))}
        {/* Grit at the edges the pieces tip over. */}
        <span className="pointer-events-none absolute right-0" style={{ bottom: u(TOWER.h), width: u(BLOCK), height: 0 }}>
          <Dust burst={crumbs} spread={1.3} />
        </span>
        <span className="pointer-events-none absolute right-0" style={{ bottom: u(2), width: u(0.6), height: 0 }}>
          <Dust burst={crumbs > 1 ? crumbs - 1 : 0} spread={1.5} />
        </span>
        {drops.map((drop) => (
          <DroppedBlock key={drop.id} drop={drop} onLand={onLand} register={(_, element) => registerPiece(`drop-${drop.level}`, element)} />
        ))}
      </div>

      {/* The drone, hovering over the stack when x is 0. The block hangs between the drone's
          body (behind) and the claw's prongs (in front). */}
      <motion.div
        ref={droneScope}
        aria-hidden="true"
        className="absolute z-10"
        style={{
          right: u(STACK_X - (DRONE.w - DRONE.blockLeft - BLOCK / 2)),
          bottom: u(HOVER),
          width: u(DRONE.w),
          height: u(DRONE.h),
          x: reduced ? 0 : "60vw",
        }}
      >
        <div className="ambient relative size-full animate-bob">
          <PixelDrone className="absolute inset-0" open={open} part="back" />
          {carrying && (
            <motion.span
              className="absolute bottom-0"
              style={{ left: u(DRONE.blockLeft), width: u(BLOCK), height: u(BLOCK), transformOrigin: "50% 0%" }}
              animate={reduced ? undefined : { rotate: [-3, 3, -3] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <FlatBlock color={nextColor} />
            </motion.span>
          )}
          <PixelDrone className="absolute inset-0" open={open} part="front" />
        </div>
      </motion.div>
    </>
  );
}
