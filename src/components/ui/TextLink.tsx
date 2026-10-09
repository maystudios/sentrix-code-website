"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { spring } from "@/lib/motion";

const MotionLink = motion.create(Link);

// A link that leads on, with a chevron that steps forward on hover, as in the reference.
export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <MotionLink
      href={href}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className={`group inline-flex items-center gap-1.5 text-[15px] font-medium text-fg transition-colors duration-150 hover:text-ocean-300 ${className}`}
    >
      {children}
      <motion.svg
        viewBox="0 0 8 12"
        aria-hidden="true"
        className="h-3 w-2 text-ocean-400"
        variants={{ rest: { x: 0 }, hover: { x: 4 } }}
        transition={spring.ui}
      >
        <path d="M1.5 1.5 6 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </motion.svg>
    </MotionLink>
  );
}
