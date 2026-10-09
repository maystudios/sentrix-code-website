import type { ReactNode } from "react";

// Code-rendered pixel art. Data comes from scripts/pixelize-sprite.py; a layer function
// sorts each pixel into a named layer so single parts (flame, eyes, antenna) can move.

export type PixelRun = [x: number, y: number, length: number];

export type PixelSpriteData = {
  width: number;
  height: number;
  runs: Record<string, PixelRun[]>;
};

export const PIXEL_COLORS: Record<string, string> = {
  o950: "#03045e",
  o900: "#023e8a",
  o700: "#0077b6",
  o600: "#0096c7",
  o500: "#00b4d8",
  o400: "#48cae4",
  o300: "#90e0ef",
  o100: "#caf0f8",
  white: "#ffffff",
  ink: "#101013",
  grey: "#9fb3c8",
  amber: "#ffb703",
  orange: "#fb8500",
};

type PixelSpriteProps = {
  data: PixelSpriteData;
  layer?: (colour: string, x: number, y: number) => string;
  layerClassName?: Record<string, string>;
  // Optional custom wrapper for a layer, e.g. to move the eyes with motion values.
  renderLayer?: (name: string, rects: ReactNode[]) => ReactNode | undefined;
  className?: string;
  children?: ReactNode;
};

export function PixelSprite({ data, layer = () => "base", layerClassName = {}, renderLayer, className, children }: PixelSpriteProps) {
  const layers = new Map<string, ReactNode[]>();
  for (const [colour, runs] of Object.entries(data.runs)) {
    for (const [x, y, length] of runs) {
      // Split runs so each pixel can land in its own layer.
      for (let offset = 0; offset < length; offset++) {
        const name = layer(colour, x + offset, y);
        if (!layers.has(name)) layers.set(name, []);
        layers.get(name)!.push(
          <rect key={`${colour}-${x + offset}-${y}`} x={x + offset} y={y} width={1.02} height={1.02} fill={PIXEL_COLORS[colour]} />,
        );
      }
    }
  }
  return (
    <svg
      viewBox={`0 0 ${data.width} ${data.height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      overflow="visible"
    >
      {[...layers.entries()].map(
        ([name, rects]) =>
          renderLayer?.(name, rects) ?? (
            <g key={name} className={layerClassName[name]} style={{ transformBox: "fill-box" }}>
              {rects}
            </g>
          ),
      )}
      {children}
    </svg>
  );
}
