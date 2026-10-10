import type { Rect, StringSpec } from "./strings";

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

const middle = (rect: Rect) => (rect.top + rect.bottom) / 2 + 0.5;

export function buildStrings(chips: Rect[], width: number): StringSpec[] {
  const lines: number[][] = [];
  chips.forEach((rect, chip) => {
    const line = lines[lines.length - 1];
    if (line && Math.abs(middle(chips[line[line.length - 1]]) - middle(rect)) < 4) line.push(chip);
    else lines.push([chip]);
  });
  if (!lines.length) return [];
  const ys = lines.map((line) => middle(chips[line[0]]));
  const pitch = lines.length > 1 ? (ys[ys.length - 1] - ys[0]) / (lines.length - 1) : 60;
  const strings: StringSpec[] = [];

  if (width >= 768) {
    ACROSS.forEach(([left, right]) => {
      strings.push({ ax: -2, ay: ys[0] + left * pitch, bx: width + 2, by: ys[0] + right * pitch, aChip: -1, aSide: 0, bChip: -1, bSide: 1 });
    });
  }

  lines.forEach((line, index) => {
    const y = ys[index];
    const first = line[0];
    const last = line[line.length - 1];
    LEFT[index % LEFT.length].forEach((offset) => {
      strings.push({ ax: -2, ay: y + offset * pitch, bx: chips[first].left + 0.5, by: y, aChip: -1, aSide: 0, bChip: first, bSide: 0 });
    });
    RIGHT[index % RIGHT.length].forEach((offset) => {
      strings.push({ ax: width + 2, ay: y + offset * pitch, bx: chips[last].right - 0.5, by: y, aChip: -1, aSide: 1, bChip: last, bSide: 1 });
    });
    line.slice(0, -1).forEach((chip) => {
      const next = chip + 1;
      strings.push({ ax: chips[chip].right - 0.5, ay: y, bx: chips[next].left + 0.5, by: y, aChip: chip, aSide: 1, bChip: next, bSide: 0 });
    });
  });
  return strings;
}
