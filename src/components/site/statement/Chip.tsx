"use client";

import { motion } from "motion/react";
import type { DOMAttributes, PointerEvent as ReactPointerEvent } from "react";
import type { IconName } from "@/content/types";
import { PixelIcon } from "@/components/brand/PixelIcon";
import { ease, spring } from "@/lib/motion";

const POP = { scale: [0, 1.9, 1], opacity: 1 };

export type ChipButtonHandlers = Pick<
  DOMAttributes<HTMLButtonElement>,
  "onPointerDown" | "onPointerMove" | "onClick" | "onKeyDown" | "onFocus" | "onBlur"
>;

type ChipProps = {
  label: string;
  icon: IconName;
  muted: boolean;
  lit: boolean;
  pressed: boolean;
  raised: boolean;
  shown: boolean;
  reduced: boolean;
  delay: number;
  tabIndex: 0 | -1;
  className: string;
  chipRef: (el: HTMLLIElement | null) => void;
  liftRef: (el: HTMLDivElement | null) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
  blinkRef: (side: 0 | 1) => (el: HTMLSpanElement | null) => void;
  onEnter: (event: ReactPointerEvent) => void;
  onLeave: (event: ReactPointerEvent) => void;
  button: ChipButtonHandlers;
};

function Node({ side, lit, strong, shown, reduced, delay, blinkRef }: {
  side: 0 | 1;
  lit: boolean;
  strong: boolean;
  shown: boolean;
  reduced: boolean;
  delay: number;
  blinkRef: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`absolute top-[calc(50%-2px)] z-10 size-[5px] ${side === 0 ? "-left-[2px]" : "-right-[2px]"}`}
      initial={reduced ? false : { scale: 0, opacity: 0 }}
      animate={shown ? POP : undefined}
      transition={{ duration: 0.42, delay, ease: ease.outExpo, times: [0, 0.4, 1] }}
    >
      <span
        className={`block size-full transition-[scale,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          lit ? "scale-[1.6] bg-ocean-300" : strong ? "bg-fg/75" : "bg-muted/60"
        }`}
      />
      <span ref={blinkRef} className="absolute inset-0 bg-ocean-300 opacity-0" />
    </motion.span>
  );
}

// One term of the grid: a list item whose chip is a button. Pointer, Enter and Space
// all play the same feedback; the chip can be pulled on its strings (touch only after a
// clear sideways move, so vertical page scrolling stays with the browser).
export function Chip({
  label,
  icon,
  muted,
  lit,
  pressed,
  raised,
  shown,
  reduced,
  delay,
  tabIndex,
  className,
  chipRef,
  liftRef,
  buttonRef,
  blinkRef,
  onEnter,
  onLeave,
  button,
}: ChipProps) {
  const active = lit || !muted;
  return (
    <li ref={chipRef} className={`relative my-2 md:my-3 ${raised ? "z-10" : ""} ${className}`} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <div ref={liftRef} className="relative">
        <Node side={0} lit={lit} strong={!muted} shown={shown} reduced={reduced} delay={delay} blinkRef={blinkRef(0)} />
        {/* Entry: rises out of its slot with a small spring, right after its nodes pop. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14, scale: 0.94 }}
          animate={shown ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ ...spring.playful, delay: delay + 0.08, opacity: { duration: 0.3, delay: delay + 0.08 } }}
        >
          {/* Press: a quick, tactile squeeze, held while the chip is pulled. */}
          <motion.button
            ref={buttonRef}
            type="button"
            tabIndex={tabIndex}
            initial={false}
            animate={{ scale: pressed && !reduced ? 0.95 : 1 }}
            transition={spring.ui}
            {...button}
            className={`flex touch-pan-y touch-pinch-zoom select-none items-center whitespace-nowrap rounded-[var(--radius-control)] border px-3.5 py-2 text-[15px] leading-6 transition-[border-color,background-color,color] duration-150 [-webkit-tap-highlight-color:transparent] md:px-4 md:py-2.5 md:text-[17px] md:leading-7 lg:px-5 lg:text-[20px] lg:leading-8 ${
              reduced ? "cursor-default" : "cursor-grab active:cursor-grabbing"
            } ${
              lit
                ? "border-ocean-400 bg-raised text-fg"
                : muted
                  ? "border-line bg-[color-mix(in_srgb,var(--color-surface)_40%,var(--color-base))] text-muted"
                  : "border-line-strong bg-raised text-fg"
            }`}
          >
            {/* From md up a muted chip keeps room for its icon and centres the label in it
                (half of icon 24 px plus gap 10 px), so the icon can glide in on hover without
                changing the chip's width. Phones have no hover and keep muted chips tight. */}
            <span
              className={`flex items-center gap-2.5 ${reduced ? "" : "transition-[translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"} ${
                active ? "" : "md:-translate-x-[17px]"
              }`}
            >
              <motion.span
                className={muted ? "hidden md:flex" : "flex"}
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={shown ? { opacity: 1, scale: 1 } : undefined}
                transition={{ ...spring.playful, delay: delay + 0.22 }}
              >
                <motion.span
                  className="flex"
                  initial={false}
                  animate={active ? { opacity: 1, scale: 1, y: lit ? [0, -3, 0] : 0 } : { opacity: 0, scale: 0.4, y: 0 }}
                  transition={{ ...spring.playful, y: { duration: 0.36, ease: ease.outExpo } }}
                >
                  <PixelIcon name={icon} px={2} />
                </motion.span>
              </motion.span>
              <span className="-mb-[0.2em] overflow-hidden pb-[0.2em]">
                <motion.span
                  className="block"
                  initial={reduced ? false : { y: "110%" }}
                  animate={shown ? { y: 0 } : undefined}
                  transition={{ duration: 0.6, ease: ease.outExpo, delay: delay + 0.14 }}
                >
                  {label}
                </motion.span>
              </span>
            </span>
          </motion.button>
        </motion.div>
        <Node side={1} lit={lit} strong={!muted} shown={shown} reduced={reduced} delay={delay + 0.04} blinkRef={blinkRef(1)} />
      </div>
    </li>
  );
}
