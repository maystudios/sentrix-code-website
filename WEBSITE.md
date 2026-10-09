# Sentrix Code Website – Spezifikation

## Zweck und Geltung

Diese Datei hält die gemeinsam festgelegten Vorgaben für die Website der
Sentrix Code GmbH i. G. fest: was die Website erreichen soll, welche
Grundsatzentscheidungen gelten und wie Agenten an ihr arbeiten. Sie ist die
verbindliche Grundlage für alle Arbeiten an der Website.

Alle am Projekt arbeitenden Agenten lesen diese Datei vor Projektarbeiten und
richten ihre Arbeit an den für die jeweilige Aufgabe relevanten Vorgaben aus.
Die `AGENTS.md` und die `CLAUDE.md` verweisen auf diese gemeinsame Grundlage.

Neue Vorgaben werden hier schrittweise ergänzt. Vom Projektverantwortlichen
formulierte Punkte werden in seinem Wortlaut festgehalten. Projektverantwortlicher
ist Sven Maibaum; er trifft die Entscheidungen zur Website. Agenten passen diese
Datei nicht selbstständig an ihre Umsetzung an. Widerspricht eine Aufgabe dieser
Datei, benenne den Widerspruch und hole die Entscheidung ein.

Das Repository ist öffentlich. Alles, was hier eingecheckt wird, kann jeder lesen;
die Folgen regelt der Abschnitt „Feste Projektentscheidungen“.

## Wahrheit vor Wirkung

Die veröffentlichte Website wirkt professionell, aber ausschließlich durch belegte
Inhalte. Diese Regel steht über allen Gestaltungs- und Textvorgaben.

Für die Entwicklung gilt seit dem 09.10.2026 eine Ausnahme. Im Wortlaut des
Projektverantwortlichen: „Du darfst auch schon mal gern die ganzen Texte bauen und
Inhalte bauen und dir selbst überlegen, was wohin kann, was wirklich Sinn macht, um
Sachen rüberzubringen und auch einfach selbst dabei kreativ sein und das Ganze schon
wirklich vollständig füllen, einfach mit Content. Ist jetzt egal, ob der frei
erfunden ist oder nicht, aber so wie er wirklich sinnvoll wäre, so wie am Ende das
meiste Engagement daraus entsteht.“

- Erfundene Beispielinhalte wie Fallbeispiele, Zitate, Antwortzeiten oder Antworten
  im FAQ sind während der Entwicklung erlaubt. Sie sind konkret und glaubwürdig
  statt allgemein, damit sie den späteren echten Inhalt zeigen.
- Sie nennen nie echte Firmen, Marken, Produkte oder Personen als Kunden, Partner
  oder Zitatgeber und zeigen keine fremden Logos. Fallbeispiele beschreiben den
  Kunden allgemein, etwa „Maschinenbauer aus dem Bergischen Land“.
- Jeder erfundene Inhalt ist in der Inhaltsquelle `src/content/` als Beispiel
  markiert (`example: true` beziehungsweise Kommentar `// EXAMPLE`). Bevor die
  Website unter der eigenen Domain veröffentlicht wird, ist jeder solche Inhalt
  ersetzt, vom Projektverantwortlichen bestätigt oder entfernt.
- Feste Firmenangaben wie Firma, Anschrift, Geschäftsführer und Registerdaten werden
  nie erfunden. Fehlt eine davon, steht ein sichtbarer Platzhalter in der Form
  `[OFFEN: …]`, und der Punkt kommt in die Liste „Offene Punkte“.
- Kundenprojekte erscheinen nur mit ausdrücklicher Freigabe des
  Projektverantwortlichen. Projekte unter einer Geheimhaltungsvereinbarung
  erscheinen ohne schriftliche Freigabe nie, auch nicht anonymisiert.
- KI-generierte Personen stellen nie echte Mitarbeiter, Kunden oder Bewertungen
  dar. Als Bildmotiv sind sie erlaubt, aber nicht mit Namen, Funktion oder Zitat.
- Inhalte aus dem Second Brain des Projektverantwortlichen sind intern. In dieses
  öffentliche Repository gelangt nur, was für die Website freigegeben ist.

Warnbeispiel: Das ältere Experiment `Sentrix-Code/SentrixCode` aus dem April 2026
enthält erfundene Angaben wie „Seit 2013“, „Frankfurt · München“ und Kundenlogos
großer Unternehmen. Aus diesem Experiment werden keine Inhalte übernommen.

## Kein AI-Slop

Im Wortlaut des Projektverantwortlichen: „such im Internet mal raus […] was alles
als AI-Slop grundsätzlich gilt, sowas wie zum Beispiel Bulletpunkte oder wie
Elemente angeordnet sind und so weiter. Dass du das auch in dieses
Website-Markdown reinschreibst, dass wir genau sowas nicht haben wollen.“

Die Website darf nicht nach einer generierten Standardseite aussehen oder klingen.
Die vollständige Recherche mit 54 Mustern und 15 Quellen, gelesen am 09.10.2026,
liegt in `docs/reference/ai-slop.md`. Prüfe jede neue Seite, jeden Abschnitt und
jeden Text gegen diese Liste. Die wichtigsten Verbote:

### Gestaltung

