"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { spring } from "@/lib/motion";

const MotionLink = motion.create(Link);

type ButtonProps = {
  // A link with `href`, a button with `onClick`.
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
  onHoverChange?: (hovered: boolean) => void;
};

const variants = {
  primary: "bg-ocean-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-ocean-600",
  secondary: "border border-line-strong bg-surface text-fg hover:bg-raised",
};

const sizes = {
  md: "h-11 px-5 text-[15px]",
  sm: "h-9 px-3.5 text-sm",
};

// Every press, hover and focus answers (WEBSITE.md, "Bewegung", principle 1).
// No arrow on buttons; arrows belong to text links only (WEBSITE.md, "Kein AI-Slop").
export function Button({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onHoverChange,
}: ButtonProps) {
  const shared = {
    initial: "rest",
    animate: "rest",
    whileHover: "hover",
    whileFocus: "hover",
    whileTap: "tap",
    variants: { rest: { scale: 1 }, hover: { scale: 1.02 }, tap: { scale: 0.96 } },
    transition: spring.ui,
    onHoverStart: () => onHoverChange?.(true),
    onHoverEnd: () => onHoverChange?.(false),
    onFocus: () => onHoverChange?.(true),
    onBlur: () => onHoverChange?.(false),
    className: `relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-control)] font-medium transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`,
  } as const;
  const inner = (
    <>
      {/* Hover and focus: a pixel bar fills along the bottom edge in eight steps. */}
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left ${variant === "primary" ? "bg-ocean-300" : "bg-ocean-400"}`}
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 }, tap: { scaleX: 1 } }}
        transition={{ duration: 0.24, ease: (t: number) => Math.ceil(t * 8) / 8 }}
      />
      <span className="relative">{children}</span>
    </>
  );
  if (href === undefined) {
    return (
      <motion.button type="button" onClick={onClick} {...shared}>
        {inner}
      </motion.button>
    );
  }
  return (
    <MotionLink href={href} {...shared}>
      {inner}
    </MotionLink>
  );
}
