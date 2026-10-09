"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease, spring } from "@/lib/motion";

const MotionLink = motion.create(Link);

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
  onHoverChange?: (hovered: boolean) => void;
};

const variants = {
  primary: "bg-ocean-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
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
  children,
  variant = "primary",
  size = "md",
  className = "",
  onHoverChange,
}: ButtonProps) {
  return (
    <MotionLink
      href={href}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap="tap"
      variants={{ rest: { scale: 1 }, hover: { scale: 1.02 }, tap: { scale: 0.96 } }}
      transition={spring.ui}
      onHoverStart={() => onHoverChange?.(true)}
      onHoverEnd={() => onHoverChange?.(false)}
      className={`relative inline-flex select-none items-center gap-2 overflow-hidden rounded-[var(--radius-control)] font-medium transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {variant === "primary" && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          variants={{ rest: { x: "-150%" }, hover: { x: "260%" }, tap: { x: "260%" } }}
          transition={{ duration: 0.75, ease: ease.outExpo }}
        />
      )}
      <span className="relative">{children}</span>
    </MotionLink>
  );
}
