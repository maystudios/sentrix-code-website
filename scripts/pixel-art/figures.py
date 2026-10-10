"""Layered pixel figures, rebuilt pixel-perfect from generated images.

Workflow (owner's instruction, round 4): generate an image, rebuild it exactly as a grid
(rebuild.py → grids/NAME.txt), then split the grid into layers so parts can animate.
Nothing here is drawn freehand; layers only move existing cells around. The few derived
frames (arm down, short rotor blades, closed claw) shift or mirror cells of the same
image.

Run build.py to write src/components/brand/figures.ts and a preview sheet.
"""

from pathlib import Path

GRIDS = Path(__file__).parent / "grids"


def load(name):
    palette, rows = {}, []
    for line in (GRIDS / f"{name}.txt").read_text(encoding="utf-8").splitlines():
        if line.startswith("#"):
            continue
        if line.startswith("@"):
            _, letter, colour = line.split()
            palette[letter] = colour
            continue
        rows.append(line)
    width = max(len(row) for row in rows)
    cells = {(x, y): ch for y, row in enumerate(rows) for x, ch in enumerate(row) if ch != "."}
    return {"palette": palette, "cells": cells, "width": width, "height": len(rows)}


class Figure:
    def __init__(self, grid, pad=(0, 0, 0, 0)):
        left, top, right, bottom = pad
        self.palette = dict(grid["palette"])
        self.width = grid["width"] + left + right
        self.height = grid["height"] + top + bottom
        self.base = {(x + left, y + top): ch for (x, y), ch in grid["cells"].items()}
        self.layers = {}

    def take(self, layer, rect, letters=None, exclude=None):
        """Move the cells inside rect (x0, y0, x1, y1 inclusive) from the base into a layer."""
        x0, y0, x1, y1 = rect
        moved = {}
        for (x, y), ch in list(self.base.items()):
            if x0 <= x <= x1 and y0 <= y <= y1 and (letters is None or ch in letters) and (exclude is None or ch not in exclude):
                moved[(x, y)] = ch
                del self.base[(x, y)]
        self.layers.setdefault(layer, {}).update(moved)
        return moved

    def add(self, layer, cells):
        self.layers.setdefault(layer, {}).update(cells)

    def export(self):
        return {"width": self.width, "height": self.height, "palette": self.palette, "layers": {"base": self.base, **self.layers}}


def shifted(cells, dx=0, dy=0):
    return {(x + dx, y + dy): ch for (x, y), ch in cells.items()}


def backfill(figure, cells, letter):
    """Fill the base under a moving layer, so moving or hiding it never leaves a hole."""
    for cell in cells:
        figure.base[cell] = letter


def mirrored(cells):
    """The same cells mirrored inside their own bounding box (a whole-cell alternate frame)."""
    xs = [x for x, _ in cells]
    left, right = min(xs), max(xs)
    return {(left + right - x, y): ch for (x, y), ch in cells.items()}


def lids(eyes):
    """Closed eyes: per eye, one horizontal line on the lower of its widest rows."""
    rows = {}
    for (x, y) in eyes:
        rows.setdefault(y, []).append(x)
    widest = max(len(xs) for xs in rows.values())
    row = max(y for y, xs in rows.items() if len(xs) == widest)
    return {(x, row): eyes[(x, row)] for x in rows[row]}


FIGURES = {}

# --- Robot (Flow generation "robot-wave" #2) ---------------------------------------------
robot = Figure(load("robot-wave"))
robot.take("antenna", (9, 0, 14, 2))
eyes = robot.take("eyes", (5, 12, 16, 15), letters="l")
backfill(robot, eyes, "k")
robot.add("lids", lids(eyes))
# The raised arm (viewer's right), cut out row by row so the head keeps all its cells
# (round 4 feedback: a rectangle had taken part of the head with it). Frame 2 is the arm
# as generated, frame 3 tips the hand one cell inward, so alternating them waves.
ARM_ROWS = {14: (22, 23), 15: (22, 24), 16: (21, 24), 17: (20, 24), 18: (19, 23), 19: (18, 23), 20: (17, 22), 21: (17, 21), 22: (17, 20), 23: (17, 18)}
raised = {}
for y, (x0, x1) in ARM_ROWS.items():
    raised.update(robot.take("arm2", (x0, y, x1, y)))
