import type { SVGProps } from "react";

// Hand-placed pixel props for the growing prototype: pencil, tiny users, check, badge and
// rewind sign. Letters are flat palette colours, "." stays empty. One <rect> per horizontal
// run of a colour keeps the markup small.

type Run = { x: number; y: number; w: number; fill: string };

function toRuns(rows: string[], palette: Record<string, string>): Run[] {
  const runs: Run[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const letter = row[x];
      if (letter === ".") {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x] === letter) x++;
      runs.push({ x: start, y, w: x - start, fill: palette[letter] });
    }
  });
  return runs;
}

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.w} height={1.02} fill={run.fill} />
      ))}
    </>
  );
}

// Pencil lying at 45°, lead at the bottom left, eraser at the top right.
const PENCIL_ROWS = [
  "............ee",
  "...........eeE",
  "..........eeE.",
  ".........ffE..",
  "........ffF...",
  ".......AAF....",
  "......AAo.....",
  ".....AAo......",
  "....AAo.......",
  "...AAo........",
  "..wAo.........",
  ".wwW..........",
  "twW...........",
  "tt............",
];
const PENCIL_RUNS = toRuns(PENCIL_ROWS, {
  t: "#023e8a",
  w: "#f3f6fa",
  W: "#caf0f8",
  A: "#ffb703",
  o: "#fb8500",
  f: "#c3ccd9",
  F: "#7d889c",
  e: "#00b4d8",
  E: "#0077b6",
});
export const PENCIL_SIZE = 14;

// Drawn so the lead's tip sits at (0, 0); `scale` is device units per art pixel.
export function PencilArt({ scale }: { scale: number }) {
  return (
    <g transform={`scale(${scale}) translate(-0.5 -13.5)`} shapeRendering="crispEdges">
      <Runs runs={PENCIL_RUNS} />
    </g>
  );
}

// Tiny users who join the live app. Same figure, different hair and shirts.
const USER_ROWS = ["..hhh..", ".hhhhh.", ".fkfkf.", ".fffff.", "..fff..", ".bbbbb.", "bbbbbbb"];
const USER_LOOKS = [
  { h: "#ffb703", b: "#0096c7" },
  { h: "#023e8a", b: "#ffb703" },
  { h: "#f3f6fa", b: "#48cae4" },
  { h: "#0077b6", b: "#90e0ef" },
];
const USER_RUNS = USER_LOOKS.map((look) => toRuns(USER_ROWS, { ...look, f: "#caf0f8", k: "#03045e" }));

export function PixelUser({ look, ...props }: { look: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true" {...props}>
      <Runs runs={USER_RUNS[look % USER_RUNS.length]} />
    </svg>
  );
}

// Check mark, revealed column by column so it draws itself.
export const CHECK_ROWS = [".......#", "......##", "#....##.", "##..##..", ".####...", "..##...."];
export const CHECK_PIXELS = CHECK_ROWS.flatMap((row, y) => [...row].map((cell, x) => (cell === "#" ? { x, y } : null)).filter((cell) => cell !== null));

// Notification badge with a "1".
const BADGE_RUNS = toRuns(["AAAAA", "AAkAA", "AkkAA", "AAkAA", "AAkAA", "AkkkA", "AAAAA"], { A: "#ffb703", k: "#03045e" });

export function PixelBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 5 7" shapeRendering="crispEdges" aria-hidden="true" {...props}>
      <Runs runs={BADGE_RUNS} />
    </svg>
  );
}

// Rewind sign shown while the prototype runs back to an earlier step.
const REWIND_RUNS = toRuns(["...L...L.", "..LL..LL.", ".LLL.LLL.", "..LL..LL.", "...L...L."], { L: "#caf0f8" });

export function PixelRewind(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 9 5" shapeRendering="crispEdges" aria-hidden="true" {...props}>
      <Runs runs={REWIND_RUNS} />
    </svg>
  );
}

// Jet flame under the robot's boots: two frames swap in CSS (globals.css, "frame-swap").
const JET = { W: "#ffffff", q: "#fbd26d", A: "#ffb703", o: "#fb8500" };
const JET_RUNS = [toRuns(["qWq", "AqA", ".A.", ".o."], JET), toRuns(["qWq", "AqA", ".o.", "..."], JET)];

export function PixelJet({ className }: { className?: string }) {
  return (
    <span className={`relative block ${className ?? ""}`}>
      {JET_RUNS.map((runs, index) => (
        <svg
          key={index}
          viewBox="0 0 3 4"
          shapeRendering="crispEdges"
          aria-hidden="true"
          className="ambient absolute inset-0 size-full"
          style={{ animation: `frame-swap 0.14s steps(1) ${index ? "-0.07s infinite reverse" : "infinite"}` }}
        >
          <Runs runs={runs} />
        </svg>
      ))}
    </span>
  );
}

// Small arrow pointing up, for the growth badge.
const ARROW_RUNS = toRuns(["..#..", ".###.", "#####", "..#..", "..#.."], { "#": "#48cae4" });

export function PixelArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 5 5" shapeRendering="crispEdges" aria-hidden="true" {...props}>
      <Runs runs={ARROW_RUNS} />
    </svg>
  );
}
