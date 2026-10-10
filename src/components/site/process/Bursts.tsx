"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { burst, random } from "./choreo";

// Square-pixel effects drawn in SVG units (1 unit = 1cqw of the stage). No circles.

// Confetti: square pixels burst upwards, flip over as they tumble and fall with gravity.
export function Confetti({ x, y, seed, count, power = 1, delay = 0 }: { x: number; y: number; seed: number; count: number; power?: number; delay?: number }) {
  const particles = useMemo(() => burst(seed, count, power), [seed, count, power]);
  return (
    <g transform={`translate(${x} ${y})`}>
      {particles.map((particle, index) => (
        <motion.g
          key={index}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 1, 1, 1, 1, 0.9, 0.5, 0] }}
          transition={{ duration: 1.5, delay: delay + particle.delay, ease: "linear" }}
        >
          <motion.g
            animate={{ scaleX: [1, 0.15, 1], scaleY: [1, 0.85, 1] }}
            transition={{ duration: particle.spin, repeat: Infinity, ease: "easeInOut", delay: delay + particle.delay }}
          >
            <rect x={-particle.size / 2} y={-particle.size / 2} width={particle.size} height={particle.size} fill={particle.colour} shapeRendering="crispEdges" />
          </motion.g>
        </motion.g>
      ))}
    </g>
  );
}

// Smoke puffs under a launching rocket: squares that swell, drift and fade.
export function Smoke({ x, y, delay, seed }: { x: number; y: number; delay: number; seed: number }) {
  const puffs = useMemo(() => {
    const r = random(seed);
    return Array.from({ length: 8 }, (_, index) => ({
      dx: (index % 2 ? 1 : -1) * (3 + r() * 7),
      dy: 1 + r() * 4,
      size: 2.4 + r() * 2.2,
      at: delay + index * 0.06,
      colour: index % 3 === 0 ? "#caf0f8" : "#97a3b8",
    }));
  }, [delay, seed]);
  return (
    <g transform={`translate(${x} ${y})`}>
      {puffs.map((puff, index) => (
        <motion.g
          key={index}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.9, 0], x: puff.dx, y: puff.dy, scale: [0.4, 1.4, 1.8] }}
          transition={{ duration: 0.8, delay: puff.at, ease: "easeOut" }}
        >
          <rect x={-puff.size / 2} y={-puff.size / 2} width={puff.size} height={puff.size} fill={puff.colour} shapeRendering="crispEdges" />
        </motion.g>
      ))}
    </g>
  );
}

// Eight pixels fly out from a point, as when something pops into place.
export function Sparkle({ x, y, delay, reach = 16, colour = "#caf0f8" }: { x: number; y: number; delay: number; reach?: number; colour?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const far = index % 2 ? reach * 0.7 : reach;
        return (
          <motion.g
            key={index}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], x: Math.cos(angle) * far, y: Math.sin(angle) * far }}
            transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
          >
            <rect x={-0.8} y={-0.8} width={1.6} height={1.6} fill={index % 2 ? "#ffb703" : colour} shapeRendering="crispEdges" />
          </motion.g>
        );
      })}
    </g>
  );
}
