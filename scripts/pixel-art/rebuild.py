"""Rebuild a generated pixel-art image pixel-perfect as an editable letter grid.

Usage:
  python scripts/pixel-art/rebuild.py SOURCE NAME [--cell N] [--factor K] [--preview DIR]

The source is a generation on flat magenta (grid lines allowed). The script finds the
art-pixel size (scripts/pixelize-sprite.py), takes the median colour of each cell's
inner area, snaps it to the site palette when it is close (the prompts ask for exactly
these colours) and keeps any other colour as its own letter. Output:
scripts/pixel-art/grids/NAME.txt, a header with source, cell and palette, then one row of
letters per art-pixel row ("." is empty). figures.py turns grids into layered figures.
"""

import argparse
import importlib.util
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).parent
spec = importlib.util.spec_from_file_location("pixelize", HERE.parent / "pixelize-sprite.py")
pixelize = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pixelize)

PALETTE = {
    "k": "#03045e",
    "N": "#023e8a",
    "B": "#0077b6",
    "b": "#0096c7",
    "c": "#00b4d8",
    "C": "#48cae4",
    "l": "#90e0ef",
    "L": "#caf0f8",
    "W": "#ffffff",
    "D": "#101013",
    "g": "#9fb3c8",
    "A": "#ffb703",
    "O": "#fb8500",
}
EXTRA_LETTERS = "pqrstuvwyz"
SNAP_DISTANCE = 58


def rgb(hex_colour):
    return np.array([int(hex_colour[i : i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)


def to_hex(colour):
    return "#" + "".join(f"{int(round(v)):02x}" for v in colour)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("name")
    parser.add_argument("--cell", type=float, default=0)
    parser.add_argument("--factor", type=float, default=1)
    parser.add_argument("--preview", default="")
    args = parser.parse_args()

    pixels = pixelize.key(Image.open(args.source))
    profiles = (pixelize._profile(pixels, 0), pixelize._profile(pixels, 1))
    cell = (args.cell or pixelize.estimate_cell(pixels, profiles)) * args.factor
    ox = pixelize.best_offset(profiles[1], cell) % cell
    oy = pixelize.best_offset(profiles[0], cell) % cell
    height, width = pixels.shape[:2]
    columns = int((width - ox) // cell)
    rows = int((height - oy) // cell)

    names = list(PALETTE)
    base = np.stack([rgb(PALETTE[name]) for name in names])
    extras = []  # [letter, colour]
    grid = []
    for row in range(rows):
        line = []
        for column in range(columns):
            y0, x0 = oy + row * cell, ox + column * cell
            margin = max(1.0, cell / 5)
            block = pixels[int(y0 + margin) : int(y0 + cell - margin), int(x0 + margin) : int(x0 + cell - margin)]
            opaque = block[block[..., 3] > 0][:, :3]
            if not len(opaque) or len(opaque) < 0.5 * block.shape[0] * block.shape[1]:
                line.append(".")
                continue
            colour = np.median(opaque, axis=0)
            distances = np.sqrt(((base - colour) ** 2).sum(axis=1))
            if distances.min() <= SNAP_DISTANCE:
                line.append(names[int(distances.argmin())])
                continue
            for letter, known in extras:
                if np.sqrt(((known - colour) ** 2).sum()) <= 30:
                    line.append(letter)
                    break
            else:
                letter = EXTRA_LETTERS[len(extras)]
                extras.append([letter, colour])
                line.append(letter)
        grid.append(line)

    filled_rows = [r for r, line in enumerate(grid) if any(ch != "." for ch in line)]
    filled_columns = [c for c in range(columns) if any(grid[r][c] != "." for r in range(rows))]
    grid = [line[filled_columns[0] : filled_columns[-1] + 1] for line in grid[filled_rows[0] : filled_rows[-1] + 1]]

    palette = dict(PALETTE)
    for letter, colour in extras:
        palette[letter] = to_hex(colour)
    used = sorted({ch for line in grid for ch in line if ch != "."})
    out = HERE / "grids" / f"{args.name}.txt"
    out.parent.mkdir(exist_ok=True)
    with open(out, "w", encoding="utf-8") as handle:
        handle.write(f"# source: {Path(args.source).as_posix()}\n# cell: {cell:.2f}px  grid: {len(grid[0])}x{len(grid)}\n")
        for letter in used:
            handle.write(f"@ {letter} {palette[letter]}\n")
        for line in grid:
            handle.write("".join(line) + "\n")
    print(f"{args.name}: cell {cell:.2f}px grid {len(grid[0])}x{len(grid)} colours {len(used)} -> {out}")

    if args.preview:
        scale = 8
        image = Image.new("RGBA", (len(grid[0]) * scale, len(grid) * scale), (11, 15, 23, 255))
        for y, line in enumerate(grid):
            for x, letter in enumerate(line):
                if letter != ".":
                    colour = tuple(int(c) for c in rgb(palette[letter]))
                    image.paste((*colour, 255), (x * scale, y * scale, (x + 1) * scale, (y + 1) * scale))
        Path(args.preview).mkdir(parents=True, exist_ok=True)
        image.save(Path(args.preview) / f"{args.name}.png")


if __name__ == "__main__":
    main()