- Keine Standard-Seitenfolge aus zentriertem Hero, Logo-Leiste, drei identischen
  Feature-Karten, Testimonial und CTA. Jeder Abschnitt hat eine eigene Form, die aus
  seinem Inhalt folgt; das Vorbild mistral.ai bestimmt die Formen.
- Keine Reihe identischer Karten mit Icon, Zwei-Wort-Titel und Allerweltssatz.
- Keine lila-blauen Verläufe, keine Glow-Blobs und keine Verlaufsflecken als Deko,
  kein Glassmorphism ohne Funktion. Weichzeichnung bleibt der Kopfzeile vorbehalten,
  weil sie dort die Lesbarkeit sichert.
- Keine Großbuchstaben-Labels über jeder Überschrift, keine Meta-Zeilen der Form
  „A · B · C“, keine Nummern wie „01“ vor Inhalten, die keine Reihenfolge haben.
- Kein Pfeil an jedem Button. Pfeile oder Winkel stehen nur an Text-Links, die
  weiterführen.
- Keine einzelnen eingefärbten oder kursiven Akzentwörter in Überschriften.
- Keine Count-up-Zähler und keine großen Zahlen mit kleinem Label als Beweis.
- Nicht jeder Abschnitt blendet gleich ein. Jeder Abschnitt hat seine eigene
  Bewegung, die zu seinem Inhalt passt.
- Kein Licht und kein Leuchten, das dem Mauszeiger folgt. Erlaubt sind die leichte
  Parallaxe der Hero-Blöcke und die Neigung von Bildflächen als direkte Rückmeldung.
- Kein Scroll-Hijacking; geglättetes Scrollen ändert weder Richtung noch Tempo.

### Text

- Konkrete Nutzenaussagen statt Kategorie-Headlines wie „Die KI-gestützte Lösung
  für moderne Unternehmen“ und statt leerer Headlines wie „Gestalten Sie die
  Zukunft“.
- Keine Dreiklang-Slogans, keine Floskeln und Verstärker: „nahtlos“,
  „ganzheitlich“, „maßgeschneidert“, „innovativ“, „revolutionieren“, „auf das
  nächste Level“, „Gamechanger“, „In der heutigen Zeit“, „Darüber hinaus“, „Es ist
  wichtig zu beachten“, „Zusammenfassend“, „maßgeblich“, „entscheidend“; englisch
  „elevate“, „seamless“, „unlock“, „empower“, „leverage“, „delve“, „cutting-edge“.
- Keine Satzschablonen wie „Nicht nur …, sondern auch …“, „Ob X oder Y“ und
  „X zeichnet sich dadurch aus, dass …“.
- Sparsam mit Gedankenstrichen; ein Komma oder ein neuer Satz ist meist besser.
- Keine Listen mit fettem Stichwort und Doppelpunkt auf der Website und keine Emoji
  als Gliederung. Fließtext erklärt, Listen zählen nur echte Aufzählungen auf.
- Wechselnder Satzrhythmus, kurze und längere Sätze, gern mit Haltung. Englische
  Überschriften im Satzbau, nicht im Title Case.

### Bilder

- Ein durchgehender Bildstil (siehe „Bildsprache“); keine abweichend generierten
  Einzelbilder, keine gemischten Icon-Familien.
- Keine generischen 3D-Blobs, keine Plastik-Illustrationen, keine Stock-Menschen im
  perfekt beleuchteten Büro, keine Schrift und keine Fantasielogos im Bild.

## Unternehmensvision

### Das Unternehmen

| Angabe | Stand |
| --- | --- |
| Firma | Sentrix Code GmbH i. G. |
| Sitz und Anschrift | Krischerstraße 14, 40789 Monheim am Rhein |
| Geschäftsführer | Luca Finn Wiegand und Sven Fredrik Maibaum |
| Gesellschaftsvertrag | notariell beurkundet am 21.09.2026 |
| Handelsregister | Eintragung beim Amtsgericht Düsseldorf steht aus; Nummer folgt |
| Umsatzsteuer-Identifikationsnummer | noch nicht erteilt; folgt |

Bis zur Eintragung ins Handelsregister trägt die Firma in jedem rechtlichen
Zusammenhang den Zusatz „i. G.“ (in Gründung), etwa im Impressum, im Footer und in
der Datenschutzerklärung. Nach der Eintragung entfällt der Zusatz, und
Registergericht und Registernummer werden ergänzt.

### Ziel der Website

Im Wortlaut des Projektverantwortlichen: „Kunden für Auftragsentwicklung gewinnen,
seriöser Auftritt als GmbH.“

Daraus folgt: Erfolg der Website sind ernsthafte Anfragen über Kontaktformular oder
E-Mail. Jede Seite führt erkennbar zu einer Kontaktmöglichkeit.

### Leistungen

Sentrix Code bietet an:

1. Spieleentwicklung im Auftrag
2. Softwareentwicklung
3. App-Entwicklung
4. Machine Learning und Künstliche Intelligenz, einschließlich Beratung, wie
   Unternehmen KI besser einbinden

Wie die vier Bereiche gewichtet und auf der Website angeordnet werden, ist noch
offen. Im Wortlaut: „Müssen wir gucken, wie wir was unterbringen und diese
Bereiche hier.“

### Zielgruppe

