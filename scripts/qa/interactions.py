"""Interaction checks for the home page (run against `npm run dev` on port 3000).

Usage: python scripts/qa/interactions.py [BASE_URL]

Checks, each printed as PASS or FAIL:
1. Hovering a hero figure and leaving it puts the figure back where it was.
2. A free hero block dragged upwards and released springs back into place, on screen.
3. Each cloud lane has a cloud on screen at every sample over 12 seconds.
4. The footer robot walks (its position changes), stays inside the bands and stands on the
   top edge of the darkest band.
5. No console errors or page errors.
"""

import sys
import time

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
results = []


def check(name, ok, detail=""):
    results.append(ok)
    print(f"{'PASS' if ok else 'FAIL'}  {name}  {detail}")


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.goto(f"{BASE}/?motion=full", wait_until="networkidle", timeout=90000)
    page.add_style_tag(content="nextjs-portal{display:none!important}")
    time.sleep(4.5)  # entrance: blocks and figures have landed

    # 1. Hover the figures (robot, gamepad, laptop, rocket) and leave again.
    figures = page.locator("section >> div.pointer-events-auto")
    count = figures.count()
    moved = []
    for index in range(count):
        figure = figures.nth(index)
        before = figure.bounding_box()
        if not before or before["width"] > 400:
            continue
        page.mouse.move(before["x"] + before["width"] / 2, before["y"] + before["height"] / 2)
        time.sleep(0.6)
        page.mouse.move(720, 120)
        time.sleep(0.9)
        after = figure.bounding_box()
        if after:
            moved.append(abs(after["y"] - before["y"]) + abs(after["x"] - before["x"]))
    check("hover leaves figures in place", bool(moved) and max(moved) < 6, f"max drift {max(moved) if moved else 'n/a'} px over {len(moved)} figures")

    # 2. Drag a free block up and release.
    grabbable = page.locator(".cursor-grab").first
    box = grabbable.bounding_box()
    if box:
        cx, cy = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        page.mouse.move(cx, cy)
        page.mouse.down()
        for step in range(12):
            page.mouse.move(cx + step * 4, cy - step * 22)
            time.sleep(0.02)
        page.mouse.up()
        page.mouse.move(720, 120)
        time.sleep(1.8)
        # Compare the grabbed element with its resting frame (its parent): the pointer also
        # moves the whole stack a little (parallax), which is not a drift.
        after = grabbable.bounding_box()
        rest = grabbable.locator("xpath=..").bounding_box()
        drift = abs(after["y"] - rest["y"]) + abs(after["x"] - rest["x"]) if after and rest else 9999
        on_screen = after is not None and 0 <= after["y"] <= 900
        check("dragged block springs back", drift < 3 and on_screen, f"drift {drift:.1f} px")
    else:
        check("dragged block springs back", False, "no grabbable block found")

    # 3. Clouds on screen in both lanes, sampled over 12 s.
    lanes_ok = True
    for sample in range(8):
        boxes = page.evaluate(
            """() => [...document.querySelectorAll('section div[style*="cloud "]')].map((el) => {
                const r = el.getBoundingClientRect();
                return { top: el.style.top, visible: r.right > 0 && r.left < innerWidth };
            })"""
        )
        lanes = {}
        for entry in boxes:
            lanes[entry["top"]] = lanes.get(entry["top"], False) or entry["visible"]
        if not lanes or not all(lanes.values()):
            lanes_ok = False
        time.sleep(1.5)
    check("a cloud is always on screen in each lane", lanes_ok)

    # 4. Footer robot walks inside the bands.
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    time.sleep(1.5)
    walker = page.locator("footer [style*='aspect-ratio']").last
    first = walker.bounding_box()
    time.sleep(2.5)
    second = walker.bounding_box()
    footer = page.locator("footer").bounding_box()
    walks = first and second and abs(second["x"] - first["x"]) > 3
    inside = second and footer and second["y"] + second["height"] <= footer["y"] + footer["height"] + 1
    check("footer robot walks inside the bands", bool(walks and inside), f"moved {abs(second['x'] - first['x']) if first and second else 'n/a'} px")
    # Its feet rest on the top edge of the darkest (last) band.
    band = page.evaluate("""() => {
        const bands = [...document.querySelectorAll('footer div')].filter((el) => getComputedStyle(el).backgroundColor === 'rgb(2, 62, 138)');
        const last = bands[bands.length - 1];
        return last ? last.getBoundingClientRect().top : null;
    }""")
    feet = second["y"] + second["height"] if second else None
    on_edge = band is not None and feet is not None and abs(feet - band) <= 2
    check("footer robot stands on the darkest band", on_edge, f"feet {feet}, band top {band}")

    check("no console or page errors", not errors, "; ".join(errors[:3]))
    browser.close()

print(f"\n{sum(results)}/{len(results)} checks passed")
sys.exit(0 if all(results) else 1)
