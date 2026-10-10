"""Rebuild a generated pixel-art scene pixel-perfect as a small PNG (one pixel per art pixel).

Usage:
  python scripts/pixel-art/rebuild-scene.py SOURCE OUT.png [--cell N] [--colours K] [--probe X0 Y0 X1 Y1]

The scene is resampled on its own art-pixel grid (median colour per cell), so soft glows
and blurred edges become hard cells. Colours are reduced to K clusters and snapped to the
site palette where they are close. The page shows the PNG scaled up with
`image-rendering: pixelated`, so every art pixel stays a crisp square. `--probe` limits the
cell-size search to a region with figure detail (the mosaic background has far larger
tiles than the figures).
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

SITE = ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef", "#caf0f8", "#ffffff", "#101013", "#ffb703", "#fb8500"]
SITE_RGB = np.array([[int(c[i : i + 2], 16) for i in (1, 3, 5)] for c in SITE], dtype=np.float32)


def kmeans(colours, k, rounds=12, seed=3):
    rng = np.random.default_rng(seed)
    centres = colours[rng.choice(len(colours), size=min(k, len(colours)), replace=False)]
    for _ in range(rounds):
        labels = np.argmin(((colours[:, None, :] - centres[None]) ** 2).sum(axis=2), axis=1)
        for index in range(len(centres)):
            members = colours[labels == index]
            if len(members):
                centres[index] = members.mean(axis=0)
    labels = np.argmin(((colours[:, None, :] - centres[None]) ** 2).sum(axis=2), axis=1)
    return centres, labels


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("out")
    parser.add_argument("--cell", type=float, default=0)
    parser.add_argument("--colours", type=int, default=28)
    parser.add_argument("--probe", type=int, nargs=4, default=None)
    args = parser.parse_args()

    image = Image.open(args.source).convert("RGBA")
    pixels = np.asarray(image).astype(np.float32)
    if args.cell:
        cell = args.cell
    else:
        probe = pixels
        if args.probe:
            x0, y0, x1, y1 = args.probe
            probe = pixels[y0:y1, x0:x1]
        profiles = (pixelize._profile(probe, 0), pixelize._profile(probe, 1))
        cell = pixelize.estimate_cell(probe, profiles)
    profiles = (pixelize._profile(pixels, 0), pixelize._profile(pixels, 1))
    ox = pixelize.best_offset(profiles[1], cell) % cell
    oy = pixelize.best_offset(profiles[0], cell) % cell
    height, width = pixels.shape[:2]
    columns = int((width - ox) // cell)
    rows = int((height - oy) // cell)

    grid = np.zeros((rows, columns, 3), dtype=np.float32)
    for row in range(rows):
        for column in range(columns):
            y0, x0 = oy + row * cell, ox + column * cell
            margin = max(1.0, cell / 5)
            block = pixels[int(y0 + margin) : int(y0 + cell - margin), int(x0 + margin) : int(x0 + cell - margin), :3]
            grid[row, column] = np.median(block.reshape(-1, 3), axis=0)

    flat = grid.reshape(-1, 3)
    centres, labels = kmeans(flat, args.colours)
    # Snap clusters that sit close to a site colour.
    for index, centre in enumerate(centres):
        distances = np.sqrt(((SITE_RGB - centre) ** 2).sum(axis=1))
        if distances.min() < 36:
            centres[index] = SITE_RGB[distances.argmin()]
    result = centres[labels].reshape(rows, columns, 3).clip(0, 255).astype(np.uint8)
    Image.fromarray(result, "RGB").save(args.out, optimize=True)
    print(f"{Path(args.source).name}: cell {cell:.2f}px offset ({ox:.0f},{oy:.0f}) grid {columns}x{rows} -> {args.out}")


if __name__ == "__main__":
    main()
