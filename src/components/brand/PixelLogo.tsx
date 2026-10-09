"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { PIXEL_LOGO_CELLS, PIXEL_LOGO_COLUMNS, PIXEL_LOGO_ROWS } from "./pixel-logo-data";

const PART_COLOR: Record<number, string> = {
  1: "var(--color-ocean-500)",
  2: "var(--color-fg)",
};

// The pictogram built from blocks: it assembles in a diagonal wave when it scrolls into
// view, and single blocks hop when the pointer passes over them.
export function PixelLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${PIXEL_LOGO_COLUMNS}, 1fr)`,
        gridTemplateRows: `repeat(${PIXEL_LOGO_ROWS}, 1fr)`,
        aspectRatio: `${PIXEL_LOGO_COLUMNS} / ${PIXEL_LOGO_ROWS}`,
      }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {PIXEL_LOGO_CELLS.map(([column, row, part]) => (
        <motion.span
          key={`${column}-${row}`}
          style={{ gridColumn: column + 1, gridRow: row + 1, background: PART_COLOR[part] }}
          variants={{
            hidden: { opacity: 0, y: -24, scale: 0.4 },
            shown: { opacity: 1, y: 0, scale: 1, transition: { ...spring.playful, delay: (column + row) * 0.014 } },
          }}
          whileHover={{ y: -6, scale: 1.15, transition: spring.ui }}
          className="m-[8%] block"
        />
      ))}
    </motion.div>
  );
}
