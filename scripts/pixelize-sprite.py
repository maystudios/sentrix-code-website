"""Turn a generated pixel-art sprite back into its pixel grid, as layered code art.

Usage:
  python scripts/pixelize-sprite.py SRC.png NAME [--cell N] [--png OUT.webp --scale 12] [--no-ts]

SRC is the raw generation on solid magenta. The script keys the background, finds the
size of one art pixel, samples each cell, snaps it to the site palette and writes
src/components/brand/sprites/NAME.ts with one run-length list per colour. Layers are
assigned in the component (by colour and position), so the data stays generic.
Prints an ASCII preview for checking.
"""

import argparse
import collections
import os

import numpy as np
from PIL import Image

PALETTE = {
    "o950": (0x03, 0x04, 0x5E),
    "o900": (0x02, 0x3E, 0x8A),
    "o700": (0x00, 0x77, 0xB6),
    "o600": (0x00, 0x96, 0xC7),
    "o500": (0x00, 0xB4, 0xD8),
    "o400": (0x48, 0xCA, 0xE4),
    "o300": (0x90, 0xE0, 0xEF),
    "o100": (0xCA, 0xF0, 0xF8),
    "white": (0xFF, 0xFF, 0xFF),
    "ink": (0x10, 0x10, 0x13),
    "grey": (0x9F, 0xB3, 0xC8),
    "amber": (0xFF, 0xB7, 0x03),
    "orange": (0xFB, 0x85, 0x00),
}
NAMES = list(PALETTE)
COLOURS = np.array([PALETTE[name] for name in NAMES], dtype=np.float32)


def key(image: Image.Image) -> np.ndarray:
    pixels = np.asarray(image.convert("RGBA")).astype(np.float32)
    red, green, blue = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    distance = np.sqrt((255 - red) ** 2 + green**2 + (255 - blue) ** 2)
    magenta_family = (red > green + 35) & (blue > green + 35) & (np.abs(red - blue) < 90)
    pixels[..., 3] = np.where((distance < 150) | magenta_family, 0, 255)
    return pixels


def estimate_cell(pixels: np.ndarray) -> int:
    """Most common length of uniform colour runs, read along rows and columns."""
    runs = collections.Counter()
    rgb = pixels[..., :3]
    opaque = pixels[..., 3] > 0
    for axis_data, mask in ((rgb, opaque), (rgb.transpose(1, 0, 2), opaque.T)):
        for line, line_mask in zip(axis_data, mask):
            start = None
            for index in range(1, len(line)):
                if not line_mask[index]:
                    start = None
                    continue
                if start is None:
                    start = index
                    continue
                if np.abs(line[index] - line[index - 1]).sum() > 60:
                    length = index - start
                    if 6 <= length <= 90:
                        runs[length] += 1
                    start = index
    # Runs are multiples of the cell; the smallest frequent run is the cell itself.
    frequent = [length for length, count in runs.most_common(12)]
    return min(frequent)


def best_offset(pixels: np.ndarray, cell: int, axis: int) -> int:
    rgb = pixels[..., :3]
    scores = []
    for offset in range(cell):
        edges = np.arange(offset, rgb.shape[axis] - 1, cell)
        diff = np.abs(np.diff(rgb, axis=axis)).sum(axis=2)
        scores.append(diff.take(edges, axis=axis).sum())
    return int(np.argmax(scores)) + 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("name")
    parser.add_argument("--cell", type=int, default=0)
    parser.add_argument("--png", default="", help="also render the clean grid as an image (WebP or PNG)")
    parser.add_argument("--scale", type=int, default=12, help="pixels per art pixel for --png")
    parser.add_argument("--no-ts", action="store_true", help="skip writing the TypeScript module")
    args = parser.parse_args()

    pixels = key(Image.open(args.source))
    cell = args.cell or estimate_cell(pixels)
    ox = best_offset(pixels, cell, 1) % cell
    oy = best_offset(pixels, cell, 0) % cell
    height, width = pixels.shape[:2]
    columns = (width - ox) // cell
    rows = (height - oy) // cell

    grid = []
    for row in range(rows):
        line = []
        for column in range(columns):
            y0, x0 = oy + row * cell, ox + column * cell
            margin = max(1, cell // 4)
            block = pixels[y0 + margin : y0 + cell - margin, x0 + margin : x0 + cell - margin]
            if (block[..., 3] > 0).mean() < 0.5:
                line.append(None)
                continue
            colour = np.median(block[block[..., 3] > 0][:, :3], axis=0)
            line.append(NAMES[int(np.argmin(((COLOURS - colour) ** 2).sum(axis=1)))])
        grid.append(line)

    # Trim empty borders.
    filled_rows = [r for r, line in enumerate(grid) if any(line)]
    filled_columns = [c for c in range(columns) if any(grid[r][c] for r in range(rows))]
    grid = [line[filled_columns[0] : filled_columns[-1] + 1] for line in grid[filled_rows[0] : filled_rows[-1] + 1]]
    height_cells, width_cells = len(grid), len(grid[0])

    runs = collections.defaultdict(list)
    for row, line in enumerate(grid):
        column = 0
        while column < width_cells:
            name = line[column]
            if name is None:
                column += 1
                continue
            start = column
            while column < width_cells and line[column] == name:
                column += 1
            runs[name].append((start, row, column - start))

    if args.png:
        image = Image.new("RGBA", (width_cells * args.scale, height_cells * args.scale), (0, 0, 0, 0))
        block = Image.new("RGBA", (args.scale, args.scale))
        for row, line in enumerate(grid):
            for column, name in enumerate(line):
                if name:
                    block.paste((*PALETTE[name], 255), (0, 0, args.scale, args.scale))
                    image.paste(block, (column * args.scale, row * args.scale))
        image.save(args.png, quality=95, method=6) if args.png.endswith(".webp") else image.save(args.png)
        print(f"image -> {args.png} {image.size}")

    target = f"src/components/brand/sprites/{args.name}.ts"
    if args.no_ts:
        target = "(no TypeScript module)"
    else:
      os.makedirs("src/components/brand/sprites", exist_ok=True)
      with open(target, "w", encoding="utf-8") as handle:
          handle.write("// Generated by scripts/pixelize-sprite.py from a generated sprite (docs/provenance.md).\n")
          handle.write("// Runs per palette colour: [x, y, length].\n")
          handle.write("import type { PixelSpriteData } from \"../PixelSprite\";\n\n")
          handle.write(f"export const {args.name}: PixelSpriteData = {{\n")
          handle.write(f"  width: {width_cells},\n  height: {height_cells},\n  runs: {{\n")
          for name, entries in runs.items():
              body = ", ".join(f"[{x}, {y}, {n}]" for x, y, n in entries)
              handle.write(f"    {name}: [{body}],\n")
          handle.write("  },\n};\n")

    symbols = {"o950": "#", "o900": "N", "o700": "B", "o600": "b", "o500": "c", "o400": "C", "o300": "l",
               "o100": "L", "white": "W", "ink": "k", "grey": "g", "amber": "A", "orange": "O"}
    print(f"cell={cell}px offset=({ox},{oy}) grid={width_cells}x{height_cells} -> {target}")
    for line in grid:
        print("".join(symbols[name] if name else "." for name in line))


if __name__ == "__main__":
    main()
