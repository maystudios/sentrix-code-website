# Referenzanalyse mistral.ai

Gelesen am 09.10.2026 in Chrome bei 1440 × 900 px, ergänzt um ausgelesene
Stilwerte (`getComputedStyle`, CSS-Variablen, Keyframes). Die Analyse beschreibt
Aufbau und Wirkung; sie ist keine Vorlage zum Kopieren von Texten, Grafiken oder
Code (siehe `WEBSITE.md`, „Vorbild mistral.ai“).

## Technische Basis

- Astro mit Tailwind CSS v4 (CSS-Variablen `--color-*`, `--ease-*`, Keyframes
  `astroFadeIn` und `astroSlideFrom*` für Seitenübergänge).
- Schriften: eigene Display-Schrift „ALTMistral“ (Gewicht 500) für Überschriften,
  Inter für Fließtext, Space Mono für Code-Darstellungen.

## Farbe und Fläche

| Rolle | Wert |
| --- | --- |
| Seitenhintergrund | `#101013` (steel-950) |
| Erhöhte Flächen, Karten | `#1A1A1E` (steel-900), `#27272B` (steel-800) |
| Linien und Raster | sehr dünne, dunkelgraue 1-px-Linien |
| Text | `#FAFAF4` (warmes Off-White, „cream-50“) |
| Gedämpfter Text | `#6D6D78` (steel-500) |
| Markenfarben | Orange `#FA500F`/`#FF8204`, Gelb `#FFAF01`, Rot `#E51300` |
| Sekundäre Bildfarben | Grün- und Blautöne nur in Illustrationsflächen |

Wirkung: dunkle, ruhige Grundfläche; Farbe tritt fast nur in Illustrationen und
geometrischen Blöcken auf. Das hält die Seite seriös und lässt die verspielten
Elemente leuchten.

## Typografie

| Element | Größe / Zeilenhöhe | Gewicht | Laufweite |
| --- | --- | --- | --- |
| Hero-Aussage | ca. 72–80 px, zweizeilig zentriert | 500 | ca. −2 % |
| Abschnitts-H2 groß | 56 / 60 px | 500 | −1 % |
| Abschnitts-H2 | 44 / 52 px | 500 | −1 % |
| Zeilen-Überschrift | ca. 28–32 px, zweizeilig | 500 | −1 % |
| Fließtext | 16 / 24 px, Inter | 400 | normal |
| Fußspalten-Titel | 16 px, gedämpft | 400 | normal |

Überschriften sind kurz, oft zwei Sätze mit Parallelstruktur („We make the
models. You keep them.“). Ein Pixel-Icon kann inline im Satz stehen.

## Raster und Aufbau

- Inhaltsspalte zwischen zwei durchgehenden vertikalen 1-px-Linien; horizontale
  Linien trennen Abschnitte. Das Raster ist sichtbar und gibt Ordnung.
- Kopfzeile: Logo, Menüpunkte als durch Linien getrennte Zellen, rechts
  „Get in touch“ und „Login“. Dropdowns als schlichte, umrandete Panels mit
  Pfeilen.
- Reihenfolge der Startseite:
  1. Hero: große zentrierte Aussage, darunter eine Ankündigungs-Pille.
     Seitlich stapeln sich geometrische Blöcke (Quadrate, Rauten) in
     Markenfarben, darauf sitzen Pixel-Figuren.
  2. Logo-Leiste in gleich breiten, umrandeten Zellen.
  3. Aussage-Abschnitt mit perspektivischen Linien („Fäden“), in die Begriffe als
     Chips hineinfliegen.
  4. Positionierungssatz als große H2.
  5. Vier Leistungszeilen mit klebender Sprungnavigation links (Scroll-Spy),
     abwechselnd Text links/Bild rechts; jede Zeile mit 1–2 Text-Links mit Pfeil.
  6. Kundennachweise: Branchen-Tabs links, Kennzahl und Logo Mitte, Zitat auf
     roter Fläche rechts.
  7. „Go deeper.“: drei gleich breite Karten mit Icon, Titel, kurzem Text und
     Schaltflächen.
  8. Fuß: drei Linkspalten, Social Icons, App-Badges, Theme-Schalter
     (hell/dunkel/System), Sprachwahl, großes Pixel-Logo, darunter animierte
     Farbbänder mit laufender Pixel-Katze.

## Bildsprache

- Pixel-Art-Figuren und -Objekte (Katze, Fabrik, Burg, Greifarm, Sticker).
- Illustrationsflächen mit Pixel-Mosaik-Hintergrund aus Quadraten in Abstufungen
  einer Farbe (Grün, Blau, Orange, Gelb), darauf ein realistisch-sauberes
  UI-Fenster oder eine Pixel-Grafik.
- Geometrische Blöcke als dekorative Ebene im Hero.
- Fotografie kommt nicht vor; Menschen erscheinen nicht.

## Bewegung

| Muster | Werte |
| --- | --- |
| Standard-Transition | 150 ms (Farben, Rahmen) und 300 ms (Transform), `cubic-bezier(0.4, 0, 0.2, 1)` |
| Einblenden | 500 ms Deckkraft |
| Hero-Blöcke | Keyframes „bento-fall“/„markitecture-fall“: Blöcke fallen herein und stapeln sich, gestaffelt |
| Marken-Einflug | 700 ms `ease-out`, gestaffelte Verzögerungen 100–550 ms |
| Chips | „pop-in“ 500 ms |
| Fortlaufend | langsame Farbverläufe (5–10 s linear), pulsierende Punkte, laufende Pixel-Katze |
| Seitenwechsel | Astro View Transitions (Einblenden, Schieben) |
| Hover-Überraschung | Hinter der Ankündigungs-Pille taucht eine Pixel-Katze auf |

Wirkung: Grundinteraktionen sind schnell und zurückhaltend; Lebendigkeit entsteht
durch wenige, gezielt verspielte Momente und langsame Dauerbewegung im
Hintergrund.

## Für Sentrix Code übertragbar

- dunkle Grundfläche, sichtbares Linienraster, warmes Off-White als Textfarbe
- kurze, parallel gebaute Aussagen als Überschriften
- Hero mit fallenden geometrischen Blöcken und Pixel- bzw. Voxel-Figuren
- Leistungszeilen mit Scroll-Spy-Navigation
- Illustrationsflächen aus Pixel-Mosaik plus sauberem UI-Element
- schnelle Grundtransitions, wenige verspielte Überraschungen, ruhige Dauerbewegung

Nicht übertragbar ohne belegte Inhalte: Logo-Leiste, Kundennachweise mit Kennzahlen
und Zitaten (siehe „Wahrheit vor Wirkung“).
