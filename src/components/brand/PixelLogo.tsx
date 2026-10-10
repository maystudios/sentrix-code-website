"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// The pictogram built from blocks with even, regular steps: the chevron and the x are
// drawn as diagonals of constant thickness instead of rasterising the vector shape.
// It assembles in a diagonal wave. Under the pointer the blocks rise out of the screen
// and rings of the wave run outward from it (owner's idea, round 4); the whole logo
// tilts toward the pointer. Clicking a block knocks it out and it flies back.

const ROWS = 21;
const COLUMNS = 44;
const THICK = 3;

type Cell = [column: number, row: number, part: 1 | 2];

function buildCells(): Cell[] {
  const cells = new Map<string, Cell>();
  const put = (column: number, row: number, part: 1 | 2) => {
    if (column >= 0 && column < COLUMNS && row >= 0 && row < ROWS) cells.set(`${column},${row}`, [column, row, part]);
  };
  // Chevron "<": two arms meeting at the left point (row 10).
  const mid = (ROWS - 1) / 2;
  for (let row = 0; row < ROWS; row++) {
    const x = Math.abs(row - mid);
    for (let t = 0; t < THICK; t++) put(x + t, row, 1);
  }
  // X: a full "\" stroke and a "/" stroke that passes under it with a one-block gap.
  // Slope of exactly one block per row gives perfectly even steps.
  const left = 21;
  const width = ROWS - 1;
  for (let row = 0; row < ROWS; row++) {
    const down = left + Math.round((row / (ROWS - 1)) * width);
    for (let t = 0; t < THICK; t++) put(down + t, row, 2);
    const up = left + Math.round(((ROWS - 1 - row) / (ROWS - 1)) * width);
    const crossing = Math.abs(up - down) <= THICK;
    if (!crossing) for (let t = 0; t < THICK; t++) put(up + t, row, 2);
  }
  return [...cells.values()];
}

const CELLS = buildCells();

const PART_COLOR: Record<number, string> = {
  1: "var(--color-ocean-500)",
  2: "var(--color-fg)",
};

// Wave shape, in cells and seconds.
const RING_SPEED = 26;
const RING_WIDTH = 2.2;
const RING_LIFE = 1.4;
const LIFT = 46;
const BULGE_RADIUS = 3.2;

type Ring = { x: number; y: number; born: number };

export function PixelLogo({ className = "" }: { className?: string }) {
  const { reduced } = useMotionPolicy();
  const [knocked, setKnocked] = useState<Set<string>>(new Set());
  const grid = useRef<HTMLDivElement>(null);
  const blocks = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const rings = useRef<Ring[]>([]);
  const lastRing = useRef<{ x: number; y: number; t: number } | null>(null);
  const frame = useRef(0);
  const tiltX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const run = () => {
    if (frame.current) return;
    const tick = () => {
      const now = performance.now() / 1000;
      rings.current = rings.current.filter((ring) => now - ring.born < RING_LIFE);
      const here = pointer.current;
      const active = rings.current.length > 0 || here !== null;
      CELLS.forEach(([column, row], index) => {
        const block = blocks.current[index];
        if (!block) return;
        let z = 0;
        if (here) {
          const d2 = (column - here.x) ** 2 + (row - here.y) ** 2;
          z += Math.exp(-d2 / (2 * BULGE_RADIUS ** 2));
        }
        for (const ring of rings.current) {
          const age = now - ring.born;
          const distance = Math.hypot(column - ring.x, row - ring.y);
          const offset = distance - age * RING_SPEED;
          z += 0.7 * Math.exp(-(offset * offset) / (2 * RING_WIDTH ** 2)) * (1 - age / RING_LIFE);
        }
        z = Math.min(1.4, z);
        block.style.transform = z > 0.01 ? `translateZ(${(z * LIFT).toFixed(1)}px) scale(${(1 + z * 0.18).toFixed(3)})` : "";
        block.style.filter = z > 0.05 ? `brightness(${(1 + z * 0.55).toFixed(2)})` : "";
      });
      frame.current = active ? requestAnimationFrame(tick) : 0;
    };
    frame.current = requestAnimationFrame(tick);
  };

  const toCells = (event: React.PointerEvent) => {
    const rect = grid.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((event.clientX - rect.left) / rect.width) * COLUMNS - 0.5,
      y: ((event.clientY - rect.top) / rect.height) * ROWS - 0.5,
      nx: (event.clientX - rect.left) / rect.width - 0.5,
      ny: (event.clientY - rect.top) / rect.height - 0.5,
    };
  };

  const onMove = (event: React.PointerEvent) => {
    if (reduced || event.pointerType === "touch") return;
    const at = toCells(event);
    if (!at) return;
    pointer.current = { x: at.x, y: at.y };
    tiltX.set(at.ny * -10);
    tiltY.set(at.nx * 14);
    // A new ring whenever the pointer has travelled a bit, so moving makes waves.
    const now = performance.now() / 1000;
    const last = lastRing.current;
    if (!last || Math.hypot(at.x - last.x, at.y - last.y) > 3.5 || now - last.t > 0.45) {
      rings.current.push({ x: at.x, y: at.y, born: now });
      lastRing.current = { x: at.x, y: at.y, t: now };
    }
    run();
  };

  const onLeave = () => {
    pointer.current = null;
    lastRing.current = null;
    tiltX.set(0);
    tiltY.set(0);
  };

  const knock = (key: string, event: React.PointerEvent) => {
    if (reduced || knocked.has(key)) return;
    const at = toCells(event);
    if (at) {
      // A strong ring from the click.
      rings.current.push({ x: at.x, y: at.y, born: performance.now() / 1000 }, { x: at.x, y: at.y, born: performance.now() / 1000 + 0.12 });
      run();
    }
    setKnocked((current) => new Set(current).add(key));
    window.setTimeout(() => {
      setKnocked((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }, 2200);
  };

  return (
    <div className={className} style={{ perspective: 900 }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        ref={grid}
        aria-hidden="true"
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          aspectRatio: `${COLUMNS} / ${ROWS}`,
          transformStyle: "preserve-3d",
          rotateX: tiltX,
          rotateY: tiltY,
        }}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      >
        {CELLS.map(([column, row, part], index) => {
          const key = `${column},${row}`;
          const out = knocked.has(key);
          return (
            <motion.span
              key={key}
              onPointerDown={(event) => knock(key, event)}
              style={{ gridColumn: column + 1, gridRow: row + 1, transformStyle: "preserve-3d" }}
              variants={{
                hidden: { opacity: 0, y: -24, scale: 0.4 },
                shown: { opacity: 1, y: 0, scale: 1, transition: { ...spring.playful, delay: (column + row) * 0.012 } },
              }}
              animate={out ? { y: 140, rotate: column % 2 ? 80 : -80, opacity: 0 } : undefined}
              transition={out ? { duration: 0.7, ease: "easeIn" } : spring.playful}
              className="m-[8%] block cursor-pointer"
            >
              <span
                ref={(element) => {
                  blocks.current[index] = element;
                }}
                className="block size-full"
                style={{ background: PART_COLOR[part] }}
              />
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
}