Studios, Mittelstand und größere Unternehmen. Indie-Entwickler gehören zum Start zu
den Kunden, werden auf der Website aber nicht eigens angesprochen. Die Website
bleibt offen für jeden, wirkt aber in jedem Fall professionell.

### Sprachen

Die Website erscheint auf Deutsch und Englisch. Deutsch richtet sich vor allem an
den Mittelstand im deutschsprachigen Raum, Englisch an internationale Studios und
Unternehmen. Impressum und Datenschutzerklärung liegen mindestens auf Deutsch vor.

## Vorbild mistral.ai

Im Wortlaut des Projektverantwortlichen: „Orientierung oder halt voll abgucken von
hier: https://mistral.ai/ halt nur in unserem blau“. Die Website übernimmt Aufbau,
Stilrichtung und Wirkung von mistral.ai weitgehend, in den Farben von Sentrix Code.

Übernommen werden:

- Seitenaufbau und Reihenfolge der Abschnitte
- Layoutmuster wie Bento-Raster, abwechselnde Text-Bild-Zeilen, Kartenraster und
  Linkspalten im Fuß der Seite
- typografische Hierarchie, Weißraum und Rhythmus
- das Prinzip der Bildsprache: verspielte Motive im Pixel- beziehungsweise
  Voxel-Stil als Kontrast zu sachlichen Aussagen

Nicht übernommen werden Texte, Logos, Illustrationen, Fotos, Icons, Animationen,
Schriftdateien, Quellcode und Kundennachweise von Mistral. Alles davon entsteht für
Sentrix Code neu: Texte werden selbst geschrieben, Bilder generiert, wie im
Abschnitt „KI-Dienste und Bildgenerierung“ beschrieben. So bleibt die Website
rechtlich sauber und ist nicht mit Mistral zu verwechseln.

Abschnitte des Vorbilds, für die Sentrix Code noch keine belegten Inhalte hat, etwa
Kundenlogos und Fallstudien mit Kennzahlen, werden nicht mit erfundenen Inhalten
gefüllt. Sie entfallen oder werden durch ehrliche Inhalte ersetzt, etwa durch
Leistungen, Vorgehen oder Technologien.

Aufbau der Startseite von mistral.ai, gelesen am 09.10.2026:

1. Kopfzeile mit Logo, Mega-Menü (Research, Sovereign AI, Cloud, Customers,
   Company) sowie „Get in touch“ und „Login“
2. Hero mit einer einzigen starken Aussage und zwei Schaltflächen
3. Logo-Leiste von Kunden
4. Raster mit Begriffen zur Kernbotschaft
5. Positionierungssatz mit Sprungnavigation zu vier Bereichen
6. Vier Leistungszeilen im Wechsel von Text und Bild, jeweils nach dem Muster
   „Wir … Sie …“
7. Kundennachweise nach Branchen mit Kennzahl, Logo, Bild und Zitat
8. Drei Karten „Go deeper“
9. Linkspalten, Social-Media-Links, Sprachauswahl und Fuß mit Farbverlauf

Eine ausführliche Analyse mit Screenshots folgt als eigener Arbeitsschritt in
`docs/reference/mistral.md`. Die Screenshots selbst bleiben lokal unter
`.harness/notes/references/mistral/` und werden nicht eingecheckt.

## Markenauftritt

### Logo

Die Logo-Dateien liegen unter `brand/logo/`: der Schriftzug „sentrix code“ in einer
hellen und einer dunklen Fassung (`wordmark/`) sowie das Piktogramm in neun
Farbvarianten (`pictogram/`). Die Originale werden nicht verändert; Fassungen für
die Website werden davon abgeleitet.

Der Schriftzug verwendet die Schrift Bruno Ace und lädt sie per `@import` von
Google Fonts. Für die Website wird er in Pfade umgewandelt, damit er ohne externe
Schrift und ohne Verbindung zu Google korrekt erscheint. Bis dahin verwendet die
Website das Piktogramm.

### Farben

Die Farben stammen aus den Logo-Dateien:

| Name | Wert | Verwendung im Logo |
| --- | --- | --- |
| Akzentblau | `#0077B6` | „x“ im Schriftzug, Winkel, Akzent-Piktogramme |
| Tiefblau Schriftzug | `#023E8A` | Schriftzug in der hellen Fassung |
| Tiefblau Piktogramm | `#034078` | Piktogramm-Varianten „deep“ |
| Weiß | `#FFFFFF` | Schriftzug in der dunklen Fassung, helle Piktogramme |

Welches der beiden Tiefblau die maßgebliche Markenfarbe ist, ist offen. Weitere
Abstufungen für Hintergründe, Rahmen und Zustände werden aus diesen Farben
abgeleitet und hier festgehalten, bevor sie verwendet werden. Die Farben stehen als
Design-Tokens zentral in `src/app/globals.css`.

## Design-System

Im Wortlaut des Projektverantwortlichen: „leg dir auch gerne dann einen
Design-Style und so weiter fest und analysiere das wirklich in der Tiefe.“ Die
folgenden Werte sind aus der Referenzanalyse (`docs/reference/mistral.md`) und den
Logofarben abgeleitet und am 09.10.2026 festgelegt. Komponenten verwenden
ausschließlich diese Tokens; ein neuer Wert wird erst hier ergänzt und dann
verwendet.

### Grundcharakter

