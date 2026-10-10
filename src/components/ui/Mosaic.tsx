"use client";

import { useEffect, useRef } from "react";

// Pixel mosaic of square tiles in ocean blues, as in the reference's illustration panels.
// Tiles have a fixed pixel size and stay square on any panel shape (Opus review); the
// gradient runs over palette steps, never over transparency. Drawn on a canvas so a panel
// costs one element instead of thousands, redrawn when the panel changes size. A few
// tiles twinkle as light overlay squares.

const OCEAN = ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef", "#caf0f8"];

type MosaicProps = {
  // Tile edge in CSS pixels.
  tile?: number;
  // Palette level at the start corner and at the opposite corner (0 = darkest).
  from?: number;
  to?: number;
  // "diagonal" runs from top left to bottom right, "horizontal" from left to right.
  direction?: "diagonal" | "horizontal";
  seed?: number;
  twinkle?: boolean;
  className?: string;
};

function level(column: number, row: number, columns: number, rows: number, props: Required<Omit<MosaicProps, "className" | "twinkle">>) {
  const tx = columns > 1 ? column / (columns - 1) : 0;
  const ty = rows > 1 ? row / (rows - 1) : 0;
  const t = props.direction === "horizontal" ? tx : tx * 0.65 + ty * 0.35;
  const index = row * 97 + column;
  const noise = (((index + props.seed * 7) * 37) % 13) / 13 - 0.5;
  return Math.min(OCEAN.length - 1, Math.max(0, Math.round(props.from + (props.to - props.from) * t + noise * 1.2)));
}

const TWINKLES = [
  [0.18, 0.3, 0],
  [0.42, 0.7, 1.4],
  [0.66, 0.22, 2.3],
  [0.84, 0.62, 0.8],
  [0.3, 0.86, 3.1],
];

// "relative" and "absolute" set the same property, and the stylesheet's order decides which
// wins, not the class order. So the default "relative" is left out when a position is given.
function positioned(className: string) {
  return /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
}

export function Mosaic({ tile = 28, from = 7, to = 1, direction = "diagonal", seed = 1, twinkle = true, className = "" }: MosaicProps) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = root.current;
    const target = canvas.current;
    if (!element || !target) return;
    const draw = () => {
      const { width, height } = element.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const columns = Math.ceil(width / tile);
      const rows = Math.ceil(height / tile);
      target.width = Math.ceil(columns * tile * ratio);
      target.height = Math.ceil(rows * tile * ratio);
      target.style.width = `${columns * tile}px`;
      target.style.height = `${rows * tile}px`;
      const context = target.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          context.fillStyle = OCEAN[level(column, row, columns, rows, { tile, from, to, direction, seed })];
          context.fillRect(column * tile, row * tile, tile, tile);
        }
      }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [tile, from, to, direction, seed]);

  return (
    <div ref={root} aria-hidden="true" className={`overflow-hidden ${positioned(className) ? "" : "relative "}${className}`} style={{ background: OCEAN[Math.round((from + to) / 2)] }}>
      <canvas ref={canvas} className="absolute left-0 top-0 block" />
      {twinkle &&
        TWINKLES.map(([x, y, delay], index) => (
          <span
            key={index}
            className="ambient absolute animate-twinkle bg-ocean-100/70"
            style={{
              width: tile,
              height: tile,
              left: `calc(${Math.round(x * 100)}% - ${Math.round(x * 100) % tile}px)`,
              top: `calc(${Math.round(y * 100)}% - ${Math.round(y * 100) % tile}px)`,
              animationDelay: `${delay + seed * 0.3}s`,
            }}
          />
        ))}
    </div>
  );
}
