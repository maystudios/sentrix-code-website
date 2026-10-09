"""Convert generated PNGs into the WebP files the website serves.

Usage:
  python scripts/optimize-images.py panel SRC.png public/images/services/game
      -> game.webp (1600 x 900) and game-800.webp (800 x 450), cropped to 16:9
  python scripts/optimize-images.py sprite SRC.png public/images/sprites/robot
      -> robot.webp, transparent margins trimmed, longest side 512 px
  python scripts/optimize-images.py sprite-key SRC.png public/images/sprites/robot
      -> like sprite, but first keys out a solid magenta (#FF00FF) background

Keeps the generated originals untouched; their provenance is in docs/provenance.md.
"""

import os
import sys

import numpy as np
from PIL import Image


def crop_to_ratio(image: Image.Image, ratio: float) -> Image.Image:
    width, height = image.size
    if width / height > ratio:
        new_width = round(height * ratio)
        left = (width - new_width) // 2
        return image.crop((left, 0, left + new_width, height))
    new_height = round(width / ratio)
    top = (height - new_height) // 2
    return image.crop((0, top, width, top + new_height))


def panel(source: str, target: str) -> None:
    image = crop_to_ratio(Image.open(source).convert("RGB"), 16 / 9)
    for width, suffix in ((1600, ""), (800, "-800")):
        resized = image.resize((width, round(width * 9 / 16)), Image.LANCZOS)
        resized.save(f"{target}{suffix}.webp", "WEBP", quality=82, method=6)
        print(f"{target}{suffix}.webp")


def key_magenta(image: Image.Image) -> Image.Image:
    """Turn the solid magenta (#FF00FF) generation background transparent."""
    pixels = np.asarray(image.convert("RGBA")).astype(np.float32)
    red, green, blue = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    distance = np.sqrt((255 - red) ** 2 + green**2 + (255 - blue) ** 2)
    alpha = np.clip((distance - 110) / 90, 0, 1) * 255
    # The ocean palette has no magenta hues, so any pixel where red and blue both clearly
    # exceed green is background blended into an outline and is dropped.
    magenta_family = (red > green + 35) & (blue > green + 35) & (np.abs(red - blue) < 90)
    alpha = np.where(magenta_family, 0, alpha)
    pixels[..., 3] = np.minimum(pixels[..., 3], alpha)
    # Remove the pink fringe that soft edges pick up from the background.
    fringe = (alpha > 0) & (alpha < 255)
    pixels[..., 0] = np.where(fringe, np.minimum(red, green + 40), red)
    pixels[..., 2] = np.where(fringe, np.minimum(blue, green + 80), blue)
    return Image.fromarray(pixels.astype(np.uint8), "RGBA")


def sprite_key(source: str, target: str) -> None:
    keyed = key_magenta(Image.open(source))
    temporary = f"{target}.keyed.png"
    keyed.save(temporary)
    sprite(temporary, target)
    os.remove(temporary)


def sprite(source: str, target: str) -> None:
    image = Image.open(source).convert("RGBA")
    box = image.getchannel("A").point(lambda alpha: 255 if alpha > 8 else 0).getbbox()
    if box:
        image = image.crop(box)
    image.thumbnail((512, 512), Image.LANCZOS)
    image.save(f"{target}.webp", "WEBP", quality=90, method=6)
    print(f"{target}.webp {image.size}")


if __name__ == "__main__":
    kind, source, target = sys.argv[1:4]
    {"panel": panel, "sprite": sprite, "sprite-key": sprite_key}[kind](source, target)