Dunkel, ruhig und präzise wie das Vorbild. Ein sichtbares Linienraster gibt
Ordnung. Farbe kommt fast nur aus Illustrationen, geometrischen Blöcken und
Akzenten in der Ozean-Palette. Verspielte Voxel- und Pixel-Momente setzen den
Kontrast zu sachlichen Aussagen.

### Farben

Die Markenfarben `#023E8A` und `#0077B6` gehören zur bekannten Ozean-Palette; deren
übrige Stufen bilden die Akzent- und Illustrationsskala.

| Token | Wert | Einsatz |
| --- | --- | --- |
| `base` | `#0B0F17` | Seitenhintergrund, leicht blau getöntes Dunkel |
| `surface` | `#121824` | Karten, Panels |
| `raised` | `#1A2231` | Hover-Flächen, Menüs |
| `line` | `#1E2737` | Linienraster, Trennlinien |
| `line-strong` | `#2B364A` | Rahmen von Bedienelementen |
| `fg` | `#F3F6FA` | Text |
| `muted` | `#8691A6` | Nebentext (Kontrast 6,3 : 1 auf `base`) |
| `ocean-950` | `#03045E` | tiefste Illustrationsstufe |
| `ocean-900` | `#023E8A` | Tiefblau aus dem Schriftzug |
| `ocean-700` | `#0077B6` | Akzentblau, Primärschaltfläche mit weißer Schrift (4,8 : 1) |
| `ocean-600` | `#0096C7` | Illustration, Verläufe |
| `ocean-500` | `#00B4D8` | Illustration, Leuchten |
| `ocean-400` | `#48CAE4` | Links und Akzenttext auf `base` (über 9 : 1), Fokusring |
| `ocean-300` | `#90E0EF` | Illustration, Glanzlichter |
| `ocean-100` | `#CAF0F8` | hellste Illustrationsstufe |
| `amber` | `#FFB703` | nur in Illustrationen, sparsam: Flammen, Licht, Funken |
| `success` | `#34D399` | nur Formularzustände |
| `danger` | `#F87171` | nur Formularzustände |

Fließtext steht nie in `ocean-700` auf `base`, weil der Kontrast dort unter 4,5 : 1
liegt. Die Tokens stehen unter denselben Namen in `src/app/globals.css`, die
Bewegungs-Tokens zusätzlich in `src/lib/motion.ts`.

### Typografie

Geist Sans für Überschriften und Fließtext, Geist Mono für technische Beschriftungen.
Beide werden über `next/font` beim Build geladen und selbst ausgeliefert. Die
eigene Schrift des Vorbilds wird nicht verwendet; Bruno Ace bleibt dem Schriftzug
des Logos vorbehalten.

| Stil | Desktop | Mobil | Gewicht | Laufweite |
| --- | --- | --- | --- | --- |
| `display` | 76 / 80 px | 44 / 48 px | 500 | −2 % |
| `h2-xl` | 56 / 60 px | 36 / 40 px | 500 | −1,5 % |
| `h2` | 44 / 52 px | 30 / 36 px | 500 | −1 % |
| `h3` | 30 / 36 px | 24 / 30 px | 500 | −1 % |
| `body-lg` | 18 / 28 px | 17 / 26 px | 400 | normal |
| `body` | 16 / 24 px | 16 / 24 px | 400 | normal |
| `small` | 14 / 20 px | 14 / 20 px | 400 | normal |
| `label` | 12 / 16 px, Geist Mono, Großbuchstaben | gleich | 500 | +8 % |

Überschriften sind kurz und gern zweiteilig mit paralleler Struktur.

### Raster, Abstände und Formen

- Grundeinheit 4 px; Abschnittsabstand 96 px auf dem Desktop, 64 px mobil.
- Inhaltsbreite höchstens 1280 px. Ab 1024 px rahmen zwei durchgehende vertikale
  Linien in `line` die Inhaltsspalte; horizontale Linien trennen Abschnitte.
- Radien: 6 px für Schaltflächen, Chips und Eingabefelder, 10 px für Karten und
  Panels, 18 px (`radius-device`) nur für Geräte-Mockups wie Smartphones. Rund nur
  für Statuspunkte.
- Gestaltet und geprüft wird von 360 px bis 1440 px Breite.

### Bildsprache

Im Wortlaut des Projektverantwortlichen: „Nutze gerne wirklich viel, viel mehr
Assets, also generierte Assets, Bilder und sonstiges, was du generierst. Die kannst
du ja auch sonstiges benutzen überall und wirklich näher an diese Mistral-Seite
ran.“

- Illustrationen sind 2D-Pixel-Art wie beim Vorbild, in der Ozean-Palette mit
  Bernstein `#FFB703` als sparsamem warmem Akzent nur in Illustrationen (Flammen,
  Licht, Funken). Jeder Abschnitt trägt Bildmaterial: Figuren auf den Hero-Blöcken,
  Pixel-Mosaik-Flächen mit lebendigen UI-Mockups in den Leistungen, Szenen im
  Vorgehen, Icons in den Prozess-Chips, Figuren in Praxis, FAQ, Kontakt und Fuß.
- Figuren und Icons werden auf Magenta erzeugt und freigestellt
  (`scripts/optimize-images.py sprite-key`), Szenen und Flächen als 16:9 erzeugt.
