# Herkunft generierter Inhalte

Jedes auf der Website verwendete generierte Bild steht hier mit Werkzeug, Modell,
Prompt, Datum und Verwendung (`WEBSITE.md`, „KI-Dienste und Bildgenerierung“). Die
Prompts liegen im Klartext unter `docs/prompts/`; die unbearbeiteten Originale
bleiben lokal unter `.harness/runs/`. Vor der Veröffentlichung unter der eigenen
Domain wird jedes Bild ersetzt oder gekennzeichnet.

## Stiltest vom 09.10.2026

Gleiche Prompts, je ein Bild pro Werkzeug:

| Motiv | Codex (GPT-6 Luna als Agent, Bildmodell nicht angegeben) | Nano Banana Pro (Gemini-Web, 3.1 Pro) | Ergebnis |
| --- | --- | --- | --- |
| Spieleentwicklung, 2D-Pixel-Art | weich gezeichnete Pixelkanten | scharfe Pixel, nah am Vorbild | Nano Banana Pro besser |
| Spieleentwicklung, Voxel-Art | große, klar lesbare Objekte | kleine Objekte, unruhiger Hintergrund | Codex besser |
| Roboter-Figur, Pixel-Art | gelungen, auf Magenta statt transparent | nicht erzeugt | – |

Danach entschied der Projektverantwortliche, deutlich näher an das Vorbild zu gehen.
Seitdem gilt 2D-Pixel-Art; erzeugt wird sie mit Nano Banana Pro. Die Voxel-Bilder
aus Codex (drei Leistungsbilder, drei Figuren) liegen ungenutzt unter
`.harness/runs/2026-10-09-website-v1/imagegen/set/`.

## Pixel-Satz vom 09.10.2026

Werkzeug: `scripts/generate-image-gemini.py` über die Gemini-Schnittstelle mit dem
Schlüssel aus der lokalen `.env`, Modell `gemini-3-pro-image` (Nano Banana Pro),
einzige Variante je Motiv. Figuren und Icons entstehen auf Magenta und werden mit
`scripts/optimize-images.py sprite-key` freigestellt; Szenen und die Sticker-Tafel
mit `panel` auf 1600 und 800 Pixel Breite gebracht.

| Datei unter `public/images/` | Prompt unter `docs/prompts/` | Format | Verwendung |
| --- | --- | --- | --- |
| `services/game*.webp` | `stickers-games.txt` | 16:9, 2K | Leistung Spieleentwicklung |
| `scenes/meet*.webp` | `scene-meet.txt` | 16:9, 2K | Vorgehen, Schritt 1 |
| `scenes/concept*.webp` | `scene-concept.txt` | 16:9, 2K | Vorgehen, Schritt 2 |
| `scenes/build*.webp` | `scene-build.txt` | 16:9, 2K | Vorgehen, Schritt 3 |
| `scenes/launch*.webp` | `scene-launch.txt` | 16:9, 2K | Vorgehen, Schritt 4 |
| `sprites/robot.webp` | `sprite-robot.txt` | 1:1, 1K | KI-Visual; Vorlage für den Code-Roboter |
| `sprites/rocket.webp` | `sprite-rocket.txt` | 1:1, 1K | Vorlage für die Code-Rakete; Prozess-Chip „Release“ |
| `sprites/gamepad.webp` | `sprite-gamepad.txt` | 1:1, 1K | Hero, Praxis „Spiele“ |
| `sprites/laptop.webp` | `sprite-laptop.txt` | 1:1, 1K | Hero |
| `sprites/flag.webp` | `sprite-flag.txt` | 1:1, 1K | Hero, App-Visual |
| `sprites/drone.webp` | `sprite-drone.txt` | 1:1, 1K | Hero, KI-Visual |
| `sprites/server.webp` | `sprite-server.txt` | 1:1, 1K | Software-Visual, Praxis „Mittelstand“ |
| `sprites/phone.webp` | `sprite-phone.txt` | 1:1, 1K | App-Visual, Praxis „Apps“ |
| `sprites/chip.webp` | `sprite-chip.txt` | 1:1, 1K | Software- und KI-Visual, Praxis „KI“ |
| `icons/idea.webp` | `icon-idea.txt` | 1:1, 1K | Prozess-Chip, KI-Visual |
| `icons/concept.webp` | `icon-concept.txt` | 1:1, 1K | Prozess-Chip, KI-Visual |
| `icons/prototype.webp` | `icon-prototype.txt` | 1:1, 1K | Prozess-Chip |
| `icons/design.webp` | `icon-design.txt` | 1:1, 1K | Prozess-Chip |
| `icons/code.webp` | `icon-code.txt` | 1:1, 1K | Prozess-Chip |
| `icons/test.webp` | `icon-test.txt` | 1:1, 1K | Prozess-Chip, KI-Visual |

Verbrauch: 21 Bilder einschließlich eines Testbilds über die Gemini-Schnittstelle,
laut Antwort zwischen 1.768 und 2.260 Token je Bild. Geschätzte Kosten rund 3 US-Dollar
nach dem Listenpreis von Nano Banana Pro für 1K- und 2K-Bilder; nicht aus einer
Rechnung abgelesen. Ein erster Versuch mit dem Schlüssel aus der Rechnerumgebung
scheiterte am Ausgabenlimit jenes Google-Projekts (HTTP 429).

## Im Code nachgebaute Figuren

Auf Anregung des Projektverantwortlichen werden zentrale Figuren nach der
Bildgenerierung im Code nachgebaut, damit einzelne Teile animiert werden können.
`scripts/pixelize-sprite.py` rechnet die generierte Figur in ihr Pixelraster zurück
und schreibt `src/components/brand/sprites/<name>.ts`; `PixelCharacters.tsx` teilt
die Pixel in Ebenen.

| Figur | Vorlage | Raster | Bewegte Ebenen |
| --- | --- | --- | --- |
| Rakete | `sprite-rocket` | 26 × 41 | Flamme flackert, beim Start größer; im Fenster sitzt der Roboter und blinzelt |
| Roboter | `sprite-robot` | 27 × 41 | Augen blinzeln, Antenne leuchtet, springt beim Antippen |
