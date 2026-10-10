"use client";

import { motion, useInView } from "motion/react";
import { Fragment, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Dictionary } from "@/content/types";
import { ease } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Chip } from "./statement/Chip";
import { PER_ROW, ROW_SHIFT, buildStrings } from "./statement/layout";
import { StringField, restPath, type Geometry, type StringElements } from "./statement/strings";

// When a chip's nodes pop in: row by row, and left to right within a row.
const nodeDelay = (chip: number) => 0.22 + Math.floor(chip / PER_ROW) * 0.1 + (chip % PER_ROW) * 0.05;

// The statement over a brick grid of terms that hang in a web of strings. Strings draw in
// from the section edges, nodes pop, chips rise row by row. Strings can be plucked with
// the pointer; hovering a chip lifts it and sends light out along its strings.
export function Statement({ dict }: { dict: Dictionary }) {
  const { reduced } = useMotionPolicy();
  const chips = dict.statement.chips;
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const chipEls = useRef<(HTMLLIElement | null)[]>([]);
  const els = useRef<StringElements>({ paths: [], pulses: [], lifts: [], blinks: [] });
  const field = useRef<StringField | null>(null);
  const flashTimer = useRef(0);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const inView = useInView(listRef, { once: true, margin: "0px 0px -12% 0px" });
  const shown = reduced || inView;

  // Measure the chips relative to the section. ResizeObserver also reports once right
  // after observing, which gives the first measurement.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      const rects = chipEls.current.slice(0, chips.length).map((el) => {
        const rect = el?.getBoundingClientRect();
        return rect
          ? { left: rect.left - box.left, top: rect.top - box.top, right: rect.right - box.left, bottom: rect.bottom - box.top }
          : { left: 0, top: 0, right: 0, bottom: 0 };
      });
      setGeo({ width: box.width, height: box.height, chips: rects, strings: buildStrings(rects, box.width) });
    };
    const observer = new ResizeObserver(() => {
      if (!frame) frame = requestAnimationFrame(measure);
    });
    observer.observe(section);
    chipEls.current.slice(0, chips.length).forEach((el) => el && observer.observe(el));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [chips.length]);

  // The string field: pointer plucking, lift, pulses. Paused off screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (reduced || !section) return;
    const instance = new StringField(els.current);
    field.current = instance;
    const io = new IntersectionObserver(([entry]) => instance.setVisible(entry.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(section);
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = section.getBoundingClientRect();
      instance.pointer(event.clientX - box.left, event.clientY - box.top);
    };
    const onLeave = () => instance.pointerLeave();
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      instance.destroy();
      field.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    field.current?.setGeometry(geo);
  }, [geo, reduced]);

  // Ambient life starts once the entry has settled.
  useEffect(() => {
    if (reduced || !inView) return;
    const timer = window.setTimeout(() => field.current?.startAmbient(), 2400);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const enter = (chip: number) => (event: ReactPointerEvent) => {
    if (event.pointerType === "touch") return;
    setHovered(chip);
    field.current?.hover(chip, true);
  };
  const leave = (chip: number) => (event: ReactPointerEvent) => {
    if (event.pointerType === "touch") return;
    setHovered((current) => (current === chip ? null : current));
    field.current?.hover(chip, false);
  };
  // Touch has no hover: a tap lights the chip briefly instead.
  const down = (chip: number) => (event: ReactPointerEvent) => {
    field.current?.press(chip);
    if (event.pointerType !== "touch") return;
    window.clearTimeout(flashTimer.current);
    setHovered(chip);
    flashTimer.current = window.setTimeout(() => setHovered(null), 650);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-line bg-surface/40 py-24 md:py-32">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {geo?.strings.map((spec, index) => {
          const link = spec.aChip >= 0;
          const lit = hovered !== null && (spec.aChip === hovered || spec.bChip === hovered);
          // Edge strings arrive at their node just as it pops; links follow once both
          // nodes are there; strings across the grid draw first.
          const delay = link
            ? Math.max(nodeDelay(spec.aChip), nodeDelay(spec.bChip)) + 0.12
            : spec.bChip >= 0
              ? Math.max(0, nodeDelay(spec.bChip) - 0.3)
              : 0;
          return (
            <g key={index}>
              <motion.path
                ref={(el: SVGPathElement | null) => {
                  els.current.paths[index] = el;
                }}
                d={restPath(spec)}
                fill="none"
                strokeWidth={1}
                className={`transition-[stroke] duration-200 ${lit ? (link ? "stroke-ocean-400" : "stroke-ocean-700") : "stroke-line-strong"}`}
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={shown ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{
                  pathLength: { duration: link ? 0.45 : spec.bChip >= 0 ? 1.1 : 1.6, ease: ease.outExpo, delay },
                  opacity: { duration: 0.15, delay },
                }}
              />
              {!reduced && (
                <path
                  ref={(el) => {
                    els.current.pulses[index] = el;
                  }}
                  d={restPath(spec)}
                  pathLength={1}
                  fill="none"
                  strokeWidth={1.5}
                  strokeDasharray="0 3"
                  className="stroke-ocean-300"
                  style={{ opacity: 0 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div className="relative mx-auto max-w-[1280px] px-6 text-center">
        <RevealHeading text={dict.statement.title} className="text-h2-xl mx-auto max-w-3xl" />

        <ul ref={listRef} role="list" className="relative mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-6 md:mt-16 md:gap-x-10">
          {chips.map((chip, index) => (
            <Fragment key={chip.label}>
              <Chip
                label={chip.label}
                icon={chip.icon}
                muted={!!chip.muted}
                lit={hovered === index}
                shown={shown}
                reduced={reduced}
                delay={nodeDelay(index)}
                className={ROW_SHIFT[Math.floor(index / PER_ROW) % ROW_SHIFT.length]}
                chipRef={(el) => {
                  chipEls.current[index] = el;
                }}
                liftRef={(el) => {
                  els.current.lifts[index] = el;
                }}
                blinkRef={(side) => (el) => {
                  els.current.blinks[index * 2 + side] = el;
                }}
                onEnter={enter(index)}
                onLeave={leave(index)}
                onDown={down(index)}
              />
              {/* Row break of the brick grid (desktop); not part of the list. */}
              {(index + 1) % PER_ROW === 0 && index < chips.length - 1 && (
                <li aria-hidden="true" role="presentation" className="hidden h-0 basis-full md:block" />
              )}
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