- Fotos und realistische Menschen kommen vorerst nicht vor. Bilder enthalten keine
  lesbare Schrift und keine Logos.
- Im Wortlaut: „nachdem du sie vielleicht gebaut hast, so eine Grafik, besonders
  sowas wie zum Beispiel eine Rakete oder so, kannst du sie auch wirklich danach
  nachträglich quasi im Code nachbauen. Dann kannst du sie ja sogar animieren.“
  Zentrale Figuren werden deshalb nach der Generierung mit
  `scripts/pixelize-sprite.py` in ihr Pixelraster zurückgerechnet und im Code in
  Ebenen gezeigt, damit Teile sich bewegen: die Flamme flackert, der Roboter
  blinzelt und sitzt im Fenster der Rakete. Neue Figuren mit Charakter folgen
  diesem Weg.

Entscheidungsweg am 09.10.2026: Im Stiltest war Codex bei Voxel-Art stärker,
Nano Banana Pro bei 2D-Pixel-Art. Nach der Vorgabe, näher an das Vorbild zu gehen,
gilt Pixel-Art; erstes Werkzeug ist Nano Banana Pro. Die Herkunft jedes verwendeten
Bildes steht in `docs/provenance.md`.

### Zustände

Jedes Bedienelement hat Standard, Hover, sichtbaren Fokus, gedrückt und deaktiviert.
Formulare haben zusätzlich Laden, Erfolg, Fehler und leer. Nicht zutreffende
Zustände werden als nicht zutreffend benannt.

## Bewegung

Im Wortlaut des Projektverantwortlichen: „Wir möchten auch extremst geile,
angenehme Motion Graphics haben. Es soll super fließend sein, es soll angenehm
sein zu bedienen, es soll Feedback geben, es soll lebendig wirken.“

### Grundsätze

1. **Jede Interaktion antwortet.** Hover, Druck, Fokus, Erfolg und Fehler haben eine
   sichtbare Reaktion, die innerhalb von 100 ms beginnt.
2. **Fließend statt hart.** Interaktive Bewegung folgt Federn statt starrer Kurven.
   Animiert werden nur `transform` und `opacity`, damit die Seite mit 60 Bildern pro
   Sekunde läuft.
3. **Lebendig durch Choreografie.** Der Hero hat eine Eröffnungssequenz, Inhalte
   erscheinen beim Scrollen gestaffelt, im Hintergrund gibt es langsame
   Dauerbewegung, und an ausgewählten Stellen gibt es kleine Überraschungen, etwa
   eine Figur, die beim Hover hervorschaut.
4. **Inhalt zuerst.** Text ist nach spätestens 600 ms lesbar. Keine Animation
   blockiert Lesen oder Bedienen. Das Scrollen wird geglättet, aber nie
   übernommen oder umgelenkt.
5. **Rücksicht.** Bei `prefers-reduced-motion` bleiben nur kurze Überblendungen;
   Dauerbewegung, Parallaxe und geglättetes Scrollen entfallen.

Im Fuß jeder Seite wählen Besucher zwischen „System“, „Voll“ und „Ruhig“. Die Wahl
wird im lokalen Speicher des Browsers abgelegt und gilt für alle Seiten. Eine gemeinsame
Einstellung (`src/components/motion/MotionPolicy.tsx`) steuert Motion, Lenis und die
CSS-Dauerbewegung; jede eigene Bewegung fragt sie über `useMotionPolicy()` ab.

Prüfe Bewegung immer auch in der vollen Fassung. Fordert der Rechner weniger
Bewegung an, etwa weil unter Windows die Animationseffekte ausgeschaltet sind,
zeigt der Zusatz `?motion=full` an der Adresse die vollständige Bewegung. Prüfe
Animationen nur in einem sichtbaren, aktiven Tab, weil der Browser sie in
Hintergrund-Tabs anhält.

### Tokens

| Token | Wert | Einsatz |
| --- | --- | --- |
| `duration-instant` | 100 ms | Druck-Feedback |
| `duration-fast` | 160 ms | Farbe, Rahmen, Hover |
| `duration-base` | 280 ms | Transform, Menüs |
| `duration-slow` | 560 ms | Einblendungen |
| `duration-hero` | 900–1400 ms | Hero-Eröffnung insgesamt |
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Farb- und Zustandswechsel |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Einblendungen |
| `spring-ui` | Steifigkeit 400, Dämpfung 30 | Schaltflächen, Karten, Menüs |
| `spring-playful` | Steifigkeit 260, Dämpfung 16 | landende Blöcke, Figuren |
| `stagger` | 60 ms | Listen, Chips, Karten |

### Katalog der Bewegungsmomente

Im Wortlaut des Projektverantwortlichen: „Liebe zum Detail […] wie links, die kleine
Katze bewegt sich […] oben bewegt sich ein kleiner Greifarm […] dass man damit
interagieren kann, wenn man mit der Maus hin und her zieht, dass das wirklich sich
mitbewegt, physikalisch“. Neue Momente passen in diesen Katalog und werden hier ergänzt.

