"use client";

import { motion, type MotionStyle, type TargetAndTransition, type Transition } from "motion/react";

// Renders a layered pixel figure as SVG. The figures are pixel-perfect rebuilds of
// generated images (scripts/pixel-art/rebuild.py → figures.py → figures.ts), split into
// layers so single parts can move, hide or swap frames.

export type PixelRun = readonly [x: number, y: number, length: number, letter: string];

export type PixelFigureData = {
  width: number;
  height: number;
  palette: Record<string, string>;
  layers: Record<string, readonly PixelRun[]>;
};

export type PixelPart = {
  hidden?: boolean;
  className?: string;
  style?: MotionStyle;
  animate?: TargetAndTransition;
  transition?: Transition;
};

type PixelArtProps = {
  figure: PixelFigureData;
  parts?: Record<string, PixelPart | undefined>;
  // Layers whose names end in a digit are frames of one part ("arm1", "arm2"); show the
  // given frame per group, e.g. { arm: 2 }. Groups not listed show frame 1.
  frames?: Record<string, number>;
  className?: string;
  width?: number;
  height?: number;
  // Figures stand on the bottom edge of their box; icons sit in the centre.
  align?: "bottom" | "center";
};

function frameGroup(name: string) {
  const match = /^(.*\D)(\d+)$/.exec(name);
  return match ? { group: match[1], index: Number(match[2]) } : null;
}

export function PixelArt({ figure, parts = {}, frames = {}, className, width, height, align = "bottom" }: PixelArtProps) {
  return (
    <svg
      viewBox={`0 0 ${figure.width} ${figure.height}`}
      width={width}
      height={height}
      preserveAspectRatio={align === "center" ? "xMidYMid meet" : "xMidYMax meet"}
      shapeRendering="crispEdges"
      className={className}
      overflow="visible"
      aria-hidden="true"
    >
      {Object.entries(figure.layers).map(([name, runs]) => {
        const frame = frameGroup(name);
        if (frame && frame.index !== (frames[frame.group] ?? 1)) return null;
        const part = parts[frame ? frame.group : name];
        if (part?.hidden) return null;
        return (
          <motion.g key={name} className={part?.className} style={part?.style} animate={part?.animate} transition={part?.transition}>
            {runs.map(([x, y, length, letter], index) => (
              <rect key={index} x={x} y={y} width={length} height={1} fill={figure.palette[letter]} />
            ))}
          </motion.g>
        );
      })}
    </svg>
  );
}
