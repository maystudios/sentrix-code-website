import type { Rect, Route, StringSpec } from "./strings";

// Brick grid: rows of three chips, each row shifted sideways (desktop only).
export const PER_ROW = 3;
export const ROW_SHIFT = [
  "md:translate-x-[24px] lg:translate-x-[44px]",
  "md:-translate-x-[28px] lg:-translate-x-[52px]",
  "md:translate-x-[32px] lg:translate-x-[60px]",
  "md:-translate-x-[8px] lg:-translate-x-[16px]",
];

// Each line of chips is one chain: section edge, chip, link, chip, link, chip, edge.
// The outer nodes fan out to the edges. Offsets are in line pitches from the node; an
// offset of +0.5 on one line and −0.5 on the next share an edge point, so two strings
// meet there in a shallow V.
const LEFT: number[][] = [[-1.6, 0.5], [-0.5], [-0.35, 1.5], [0.5, 1.75]];
const RIGHT: number[][] = [[-1.1, 0.5], [-0.5, 0.5], [-0.5], [0.4, 1.6]];
// Strings from edge to edge behind the grid, as [left, right] in pitches from the first line.
const ACROSS: [number, number][] = [
  [-1.9, 0.5],
  [1.5, -1.3],
  [3.4, 4.5],
  [4.6, 1.5],
];
// Horizontal room a path connector takes to bend from a node into a gap.
const BEND = 16;

const middle = (rect: Rect) => (rect.top + rect.bottom) / 2 + 0.5;

// The path from idea to release runs from each active chip's right node to the next
// active chip's left node. Neighbours in a line share their link; every other step gets
// its own connector, routed through the gaps so it never crosses a chip:
// - to a line below that starts further left: a carriage return, out of the right node,
//   back along the gap under the line and into the left node;
// - to a line below, close by: one smooth S between the two nodes;
// - to a line below further right, or past a muted chip in the same line: down into the
//   gap, along it and up or down into the next node.
function connector(ax: number, ay: number, bx: number, by: number, gap: number): { route: Route; length: number } {
  const dx = bx - ax;
  const sameLine = Math.abs(by - ay) < 4;
  if (!sameLine && dx < 0) {
    const ra = (gap - ay) / 2;
    const rb = (by - gap) / 2;
    return {
      route: { kind: "run", r1: [0, gap - ay], r2: [0, gap - by], ha: [ra * (4 / 3), ra * (4 / 3)], hb: [-rb * (4 / 3), -rb * (4 / 3)] },
      length: Math.abs(dx) + Math.PI * (ra + rb),
    };
  }
  if (!sameLine && dx < 60) {
    return { route: { kind: "s", k: Math.min(40, Math.max(12, (by - ay) * 0.45)) }, length: Math.hypot(dx, by - ay) * 1.12 };
  }
  return {
    route: { kind: "run", r1: [BEND, gap - ay], r2: [-BEND, gap - by], ha: [BEND / 2, -BEND / 2], hb: [BEND / 2, -BEND / 2] },
    length: Math.max(0, dx - BEND * 2) + (Math.hypot(BEND, gap - ay) + Math.hypot(BEND, by - gap)) * 1.12,
  };
}

export function buildStrings(chips: Rect[], muted: boolean[], width: number): StringSpec[] {
  const lines: number[][] = [];
  const lineOf: number[] = [];
  chips.forEach((rect, chip) => {
    const line = lines[lines.length - 1];
    if (line && Math.abs(middle(chips[line[line.length - 1]]) - middle(rect)) < 4) line.push(chip);
    else lines.push([chip]);
    lineOf[chip] = lines.length - 1;
  });
  if (!lines.length) return [];
  const ys = lines.map((line) => middle(chips[line[0]]));
  const pitch = lines.length > 1 ? (ys[ys.length - 1] - ys[0]) / (lines.length - 1) : 60;
  // The middle of the gap under a line.
  const gapBelow = (line: number) => (line + 1 < ys.length ? (ys[line] + ys[line + 1]) / 2 : ys[line] + pitch / 2);
  // Strings on a muted chip stay dim.
  const tone = (a: number, b: number): StringSpec["tone"] => ((a >= 0 && muted[a]) || (b >= 0 && muted[b]) ? "muted" : "plain");
  const active = chips.map((_, chip) => chip).filter((chip) => !muted[chip]);
  const nextActive = new Map(active.slice(0, -1).map((chip, index) => [chip, active[index + 1]]));
  const strings: StringSpec[] = [];
  const edge = (spec: Omit<StringSpec, "length">) => strings.push({ ...spec, length: Math.hypot(spec.bx - spec.ax, spec.by - spec.ay) });

  if (width >= 768) {
    ACROSS.forEach(([left, right]) => {
      edge({ ax: -2, ay: ys[0] + left * pitch, bx: width + 2, by: ys[0] + right * pitch, aChip: -1, aSide: 0, bChip: -1, bSide: 1, tone: "muted" });
    });
  }

  lines.forEach((line, index) => {
    const y = ys[index];
    const first = line[0];
    const last = line[line.length - 1];
    LEFT[index % LEFT.length].forEach((offset) => {
      edge({ ax: -2, ay: y + offset * pitch, bx: chips[first].left + 0.5, by: y, aChip: -1, aSide: 0, bChip: first, bSide: 0, tone: tone(-1, first) });
    });
    RIGHT[index % RIGHT.length].forEach((offset) => {
      edge({ ax: width + 2, ay: y + offset * pitch, bx: chips[last].right - 0.5, by: y, aChip: -1, aSide: 1, bChip: last, bSide: 1, tone: tone(-1, last) });
    });
    line.slice(0, -1).forEach((chip) => {
      const next = chip + 1;
      edge({
        ax: chips[chip].right - 0.5,
        ay: y,
        bx: chips[next].left + 0.5,
        by: y,
        aChip: chip,
        aSide: 1,
        bChip: next,
        bSide: 0,
        tone: nextActive.get(chip) === next ? "path" : tone(chip, next),
      });
    });
  });

  nextActive.forEach((b, a) => {
    if (b === a + 1 && lineOf[a] === lineOf[b]) return;
    const ax = chips[a].right - 0.5;
    const ay = ys[lineOf[a]];
    const bx = chips[b].left + 0.5;
    const by = ys[lineOf[b]];
    const { route, length } = connector(ax, ay, bx, by, gapBelow(lineOf[a]));
    strings.push({ ax, ay, bx, by, aChip: a, aSide: 1, bChip: b, bSide: 0, tone: "path", route, length });
  });
  return strings;
}
