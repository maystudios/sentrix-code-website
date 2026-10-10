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


FIGURES = {}

# --- Robot (Flow generation "robot-wave" #2) ---------------------------------------------
robot = Figure(load("robot-wave"))
robot.take("antenna", (9, 0, 14, 2))
robot.take("eyes", (5, 12, 16, 15), letters="l")
# The raised arm (viewer's right) is frame 2; frame 3 is the same arm one cell inward and
# down, so alternating them waves.
raised = robot.take("arm2", (18, 13, 24, 23))
raised.update(robot.take("arm2", (17, 19, 17, 20), letters="LWlgC"))
robot.add("arm3", shifted(raised, dx=-1, dy=1))
# Frame 1, the idle pose: the hanging left arm mirrored onto the right side.
hanging = {(x, y): ch for (x, y), ch in robot.base.items() if x <= 4 and 21 <= y <= 29}
robot.add("arm1", {(22 - x, y): ch for (x, y), ch in hanging.items()})
FIGURES["robot"] = robot.export()

# --- Rocket (sprite-rocket from round 1) ---------------------------------------------------
rocket = Figure(load("rocket"))
rocket.take("flame", (7, 28, 14, 34), letters="AWpqr")
rocket.take("window", (8, 10, 13, 15), letters="lLc")
FIGURES["rocket"] = rocket.export()

# --- Drone with claw (Gemini, round 4) --------------------------------------------------------
drone = Figure(load("drone"), pad=(0, 0, 1, 0))
drone.base[(61, 5)] = "D"  # the source cut off the outline at the right blade tip
blades = drone.take("blade1", (0, 4, 61, 6), letters="LD")
for hub in [(9, 4), (10, 4), (11, 4), (9, 5), (11, 5), (50, 4), (51, 4), (52, 4), (50, 5), (52, 5)]:
    if hub in blades:
        drone.base[hub] = blades.pop(hub)
drone.add("blade2", {(x, y): ch for (x, y), ch in blades.items() if 5 <= x <= 15 or 46 <= x <= 56})
drone.take("light", (28, 0, 33, 2), letters="pAO")
drone.take("pupil", (27, 10, 34, 14), letters="lL")
claw = drone.take("claw1", (25, 25, 37, 33))
drone.add("claw2", {((x + 1 if x <= 30 else x - 1) if y >= 28 else x, y): ch for (x, y), ch in claw.items()})
FIGURES["drone"] = drone.export()

# --- Gamepad, laptop, cloud, sparkle (Gemini, round 3b props) ---------------------------------
gamepad = Figure(load("gamepad"))
gamepad.take("dpad", (3, 5, 11, 11), exclude="WLD")
gamepad.take("buttons", (21, 4, 32, 11), exclude="WLD")
gamepad.take("select", (13, 11, 20, 11), letters="k")
gamepad.take("lights", (0, 1, 33, 1), letters="A")
FIGURES["gamepad"] = gamepad.export()

laptop = Figure(load("laptop"))
for index, (y0, y1) in enumerate([(4, 4), (6, 6), (8, 9), (11, 11), (13, 14)], start=1):
    laptop.take(f"code-{'abcde'[index - 1]}", (6, y0, 31, y1), exclude="b")
laptop.take("lights", (26, 18, 31, 18), letters="A")
laptop.add("caret", {(6, 4): "W"})
FIGURES["laptop"] = laptop.export()

cloud = Figure(load("cloud"))
cloud.take("stars", (0, 0, 50, 17), letters="Apq")
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
    take_eyes(companion)
    companion.take("sparks", (0, 0, companion.width, companion.height), letters="AO")
    FIGURES[name] = companion.export()

for name in ["phone", "flag", "mailbox", "paper-plane", "server", "chip"]:
    prop = Figure(load(name))
    prop.take("lights", (0, 0, prop.width, prop.height), letters="AO")
    FIGURES[name] = prop.export()
