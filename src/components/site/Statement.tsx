"use client";

import { motion, useInView } from "motion/react";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Dictionary } from "@/content/types";
import { ease } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Chip, type ChipButtonHandlers } from "./statement/Chip";
import { PER_ROW, ROW_SHIFT, buildStrings } from "./statement/layout";
import { StringField, restPath, type Geometry, type StringElements } from "./statement/strings";

// When a chip's nodes pop in: row by row, and left to right within a row.
const nodeDelay = (chip: number) => 0.22 + Math.floor(chip / PER_ROW) * 0.1 + (chip % PER_ROW) * 0.05;
// Once the grid stands, the path from idea to release draws itself step by step.
const pathDelay = (step: number) => 0.95 + step * 0.16;

type Grip = { id: number; chip: number; x: number; y: number; touch: boolean; on: boolean; release: () => void };

// The statement over a brick grid of terms that hang in a web of strings. Strings draw in
// from the section edges, nodes pop, chips rise row by row, then the path from idea to
// release draws itself in ocean blue. Strings can be plucked with the pointer; hovering
// or focusing a chip lifts it and sends light out along its strings; a chip can be pulled
// on its strings and springs back when let go. Now and then a light walks the path.
export function Statement({ dict }: { dict: Dictionary }) {
  const { reduced } = useMotionPolicy();
  const chips = dict.statement.chips;
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const chipEls = useRef<(HTMLLIElement | null)[]>([]);
  const buttonEls = useRef<(HTMLButtonElement | null)[]>([]);
  const els = useRef<StringElements>({ paths: [], pulses: [], lifts: [], blinks: [] });
  const field = useRef<StringField | null>(null);
  const grip = useRef<Grip | null>(null);
  const flashTimer = useRef(0);
  const pressTimer = useRef(0);
  const [geo, setGeo] = useState<Geometry | null>(null);
  // Lit by the mouse, by keyboard focus, or briefly by a tap or key press.
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [flash, setFlash] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const focusedRef = useRef<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [raised, setRaised] = useState<number | null>(null);
  // One tab stop for the grid; arrow keys move between the chips.
  const [rove, setRove] = useState(0);
  const inView = useInView(listRef, { once: true, margin: "0px 0px -12% 0px" });
  const shown = reduced || inView;

  // Steps of the path from idea to release: the n-th active chip starts step n.
  const step = chips.map((chip, index) => (chip.muted ? -1 : chips.slice(0, index).filter((other) => !other.muted).length));

  // Measure the chips relative to the section. ResizeObserver also reports once right
  // after observing, which gives the first measurement. The chips are new elements after
  // a change of the motion policy, so they are observed again.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const muted = chips.map((chip) => !!chip.muted);
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
      setGeo({ width: box.width, height: box.height, chips: rects, strings: buildStrings(rects, muted, box.width) });
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
  }, [chips, reduced]);

  // The string field: pointer plucking, lift, drag, pulses. Paused off screen.
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
      grip.current?.release();
    };
  }, [reduced]);

  useEffect(() => {
    field.current?.setGeometry(geo);
  }, [geo, reduced]);

  // Ambient life starts once the entry and the path have settled.
  useEffect(() => {
    if (reduced || !inView) return;
    const timer = window.setTimeout(() => field.current?.startAmbient(), 2600);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  useEffect(
    () => () => {
      window.clearTimeout(flashTimer.current);
      window.clearTimeout(pressTimer.current);
    },
    [],
  );

  const lightBriefly = (chip: number) => {
    window.clearTimeout(flashTimer.current);
    setFlash(chip);
    flashTimer.current = window.setTimeout(() => setFlash(null), 650);
  };

  const enter = (chip: number) => (event: ReactPointerEvent) => {
    if (event.pointerType === "touch") return;
    hoveredRef.current = chip;
    setHovered(chip);
    field.current?.hover(chip, true);
  };
  const leave = (chip: number) => (event: ReactPointerEvent) => {
    if (event.pointerType === "touch") return;
    if (hoveredRef.current === chip) hoveredRef.current = null;
    setHovered((current) => (current === chip ? null : current));
    field.current?.hover(chip, focusedRef.current === chip);
  };

  // Press feedback starts on pointer down. A mouse or pen pulls the chip as soon as it
  // moves; a finger only after a clear sideways move, so vertical swipes still scroll.
  // The grip ends wherever the pointer is let go: the window sees every pointerup and
  // pointercancel, captured or not.
  const down = (chip: number) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    grip.current?.release();
    setPressed(chip);
    field.current?.press(chip);
    if (event.pointerType === "touch") lightBriefly(chip);
    const id = event.pointerId;
    const end = (up: PointerEvent) => {
      const current = grip.current;
      if (up.pointerId !== id || current?.id !== id) return;
      current.release();
      setPressed(null);
      if (current.on) field.current?.dragEnd(current.chip);
    };
    const release = () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      if (grip.current?.id === id) grip.current = null;
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    grip.current = { id, chip, x: event.clientX, y: event.clientY, touch: event.pointerType === "touch", on: false, release };
  };
  const move = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const current = grip.current;
    if (!current || current.id !== event.pointerId || !field.current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.on) {
      if (current.touch) {
        if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) {
          // The page scrolls; this touch is no pull.
          current.release();
          setPressed(null);
          return;
        }
        if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
      } else if (Math.hypot(dx, dy) < 3) {
        return;
      }
      current.on = true;
      // Touch is captured implicitly already.
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
      setRaised(current.chip);
      field.current.dragStart(current.chip);
    }
    field.current.drag(current.chip, dx, dy);
  };

  // Enter and Space reach the button as a click without a pointer (detail 0): the same
  // squeeze, twang and light as a press. Pointer clicks were handled on pointer down.
  const click = (chip: number) => (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (event.detail !== 0) return;
    field.current?.press(chip);
    if (focusedRef.current !== chip) lightBriefly(chip);
    window.clearTimeout(pressTimer.current);
    setPressed(chip);
    pressTimer.current = window.setTimeout(() => setPressed(null), 140);
  };
  const key = (chip: number) => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const target =
      event.key === "ArrowRight" ? chip + 1 : event.key === "ArrowLeft" ? chip - 1 : event.key === "Home" ? 0 : event.key === "End" ? chips.length - 1 : -1;
    if (target < 0 || target >= chips.length) return;
    event.preventDefault();
    buttonEls.current[target]?.focus();
  };
  // Keyboard focus mirrors hover; a focus from a click leaves the chip as it is.
  const focus = (chip: number) => (event: ReactFocusEvent<HTMLButtonElement>) => {
    setRove(chip);
    if (!event.currentTarget.matches(":focus-visible")) return;
    focusedRef.current = chip;
    setFocused(chip);
    field.current?.hover(chip, true);
  };
  const blur = (chip: number) => () => {
    if (focusedRef.current !== chip) return;
    focusedRef.current = null;
    setFocused(null);
    field.current?.hover(chip, hoveredRef.current === chip);
  };

  const buttonHandlers = (chip: number): ChipButtonHandlers => ({
    onPointerDown: down(chip),
    onPointerMove: move,
    onClick: click(chip),
    onKeyDown: key(chip),
    onFocus: focus(chip),
    onBlur: blur(chip),
  });

  const lit = (chip: number) => hovered === chip || focused === chip || flash === chip;

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-line bg-surface/40 py-24 md:py-32">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {geo?.strings.map((spec, index) => {
          const link = spec.aChip >= 0;
          const path = spec.tone === "path";
          const on = (spec.aChip >= 0 && lit(spec.aChip)) || (spec.bChip >= 0 && lit(spec.bChip));
          // Edge strings arrive at their node just as it pops; links follow once both
          // nodes are there; strings across the grid draw first; the path draws last, in
          // order from idea to release.
          const delay = path
            ? pathDelay(step[spec.aChip])
            : link
              ? Math.max(nodeDelay(spec.aChip), nodeDelay(spec.bChip)) + 0.12
              : spec.bChip >= 0
                ? Math.max(0, nodeDelay(spec.bChip) - 0.3)
                : 0;
          const stroke = on
            ? link
              ? "stroke-ocean-400"
              : "stroke-ocean-700"
            : path
              ? "stroke-ocean-700/80"
              : spec.tone === "muted"
                ? "stroke-line"
                : "stroke-line-strong";
          return (
            <g key={`${index}-${reduced}`}>
              <motion.path
                ref={(el: SVGPathElement | null) => {
                  els.current.paths[index] = el;
                }}
                d={restPath(spec)}
                fill="none"
                strokeWidth={1}
                className={`transition-[stroke] duration-200 ${stroke}`}
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={shown ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{
                  pathLength: { duration: path ? (spec.route ? 0.5 : 0.22) : link ? 0.45 : spec.bChip >= 0 ? 1.1 : 1.6, ease: ease.outExpo, delay },
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
              {/* A change of the motion policy mounts the chip afresh: the server render
                  assumes full motion, and with reduced motion the chip has to stand in its
                  final state at once instead of waiting for an entry. */}
              <Chip
                key={reduced ? "still" : "live"}
                label={chip.label}
                icon={chip.icon}
                muted={!!chip.muted}
                lit={lit(index)}
                pressed={pressed === index}
                raised={raised === index}
                shown={shown}
                reduced={reduced}
                delay={nodeDelay(index)}
                tabIndex={rove === index ? 0 : -1}
                className={ROW_SHIFT[Math.floor(index / PER_ROW) % ROW_SHIFT.length]}
                chipRef={(el) => {
                  chipEls.current[index] = el;
                }}
                liftRef={(el) => {
                  els.current.lifts[index] = el;
                }}
                buttonRef={(el) => {
                  buttonEls.current[index] = el;
                }}
                blinkRef={(side) => (el) => {
                  els.current.blinks[index * 2 + side] = el;
                }}
                onEnter={enter(index)}
                onLeave={leave(index)}
                button={buttonHandlers(index)}
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