| Ort | Moment |
| --- | --- |
| Hero | Blöcke fallen herein und lassen sich ziehen, werfen und federn zurück; die Drohne lässt Blöcke auf den rechten Turm fallen, nach dem dritten poppen sie mit Funken weg; ein Server-Turm taucht immer wieder hinter dem Stapel auf; der Roboter winkt und folgt dem Zeiger mit den Augen; das Logo in der Überschrift dreht sich alle paar Sekunden; Wolken, Funken und ein Satellit am Himmel; Scroll-Hinweis aus Pixel-Winkeln |
| Kopfzeile | Gleitender Hover-Balken, Mega-Menüs mit springenden Icons und überblendender Vorschaukarte |
| Prozess-Chips | Hängen an Fäden, schwingen leicht und lassen sich ziehen |
| Trennlinien | Biegen sich wie Gummibänder, wo der Zeiger vorbeistreift |
| Leistungen | Mockups mit Tipp-, Scroll- und Build-Animationen; Bildflächen neigen sich zum Zeiger |
| Praxis, Vorgehen | Tabs mit gleitender Markierung; Vorgehen schaltet sich mit Fortschrittsbalken selbst weiter |
| Begleiter | Kleiner Roboter unten rechts wechselt sein Werkzeug je Abschnitt; Klick schickt ihn weg |
| Kontakt | Rakete hebt beim Hover ab, Flamme brüllt; Papierflieger fliegt beim Absenden los |
| Fuß | Pixel-Logo steigt beim Scrollen aus den Ozeanbändern, der Roboter sitzt darin; ein zweiter läuft mit vier Bildern am Ufer entlang |
| Seitenwechsel | Pixel-Übergang in Ozeanblau |

### Technik

Motion (`motion`, ehemals Framer Motion) für Federn, Gesten, scrollgekoppelte
Animationen und Layout-Übergänge; Lenis für geglättetes Scrollen; CSS-Transitions
für einfache Farbwechsel. Eine weitere Animationsbibliothek kommt nur nach
Entscheidung des Projektverantwortlichen hinzu.

## Seitenstruktur

Im Wortlaut des Projektverantwortlichen: „überleg dir gerne noch weitere Konzepte, was
man da machen kann und vielleicht auch noch ein, zwei Unterwebseiten“ und „dass wir auch
schon im Impressum vollständig haben, auch vollständig designt schon, dass wir die
Datenschutzerklärung schon vollständig haben“.

| Seite | Deutsch | Englisch |
| --- | --- | --- |
| Startseite | `/` | `/en/` |
| Spieleentwicklung | `/leistungen/spieleentwicklung/` | `/en/services/game-development/` |
| Softwareentwicklung | `/leistungen/softwareentwicklung/` | `/en/services/software-development/` |
| App-Entwicklung | `/leistungen/app-entwicklung/` | `/en/services/app-development/` |
| KI & Machine Learning | `/leistungen/ki/` | `/en/services/ai/` |
| Über uns | `/ueber-uns/` | `/en/about/` |
| Kontakt | `/kontakt/` | `/en/contact/` |
| Impressum, Datenschutz | `/impressum/`, `/datenschutz/` | nur Deutsch |
| 404 | `app/global-not-found.tsx` | zweisprachig |

- Inhalte der Unterseiten stehen in `src/content/pages.de.ts` und `pages.en.ts`.
- Die Kopfzeile öffnet wie beim Vorbild Mega-Menüs für Leistungen und Unternehmen; der
  Fuß bietet Sprachwahl und Bewegungsschalter. Jede Seite kennt ihr Gegenstück in der
  anderen Sprache.
- Seitenwechsel zeigen einen kurzen Pixel-Übergang (`PixelTransition.tsx`, reines CSS),
  der für ruhige Bewegung entfällt.
- Die Pille „Neu gegründet in Monheim am Rhein“ im Hero ist entfernt. Im Wortlaut:
  „Das ist ja so ein typischer i-Slogan“ (gemeint: KI-Slogan). An ihrer Stelle steht ein Scroll-Hinweis.

## Feste Projektentscheidungen

Die folgenden Grundsatzentscheidungen bilden den festen Rahmen für die Website.
Sie gelten für jede Aufgabe und werden nur auf ausdrückliche Entscheidung des
Projektverantwortlichen geändert. Stößt eine Aufgabe an eine dieser Grenzen,
benenne den Konflikt und hole die Entscheidung ein. Umgehe eine Festlegung nicht
stillschweigend, schwäche sie nicht ab und ersetze sie nicht durch eine
Ausweichlösung, die ihren Zweck aushebelt.

- **Framework:** Next.js mit App Router, React und TypeScript, ausgeliefert als
  statischer Export (`output: "export"`). Jede Seite liegt als fertiges HTML vor.
  Funktionen, die einen Server brauchen, stehen nicht zur Verfügung, darunter
  Server Actions, Redirects, Rewrites, Header, Proxy und die Bildoptimierung mit
  dem Standard-Loader. Diese Next.js-Version weicht von älterem Wissen ab; lies vor
  Änderungen die passende Anleitung unter `node_modules/next/dist/docs/`.
- **Styling:** Tailwind CSS. Farben und weitere Gestaltungswerte werden als
  Design-Tokens zentral gepflegt und nicht als Einzelwerte im Code verstreut.
- **Hosting:** GitHub Pages, gebaut und veröffentlicht über GitHub Actions
  (`.github/workflows/deploy.yml`) bei jedem Push auf `main`. Später kommt die
  eigene Domain hinzu; welche der Domains `sentrixcode.com`, `sentrix-code.com`,
  `sentrixcode.de` und `sentrix-code.de` die Hauptdomain wird, ist offen.
