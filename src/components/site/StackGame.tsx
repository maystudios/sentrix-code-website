"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { Mosaic } from "@/components/ui/Mosaic";

// A tiny playable game in the game-development panel: a block slides over the tower,
// click, tap or press Space to drop it; whatever overhangs is cut off. A studio that
// builds games shows one instead of describing one.

const WIDTH = 100; // game units across the panel
const BLOCK_H = 7;
const START_W = 44;
const COLORS = ["#0096c7", "#00b4d8", "#48cae4", "#90e0ef", "#48cae4", "#00b4d8"];

type Block = { x: number; w: number };
type Phase = "ready" | "playing" | "over";

const COPY: Record<Locale, { start: string; again: string; score: string; best: string; label: string; hint: string }> = {
  de: { start: "Klicken zum Starten", again: "Nochmal", score: "Höhe", best: "Rekord", label: "Mini-Spiel: Blöcke stapeln", hint: "Klicken, tippen oder Leertaste" },
  en: { start: "Click to start", again: "Play again", score: "Height", best: "Best", label: "Mini game: stack the blocks", hint: "Click, tap or press Space" },
};

export function StackGame({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const { reduced } = useMotionPolicy();
  const [phase, setPhase] = useState<Phase>("ready");
  const [stack, setStack] = useState<Block[]>([{ x: (WIDTH - START_W) / 2, w: START_W }]);
  const [moving, setMoving] = useState<Block>({ x: 0, w: START_W });
  const [cut, setCut] = useState<{ x: number; w: number; level: number; id: number } | null>(null);
  const [best, setBest] = useState(0);
  const [popup, setPopup] = useState<{ text: string; id: number } | null>(null);
  const direction = useRef(1);
  const frame = useRef(0);
  const last = useRef(0);

  const level = stack.length;
  const speed = 38 + Math.min(level, 14) * 4; // units per second

  // Slide the current block back and forth.
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = (time: number) => {
      const delta = last.current ? Math.min(0.05, (time - last.current) / 1000) : 0;
      last.current = time;
      setMoving((block) => {
        let x = block.x + direction.current * speed * delta;
        if (x + block.w > WIDTH) {
          x = WIDTH - block.w;
          direction.current = -1;
        } else if (x < 0) {
          x = 0;
          direction.current = 1;
        }
        return { ...block, x };
      });
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      last.current = 0;
    };
  }, [phase, speed]);

  const drop = useCallback(() => {
    if (phase === "ready" || phase === "over") {
      setStack([{ x: (WIDTH - START_W) / 2, w: START_W }]);
      setMoving({ x: 0, w: START_W });
      direction.current = 1;
      setCut(null);
      setPhase("playing");
      return;
    }
    const top = stack[stack.length - 1];
    const left = Math.max(top.x, moving.x);
    const right = Math.min(top.x + top.w, moving.x + moving.w);
    const overlap = right - left;
    if (overlap <= 0.5) {
      setCut({ x: moving.x, w: moving.w, level, id: Date.now() });
      setBest((value) => Math.max(value, level - 1));
      setPhase("over");
      return;
    }
    // Perfect drops (within 1.2 units) snap and keep the width: a small reward.
    const perfect = Math.abs(moving.x - top.x) < 1.2;
    const placed = perfect ? { x: top.x, w: top.w } : { x: left, w: overlap };
    setPopup({ text: perfect ? (locale === "de" ? "Perfekt!" : "Perfect!") : "+1", id: Date.now() });
    if (!perfect) {
      const offX = moving.x < top.x ? moving.x : right;
      setCut({ x: offX, w: moving.w - overlap, level, id: Date.now() });
    }
    setStack((current) => [...current, placed]);
    setMoving({ x: direction.current > 0 ? 0 : WIDTH - placed.w, w: placed.w });
  }, [phase, stack, moving, level, locale]);

  // Show at most the top 9 levels; the tower scrolls down as it grows.
  const visibleFrom = Math.max(0, level - 8);
  const y = (index: number) => 100 - 12 - (index - visibleFrom + 1) * BLOCK_H;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={copy.label}
      onPointerDown={(event) => {
        event.preventDefault();
        drop();
      }}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          drop();
        }
      }}
      className="relative aspect-video cursor-pointer select-none overflow-hidden bg-ocean-950 outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
    >
      <Mosaic className="absolute inset-0" tile={32} from={0} to={1} seed={7} twinkle={false} />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(202,240,248,0.18)_1px,transparent_1px)] bg-[size:18px_18px]" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" shapeRendering="crispEdges" aria-hidden="true">
        {/* ground */}
        <rect x={0} y={88} width={100} height={12} fill="#03045e" />
        {stack.slice(visibleFrom).map((block, index) => (
          <motion.g key={visibleFrom + index} initial={false} animate={{ y: y(visibleFrom + index) }} transition={reduced ? { duration: 0 } : spring.ui}>
            <rect x={block.x} width={block.w} height={BLOCK_H - 0.4} fill={COLORS[(visibleFrom + index) % COLORS.length]} />
            <rect x={block.x} width={block.w} height={1} fill="#ffffff" opacity={0.35} />
            <rect x={block.x} y={BLOCK_H - 1.6} width={block.w} height={1.2} fill="#03045e" opacity={0.3} />
          </motion.g>
        ))}
        {phase === "playing" && (
          <g>
            <rect x={moving.x} y={y(level)} width={moving.w} height={BLOCK_H - 0.4} fill={COLORS[level % COLORS.length]} />
            <rect x={moving.x} y={y(level)} width={moving.w} height={1} fill="#ffffff" opacity={0.5} />
          </g>
        )}
      </svg>
      {/* The cut-off piece falls away. */}
      <AnimatePresence>
        {cut && (
          <motion.span
            key={cut.id}
            aria-hidden="true"
            className="absolute block"
            style={{
              left: `${cut.x}%`,
              width: `${cut.w}%`,
              top: `${y(cut.level)}%`,
              height: `${BLOCK_H - 0.4}%`,
              background: COLORS[cut.level % COLORS.length],
            }}
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={reduced ? { opacity: 0 } : { y: 260, rotate: cut.x > 50 ? 40 : -40, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {popup && phase === "playing" && (
          <motion.span
            key={popup.id}
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 font-mono text-sm font-medium ${popup.text === "+1" ? "text-ocean-100" : "text-[#ffb703]"}`}
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], y: -18, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {popup.text}
          </motion.span>
        )}
      </AnimatePresence>
      <div className="pointer-events-none absolute left-3 top-3 flex gap-2 font-mono text-[11px]">
        <span className="rounded-[4px] bg-base/85 px-2 py-1">
          {copy.score} {level - 1}
        </span>
        {best > 0 && (
          <span className="rounded-[4px] bg-base/85 px-2 py-1 text-ocean-300">
            {copy.best} {best}
          </span>
        )}
      </div>

      <AnimatePresence>
        {phase !== "playing" && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="rounded-[var(--radius-control)] bg-ocean-700 px-4 py-2 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
              animate={reduced ? undefined : { scale: [1, 1.05, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              {phase === "over" ? copy.again : copy.start}
            </motion.span>
            <span className="text-xs text-fg/70">{copy.hint}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