robot.add("arm3", {((x - 1) if y <= 18 else x, y): ch for (x, y), ch in raised.items()})
# Frame 1, the idle pose: the left shoulder and hanging arm mirrored onto the right side
# (the torso outline runs at x = 5 and x = 17, so x mirrors to 22 - x).
hanging = {(x, y): ch for (x, y), ch in robot.base.items() if (2 <= x <= 5 and 20 <= y <= 23) or (x <= 4 and 24 <= y <= 29)}
robot.add("arm1", {(22 - x, y): ch for (x, y), ch in hanging.items()})
FIGURES["robot"] = robot.export()

# --- Rocket (sprite-rocket from round 1) ---------------------------------------------------
rocket = Figure(load("rocket"))
flame = rocket.take("flame", (7, 28, 14, 34), letters="AWpqr")
rocket.add("flame-b", mirrored(flame))
rocket.take("window", (8, 10, 13, 15), letters="lLc")
FIGURES["rocket"] = rocket.export()

# --- Drone with claw, isometric (Gemini, round 4, drone-carry #2 at 1.5 source cells) --------
# The generated cube is split off and not drawn; the site hangs its own flat block between
# the prongs (prongs in front, block behind).
drone = Figure(load("drone-carry"))
# Propellers: three frames per disc, swapped quickly in CSS so they read as spinning.
# Frame a is the disc as generated; b and c paint a dark blade across it, once along the
# long axis and once along the diagonal (only the disc's own cells are recoloured).
def blade_frames(disc):
    xs = [x for x, _ in disc]
    ys = [y for _, y in disc]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    half_w, half_h = max(1, (max(xs) - min(xs)) / 2), max(1, (max(ys) - min(ys)) / 2)
    along = {cell: ("N" if abs(cell[1] - cy) <= 0.5 and abs(cell[0] - cx) < half_w - 1 else ch) for cell, ch in disc.items()}
    diagonal = {cell: ("N" if abs((cell[0] - cx) / half_w - (cell[1] - cy) / half_h) < 0.35 and abs(cell[0] - cx) < half_w - 1 else ch) for cell, ch in disc.items()}
    return along, diagonal


spin_b, spin_c = {}, {}
for name, rect in [("back", (18, 0, 30, 3)), ("left", (0, 13, 11, 16)), ("right", (48, 13, 59, 16)), ("front", (33, 28, 44, 31))]:
    disc = drone.take(f"rotor-{name}", rect)
    along, diagonal = blade_frames(disc)
    spin_b.update(along)
    spin_c.update(diagonal)
drone.add("rotor-spin", spin_b)
drone.add("rotor-spin-c", spin_c)
drone.take("light", (25, 14, 29, 16), letters="pOqr")
pupil = drone.take("pupil", (21, 21, 24, 25), letters="CW")
backfill(drone, pupil, "k")
RIGHT_PRONG = {37: (29, 31), 38: (29, 32), 39: (30, 33), 40: (30, 34), 41: (31, 34), 42: (32, 34), 43: (32, 34),
               44: (32, 34), 45: (32, 34), 46: (31, 34), 47: (31, 33), 48: (31, 32)}
LEFT_PRONG = {38: (22, 25), 39: (22, 25), 40: (22, 25), 41: (22, 23)}
head = drone.take("claw-head", (23, 31, 31, 37))
right = {}
for y, (x0, x1) in RIGHT_PRONG.items():
    right.update(drone.take("claw-right", (x0, y, x1, y)))
left = {}
for y, (x0, x1) in LEFT_PRONG.items():
    left.update(drone.take("claw-left", (x0, y, x1, y)))
cube = drone.take("cube", (20, 38, 37, 56))
# Claw frames: 1 gripping (as generated), 2 open (both prongs two cells outward).
drone.layers.pop("claw-right")
drone.layers.pop("claw-left")
drone.add("claw1", {**right, **left})
drone.add("claw2", {**shifted(right, dx=2), **shifted(left, dx=-2)})
FIGURES["drone"] = drone.export()
# Layer order: the claw must be drawn after (in front of) the cube.
order = ["base", "rotor-back", "rotor-left", "rotor-right", "rotor-spin", "rotor-spin-c", "light", "pupil", "claw-head", "cube", "claw1", "claw2", "rotor-front"]
FIGURES["drone"]["layers"] = {name: FIGURES["drone"]["layers"][name] for name in order}