- **Repository:** `maystudios/sentrix-code-website`, öffentlich. Deshalb gelangen
  keine Zugangsdaten, Schlüssel, `.env`-Dateien, internen Dokumente, Kunden- oder
  Vertragsdaten und keine Inhalte aus dem Second Brain ins Repository. Prüf- und
  Laufartefakte liegen unter `.harness/runs/` und werden nicht eingecheckt.
- **Versionsverwaltung:** Git mit dem Hauptzweig `main`. Weil jeder Push auf `main`
  sofort veröffentlicht wird, baut `main` immer und ist jederzeit vorzeigbar. Fasse
  Arbeit in kleine, in sich geschlossene Commits mit verständlicher Beschreibung.
  Agenten committen und pushen abgeschlossene und geprüfte Arbeitsschritte
  selbstständig mit dem GitHub-Konto, das auf dem jeweiligen Rechner angemeldet
  ist. Sie melden sich nicht als anderer Benutzer an und verändern keine
  Zugangsdaten. Unfertiges oder Ungeprüftes wird nicht auf `main` gepusht.
- **Vor dem Start nicht auffindbar:** Bis zur Veröffentlichung unter der eigenen
  Domain tragen alle Seiten `noindex`, damit Suchmaschinen den Zwischenstand nicht
  aufnehmen.

Festgelegt vom Projektverantwortlichen am 09.10.2026. Installiert waren an diesem
Tag Next.js 16.4.0 und React 19.3.0.

## KI-Dienste und Bildgenerierung

Im Wortlaut des Projektverantwortlichen: „Da darf auch reingeschrieben werden, dass
Geld ausgegeben werden darf.“ Die Werkzeugtabelle ist auf seinen Wunsch aus der
ParkIt-GDD übernommen und auf die Website angepasst.

| Werkzeug | Wofür | Zugang |
| --- | --- | --- |
| Codex mit GPT-6.1 Sol oder GPT-6 Luna | Bauen, Prüfen, Bilder erzeugen und bearbeiten, Browser steuern | Codex CLI |
| `gen` (Skill `gen-media`) | Bilder über die Abos: Google Flow mit Nano Banana Pro, 2.1 und 2 Lite sowie Codex, mit Warteschlange und Herkunftsdateien | lokales Werkzeug unter `C:\Development\Apps\3D Pipeline`, nur auf Svens Rechner |
| Google Flow | Nano Banana für Bilder, Omni für Videos | Abo, über Browsersteuerung |
| Gemini-Schnittstelle | Nano Banana und Nano Banana Pro für Bilder, Omni für Videos, Lyria für Musik, TTS für Sprache | Schlüssel `GEMINI_API_KEY` in der lokalen `.env` |
| ElevenLabs | Bevorzugt für Sound Effects, zusätzlich für Musik | Schlüssel `ELEVENLABS_API_KEY` in der lokalen `.env`; globaler Skill `elevenlabs-audio` |
| Antigravity mit Gemini | Videos ansehen und auf Fehler prüfen | Antigravity CLI |

Die Tabelle pflegt der Projektverantwortliche. Was nicht darin steht, nutzen Agenten
nicht. Agenten dürfen die freigegebenen Dienste ohne feste Obergrenze nutzen; sie
halten den Verbrauch in `docs/provenance.md` und im Arbeitsbericht fest. Für Bilder nehmen
sie zuerst `gen`, weil es über die Abos läuft. Ist ein Dienst sowohl im Abo als auch
über eine bezahlte Schnittstelle erreichbar, nehmen sie für einzelne Bilder und
Videos zuerst das Abo. Die
Schnittstelle nutzen sie für viele Erzeugungen am Stück oder wenn der Browser
gerade belegt ist.

Die lokale `.env` stammt aus dem ParkIt-Projekt. Ihr Inhalt wird nie angezeigt,
nie eingecheckt und in keinem Prompt oder Bericht wiederholt. Die Skripte unter
`scripts/` lesen Schlüssel zuerst aus dieser `.env`, weil die Umgebung des Rechners
einen Schlüssel eines anderen Google-Projekts mit eigenem Ausgabenlimit enthalten
kann.

Regeln für die Browsersteuerung:

- Der Agent steuert den Browser über die Chrome-Erweiterung oder über Codex. Er
  arbeitet im angemeldeten Chrome des Projektverantwortlichen in einem eigenen Tab.
- Anmelden muss sich immer ein Mensch. Der Agent tippt nie ein Passwort ein.
- Er ändert nichts am Konto, kauft kein Guthaben und schließt kein Upgrade ab;
  dazu gehört auch das Ausgabenlimit einer Schnittstelle.
- Es steuert immer nur ein Agent gleichzeitig den Browser.
- Klappt die Website nach zwei oder drei Versuchen nicht, nimmt er einen anderen
  Weg, etwa über die Schnittstelle, und setzt das Motiv auf eine Liste für später.

### Bildgenerierung aktiv nutzen

- **Platzhalter mit echten Motiven:** Fehlen Inhalte, werden Bilder generiert,
  damit die Website von Anfang an verständlich ist. Wird eine Person gebraucht,
  wird eine Person generiert; soll ein Bereich im Voxel-Stil erscheinen, entstehen
  Voxel-Bilder; ebenso geometrische Formen, Hintergründe und Motive für Leistungen.
  Auch die Assets im Stil des Vorbilds werden so erzeugt.
