"""Consent checks (run against `npm run dev` on port 3000).

Usage: python scripts/qa/consent.py [BASE_URL] [SHOT_DIR]

1. Without optional services no banner appears and nothing is stored.
2. `?consent=show` shows the banner; "Alle ablehnen" hides it and stores an empty choice.
3. The footer link opens the settings dialog as a modal; Escape closes it.
4. The privacy policy's button opens the dialog; switches without a service are locked;
   "Auswahl speichern" stores the choice and the dialog shows its date next time.
5. The English footer offers "Privacy settings".
6. No console errors or page errors.
"""

import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
SHOTS = Path(sys.argv[2]) if len(sys.argv) > 2 else None
results = []


def check(name, ok, detail=""):
    results.append(ok)
    print(f"{'PASS' if ok else 'FAIL'}  {name}  {detail}")


def stored(page):
    raw = page.evaluate("window.localStorage.getItem('sentrix-consent')")
    return json.loads(raw) if raw else None


with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text[:200]) if m.type == "error" else None)

    page.goto(f"{BASE}/", wait_until="networkidle", timeout=90000)
    page.add_style_tag(content="nextjs-portal{display:none!important}")
    time.sleep(1.5)
    banner = page.locator("section[role='region']").filter(has_text="Ihre Privatsphäre")
    check("no banner without optional services", banner.count() == 0 and stored(page) is None)

    page.goto(f"{BASE}/?consent=show", wait_until="networkidle", timeout=90000)
    page.add_style_tag(content="nextjs-portal{display:none!important}")
    time.sleep(1.5)
    visible = banner.count() == 1 and banner.is_visible()
    if SHOTS:
        SHOTS.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(SHOTS / "consent-banner.png"))
    banner.get_by_role("button", name="Alle ablehnen").click()
    time.sleep(0.8)
    record = stored(page)
    check("preview banner shows and rejecting stores an empty choice", visible and banner.count() == 0 and record is not None and record["granted"] == [], str(record))

    page.get_by_role("button", name="Datenschutz-Einstellungen").first.click()
    time.sleep(0.8)
    dialog = page.locator("dialog[open]")
    opened = dialog.count() == 1
    focus_inside = page.evaluate("document.querySelector('dialog[open]')?.contains(document.activeElement) ?? false")
    if SHOTS:
        page.screenshot(path=str(SHOTS / "consent-dialog.png"))
    page.keyboard.press("Escape")
    time.sleep(0.5)
    check("footer link opens the modal dialog, Escape closes it", opened and focus_inside and page.locator("dialog[open]").count() == 0)

    page.goto(f"{BASE}/datenschutz/", wait_until="networkidle", timeout=90000)
    page.add_style_tag(content="nextjs-portal{display:none!important}")
    time.sleep(1.0)
    page.get_by_role("button", name="Datenschutz-Einstellungen öffnen").click()
    time.sleep(0.8)
    switches = page.locator("dialog[open] [role='switch']")
    locked = [switches.nth(i).is_disabled() for i in range(switches.count())]
    page.locator("dialog[open]").get_by_role("button", name="Auswahl speichern").click()
    time.sleep(0.6)
    saved = stored(page)
    page.get_by_role("button", name="Datenschutz-Einstellungen öffnen").click()
    time.sleep(0.6)
    dated = page.locator("dialog[open]").get_by_text("Ihre Auswahl vom").count() == 1
    page.keyboard.press("Escape")
    check("privacy page button opens the dialog; empty categories locked; choice saved and dated", len(locked) == 3 and all(locked) and saved is not None and dated, f"switches {locked}")

    page.goto(f"{BASE}/en/", wait_until="networkidle", timeout=90000)
    time.sleep(1.0)
    check("English footer offers privacy settings", page.get_by_role("button", name="Privacy settings").count() == 1)

    check("no console or page errors", not errors, "; ".join(errors[:3]))
    browser.close()

print(f"\n{sum(results)}/{len(results)} checks passed")
sys.exit(0 if all(results) else 1)
