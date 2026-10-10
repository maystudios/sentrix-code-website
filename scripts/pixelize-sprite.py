"""Turn a generated pixel-art sprite back into its pixel grid, as layered code art.

Usage:
  python scripts/pixelize-sprite.py SRC.png NAME [--cell N] [--factor K] [--png OUT.webp --scale 12] [--no-ts]

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


def _profile(pixels: np.ndarray, axis: int) -> np.ndarray:
    """Colour change between neighbouring pixels, summed across the other axis."""
    rgb = pixels[..., :3]
    return np.abs(np.diff(rgb, axis=axis)).sum(axis=2).sum(axis=1 - axis)


def best_offset(profile: np.ndarray, cell: float) -> float:
    """Grid offset whose lines sit on the strongest colour edges. Cells may be fractional."""
    best, offset = -1.0, 0.0
    for candidate in np.arange(0, cell, 1.0):
        lines = np.round(candidate + np.arange(0, (len(profile) - candidate) / cell) * cell).astype(int)
        score = profile[lines[lines < len(profile)]].sum()
        if score > best:
            best, offset = score, candidate
    return offset + 1


def _rebuild_error(pixels: np.ndarray, cell: float, profiles) -> float:
    """Mean colour error when the image is rebuilt from one sample per cell."""
    height, width = pixels.shape[:2]
    ox, oy = best_offset(profiles[1], cell), best_offset(profiles[0], cell)
    xs = np.clip((ox + (np.floor((np.arange(width) - ox) / cell) + 0.5) * cell).astype(int), 0, width - 1)
    ys = np.clip((oy + (np.floor((np.arange(height) - oy) / cell) + 0.5) * cell).astype(int), 0, height - 1)
    rebuilt = pixels[ys][:, xs]
    opaque = pixels[..., 3] > 0
    return float(np.abs(rebuilt[..., :3] - pixels[..., :3]).sum(axis=2)[opaque].mean())


def estimate_cell(pixels: np.ndarray, profiles) -> float:
    """Cell size where rebuilding from one sample per cell is clearly better than nearby sizes.

    Generated sprites have soft edges, so the absolute error barely moves; the true art pixel
    shows up as a sharp dip against its neighbours (halves and multiples do not dip as deep).
    """
    cells = np.arange(10, 64.01, 0.25)
    errors = np.array([_rebuild_error(pixels, cell, profiles) for cell in cells])
    ratios = [errors[i] / np.median(errors[(np.abs(cells - cell) >= 1) & (np.abs(cells - cell) <= 3)]) for i, cell in enumerate(cells)]
    return float(cells[int(np.argmin(ratios))])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("name")
    parser.add_argument("--cell", type=float, default=0)
    parser.add_argument("--factor", type=float, default=1, help="merge this many detected cells into one, for coarser art")
    parser.add_argument("--png", default="", help="also render the clean grid as an image (WebP or PNG)")
    parser.add_argument("--scale", type=int, default=12, help="pixels per art pixel for --png")
    parser.add_argument("--no-ts", action="store_true", help="skip writing the TypeScript module")
    args = parser.parse_args()

    pixels = key(Image.open(args.source))
    profiles = (_profile(pixels, 0), _profile(pixels, 1))
    cell = (args.cell or estimate_cell(pixels, profiles)) * args.factor
    ox = best_offset(profiles[1], cell) % cell
    oy = best_offset(profiles[0], cell) % cell
    height, width = pixels.shape[:2]
    columns = int((width - ox) // cell)
    rows = int((height - oy) // cell)

    # Each cell takes the most common palette colour of its inner area, so merged cells
    # (factor > 1) keep clean colours instead of averaging into new ones.
    grid = []
    for row in range(rows):
        line = []
        for column in range(columns):
            y0, x0 = oy + row * cell, ox + column * cell
            margin = max(1.0, cell / 6)
            block = pixels[int(y0 + margin) : int(y0 + cell - margin), int(x0 + margin) : int(x0 + cell - margin)]
            opaque = block[block[..., 3] > 0][:, :3]
            if len(opaque) < 0.5 * block.shape[0] * block.shape[1] or not len(opaque):
                line.append(None)
                continue
            nearest = np.argmin(((opaque[:, None, :] - COLOURS[None]) ** 2).sum(axis=2), axis=1)
            line.append(NAMES[int(np.bincount(nearest).argmax())])
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
    print(f"cell={cell:.2f}px offset=({ox:.0f},{oy:.0f}) grid={width_cells}x{height_cells} -> {target}")
    for line in grid:
        print("".join(symbols[name] if name else "." for name in line))


if __name__ == "__main__":
    main()