# --- Gamepad, laptop, cloud, sparkle (Gemini, round 3b props) ---------------------------------
gamepad = Figure(load("gamepad"))
gamepad.take("dpad", (3, 5, 11, 11), exclude="WLD")
gamepad.take("buttons", (21, 4, 32, 11), exclude="WLD")
gamepad.take("select", (13, 11, 20, 11), letters="k")
gamepad.take("lights", (0, 1, 33, 1), letters="A")
FIGURES["gamepad"] = gamepad.export()

laptop = Figure(load("laptop"))
for index, (y0, y1) in enumerate([(4, 4), (6, 6), (8, 9), (11, 11), (13, 14)], start=1):
    code = laptop.take(f"code-{'abcde'[index - 1]}", (6, y0, 31, y1), exclude="b")
    backfill(laptop, code, "b")
laptop.take("lights", (26, 18, 31, 18), letters="A")
laptop.add("caret", {(6, 4): "W"})
FIGURES["laptop"] = laptop.export()

cloud = Figure(load("cloud"))
# The yellow dots inside the cloud body were a generation artefact (Gemini video review).
for cell, ch in list(cloud.base.items()):
    if ch in "Apq":
        cloud.base[cell] = "N"
FIGURES["cloud"] = cloud.export()

sparkle = Figure(load("sparkle"))
sparkle.take("core", (3, 3, 9, 9), letters="W")
FIGURES["sparkle"] = sparkle.export()


# --- Eyes, found automatically: small light areas fully enclosed by the dark visor ------------
def take_eyes(figure, top_share=0.5):
    dark = set("kND")
    cells = figure.base
    limit = figure.height * top_share
    seen = set()
    eyes = {}
    for start, ch in list(cells.items()):
        if start in seen or ch in dark or start[1] > limit:
            continue
        component, stack, enclosed = [], [start], True
        seen.add(start)
        while stack:
            x, y = stack.pop()
            component.append((x, y))
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                neighbour = cells.get((nx, ny))
                if neighbour is None or neighbour == "D":
                    enclosed = False  # eyes sit inside the visor, not against the outline
                elif neighbour not in dark and (nx, ny) not in seen:
                    seen.add((nx, ny))
                    stack.append((nx, ny))
        if enclosed and len(component) <= 8:
            eyes.update({cell: cells[cell] for cell in component})
    for cell in eyes:
        del cells[cell]
    figure.add("eyes", eyes)
    return eyes


# --- Companions, props and the 404 astronaut (Flow and Gemini generations) ---------------------
for name in ["robot-gamer", "robot-coder", "robot-phone", "robot-ai", "robot-astronaut"]:
    companion = Figure(load(name))
    eyes = take_eyes(companion)
    backfill(companion, eyes, "k")
    companion.add("lids", lids(eyes))
    companion.take("sparks", (0, 0, companion.width, companion.height), letters="AO")
    FIGURES[name] = companion.export()

for name in ["phone", "flag", "mailbox", "paper-plane", "server", "chip"]:
    prop = Figure(load(name))
    prop.take("lights", (0, 0, prop.width, prop.height), letters="AO")
    FIGURES[name] = prop.export()


# --- Walking robot (Flow walk sheet #2): four frames cut from one rebuilt grid ---------------
def walk_frames(name, columns):
    grid = load(name)
    frames = []
    for x0, x1 in columns:
        cells = {(x, y): ch for (x, y), ch in grid["cells"].items() if x0 <= x <= x1}
        # Drop the little spark marks the generation put beside the head.
        cells = {(x, y): ch for (x, y), ch in cells.items() if not (ch in "AOpqrs" and y < 14 and x > x0 + 18)}
        # Align frames on the head: the mean column of the top 20 rows.
        head = [x for (x, y) in cells if y < 20]
        centre = sum(head) / len(head)
        frames.append((cells, centre))
    width = max(x1 - x0 for x0, x1 in columns) + 7
    figure = {"width": width, "height": grid["height"], "palette": grid["palette"], "layers": {}}
    for index, (cells, centre) in enumerate(frames, start=1):
        dx = round(width / 2 - centre)
        figure["layers"][f"walk{index}"] = {(x + dx, y): ch for (x, y), ch in cells.items()}
    return figure


FIGURES["robot-walk"] = walk_frames("robot-walk", [(0, 29), (32, 57), (61, 87), (90, 117)])