- **Ideen sammeln:** Für Gestaltungsfragen generieren Agenten bewusst viele
  Varianten, etwa zehn Entwürfe für einen Abschnitt, und greifen die besten Ideen
  auf. Ideenbilder bleiben lokal unter `.harness/runs/`; ins Repository kommt nur,
  was die Website verwendet.
- **Dienste vergleichen:** Für wichtige Motive wird derselbe Auftrag mit Codex und
  mit Gemini (Nano Banana) oder Google Flow erzeugt. Die Wahl wird mit Grund
  festgehalten.
- **Erst ein kleiner Stiltest:** Bevor viele Bilder einer Art entstehen, werden zwei
  oder drei erzeugt und auf der Seite in ihrer Umgebung geprüft. Erst wenn der Stil
  passt, folgt der Rest.
- **Bauen und Prüfen getrennt:** Ein anderes Modell als das erzeugende vergleicht
  das Ergebnis mit Auftrag und Vorbild, entscheidet über bestanden oder nicht
  bestanden und nennt konkrete Korrekturen. Erst danach schaut ein Mensch darauf.
- **Herkunft festhalten:** Für jedes verwendete generierte Bild stehen Werkzeug,
  Modell, Prompt, Vorlage, Datum und gewählte Variante in `docs/provenance.md`.

### Kennzeichnung

Im Wortlaut: „Auch wenn wir wissen, dass die noch gekennzeichnet werden müssten,
rein theoretisch, ist okay. Wir können trotzdem erst mal Bilder generieren, dass
wir auch erst mal sowas Richtiges als Platzhalter haben, um das Ganze zu
verstehen.“

Während der Entwicklung dienen generierte Bilder deshalb ungekennzeichnet als
Platzhalter. Vor der Veröffentlichung unter der eigenen Domain wird jedes
generierte Bild entweder ersetzt oder nach der dann geltenden Rechtslage
gekennzeichnet. Grundlage dafür ist `docs/provenance.md`.

## Rechtliches

Diese Vorgaben ersetzen keine Rechtsberatung. Vor der Veröffentlichung unter der
eigenen Domain prüft der Projektverantwortliche die Rechtstexte.

- **Impressum** nach § 5 Digitale-Dienste-Gesetz mit Firma samt Zusatz „i. G.“,
  Anschrift, beiden Geschäftsführern, E-Mail-Adresse und einem zweiten schnellen
  Kontaktweg, Stand der Handelsregistereintragung sowie der
  Umsatzsteuer-Identifikationsnummer, sobald sie erteilt ist.
- **Kontakt:** Der Projektverantwortliche liefert zwei bis drei E-Mail-Adressen und
  bei Bedarf eine Telefonnummer. Dazu kommt ein funktionierendes Kontaktformular.
  Weil die Website statisch ausgeliefert wird, braucht das Formular einen externen
  Dienst; seine Auswahl ist offen und muss zum Datenschutz passen.
- **Datenschutzerklärung** mindestens zum Hosting bei GitHub Pages einschließlich
  der Server-Logs, zum Kontaktformular-Dienst und zur Kontaktaufnahme per E-Mail.
- **Keine Drittanbieter zur Laufzeit:** Die Website lädt im Browser nichts von
  Google Fonts, Content Delivery Networks, Analyse- oder Marketingdiensten,
  solange der Projektverantwortliche das nicht ausdrücklich entscheidet. Schriften
  werden selbst ausgeliefert; `next/font` lädt sie beim Build und erfüllt das.
  Ziel ist eine Website, die keinen Cookie-Banner braucht.

## Offene Punkte

- Welches Tiefblau ist die maßgebliche Markenfarbe: `#023E8A` oder `#034078`?
- Schriftzug in Pfade umwandeln.
- Zwei bis drei Kontakt-E-Mail-Adressen, bei Bedarf eine Telefonnummer.
- Dienst für das Kontaktformular.
- Hauptdomain und DNS-Einrichtung für GitHub Pages.
- Alle als Beispiel markierten Inhalte in `src/content/` ersetzen, bestätigen oder
  entfernen: Fallbeispiele mit Zitaten, FAQ-Antworten, „Antwort innerhalb eines
  Werktags“, „Das erste Gespräch kostet Sie nichts“, Etappen alle zwei Wochen und
  Python in der Technologieleiste.
- Website-Prinzipien in Rangfolge, jeweils mit „Deshalb“ und „Deshalb nicht“.
- Tonalität bestätigen: Die Texte sprechen Besucher derzeit mit „Sie“ an.
- URL-Struktur bestätigen: Deutsch unter `/`, Englisch unter `/en/`, Rechtstexte
  nur auf Deutsch.
- Darstellung des Teams: echte Fotos, Rollen und Werdegang.
- Ob und welche eigenen Produkte die Website zeigt.
- Noch zu erarbeitende Abschnitte: Code-Standard, Ordnerstruktur und Benennung;
  Performance, SEO und Barrierefreiheit; Tests und „Fertig heißt fertig“;
  Arbeitsweise der Agenten einschließlich Aufräumen und paralleler Läufe.
