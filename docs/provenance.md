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

## Im Code nachgebaute Figuren (Runde 4, 10.10.2026)

Alle Figuren, Requisiten und Icons auf der Seite sind pixelgenaue Nachbauten generierter
Bilder; im Ordner `public/images` liegen nur noch die Szenenbilder. Ablauf nach Vorgabe
des Projektverantwortlichen: erst ein Bild generieren, dann exakt nachbauen, dann
animieren. Frei gezeichnete Pixelgrafik wurde verworfen.

1. `scripts/pixel-art/rebuild.py` findet die Kachelgröße des Bildes (auch gebrochene
   Größen) und nimmt je Kachel die mittlere Farbe. Nahe Farben werden auf die Seitenpalette
   gesetzt, andere bleiben erhalten. Das Ergebnis ist ein Buchstabenraster in
   `scripts/pixel-art/grids/`.
2. `scripts/pixel-art/figures.py` teilt die Raster in Ebenen. Abgeleitete Frames (Arm unten,
   kurze Rotorblätter, geschlossener Greifer) verschieben oder spiegeln nur vorhandene
   Kacheln desselben Bildes.
3. `scripts/pixel-art/build.py` schreibt `src/components/brand/figures.ts` und `pixel-icons.ts`.

| Figur | Vorlage | Raster | Bewegung |
| --- | --- | --- | --- |
| Roboter | Flow `robot-wave` Nr. 2 | 25 × 35 | blinzelt, schaut zum Zeiger, winkt (zwei Frames), Arm unten aus gespiegeltem linken Arm |
| Rakete | `sprite-rocket` (09.10.) | 22 × 35 | Flamme flackert, beim Start lang |
| Drohne | Gemini, Runde 4, 16:9 | 62 × 34 | Rotoren (zwei Frames), Auge schaut, Licht pulsiert, Greifer öffnet |
| Controller, Laptop, Wolke, Handy, Flagge, Briefkasten, Papierflieger | Gemini, Runde 3b (`props/`) | 20 × 31 bis 51 × 18 | Tasten, getippte Codezeilen mit Cursor, funkelnde Sterne, Lichter |
| Server, Chip, Funkelstern | Gemini, Runde 4 | 24 × 31, 34 × 35, 13 × 13 | Lichter, Funkeln |
| Begleiter (Spiel, Code, Handy, KI), Astronaut | Flow-Sätze und Gemini (09.10.) | 26 × 34 bis 36 × 39 | Augen blinzeln, Funken |
| 12 Icons | Gemini, Runde 4, Stilvorlage `icon-code` | 14 × 14 bis 36 × 30 | ruhend |

Runde 4 hat über die Gemini-Schnittstelle (Nano Banana Pro, 2K) 18 Bilder erzeugt:
Drohne in zwei Formaten, zwei Funkelsterne, Server, Chip und zwölf Icons. Prompts und
Rohbilder liegen lokal unter `.harness/runs/2026-10-10-website-v2/round4/gen/`.

## Runde 5 (10.10.2026)

- **Drohne:** neu generiert, isometrisch und mit Würfel im Greifer (Gemini, `drone-carry` Nr. 2). Der Nachbau nutzt 1,5 Quellkacheln je Pixel und liefert 60 × 57 Pixel. Der generierte Würfel wird abgetrennt und nicht gezeigt. Die Seite hängt stattdessen ihren eigenen flachen Block zwischen die Zangen.
- **Icons:** Konzept und Chip wurden größer neu generiert und nachgebaut (26 × 28 und 30 × 29). Alle Icons zeigen dieselbe Pixelgröße, ein Zweiunddreißigstel der Iconbox.
- **Szenen der Unterseiten:** `scripts/pixel-art/rebuild-scene.py` baut die Szenen pixelgenau auf ihrem Raster nach, meist 10 px Kachelgröße bei 1600 px Breite. Das Skript bestimmt je Kachel den Medianwert, reduziert auf 36 Farben und setzt nahe Farben auf die Seitenpalette. Die Ergebnisse liegen als kleine PNG unter `public/images/scenes/` und werden mit `image-rendering: pixelated` vergrößert angezeigt. Weiche Leuchteffekte werden dabei zu harten Kacheln.
- **Über-uns-Szene:** Sie zeigt jetzt den Roboter im Studio und keine Personen mehr. Generiert wurde sie über Antigravity (`gemini-3.8-flash-high`, Bildwerkzeug) mit `ai-lab` und dem Roboter als Vorlage, weil das Gemini-API-Projekt sein Monatsbudget erreicht hatte. Der Nachbau nutzt 5,5 px Kachelgröße.
- **Entfernt:** die ungenutzten Szenen `meet`, `concept`, `build` und `launch`. Den Ablauf zeigt jetzt der wachsende Prototyp.
