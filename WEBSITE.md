# Sentrix Code Website – Spezifikation

## Zweck und Geltung

Diese Datei hält die gemeinsam festgelegten Vorgaben für die Website der
Sentrix Code GmbH i. G. fest: was die Website erreichen soll, welche
Grundsatzentscheidungen gelten und wie Agenten an ihr arbeiten. Sie ist die
verbindliche Grundlage für alle Arbeiten an der Website. Die `AGENTS.md` und die
`CLAUDE.md` verweisen auf sie.

Agenten lesen vor Projektarbeit die Abschnitte bis einschließlich „Arbeitsweise der
Agenten“ und danach nur die Abschnitte, die ihre Aufgabe berührt.

Die Datei enthält Entscheidungen und Regeln, nicht den Stand der Umsetzung. Was sich
aus dem Code ablesen lässt, etwa Token-Werte, Komponenten und umgesetzte Animationen,
steht nur dort. So bleibt die Datei kurz und läuft nicht vom Code weg.

Vom Projektverantwortlichen formulierte Punkte werden in seinem Wortlaut festgehalten.
Projektverantwortlicher ist Sven Maibaum; er trifft die Entscheidungen zur Website.
Agenten passen diese Datei nicht selbstständig an ihre Umsetzung an. Widerspricht eine
Aufgabe dieser Datei, benenne den Widerspruch und hole die Entscheidung ein.

Punkte mit dem Zusatz *(Vorschlag)* hat ein Agent formuliert; sie gelten erst, wenn
der Projektverantwortliche sie bestätigt hat. Bis dahin baut kein Agent auf ihnen
auf, ohne das in seiner Meldung zu nennen.

Das Repository ist öffentlich. Alles, was hier eingecheckt wird, kann jeder lesen;
die Folgen regelt der Abschnitt „Feste Projektentscheidungen“.

## Wahrheit vor Wirkung

Die veröffentlichte Website wirkt professionell, aber ausschließlich durch belegte
Inhalte. Diese Regel steht über allen anderen Vorgaben dieser Datei.

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
  markiert (`example: true` beziehungsweise Kommentar `// EXAMPLE`). Vor dem Start
  der Website (siehe „Feste Projektentscheidungen“) ist jeder solche Inhalt ersetzt,
  vom Projektverantwortlichen bestätigt oder entfernt.
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
- Was nicht geprüft wurde, wird als ungeprüft gemeldet. Ermittle Versionen, Zustände
  und Ergebnisse, statt sie anzunehmen.

Warnbeispiel: Das ältere Experiment `Sentrix-Code/SentrixCode` aus dem April 2026
enthält erfundene Angaben wie „Seit 2013“, „Frankfurt · München“ und Kundenlogos
großer Unternehmen. Aus diesem Experiment werden keine Inhalte übernommen.

## Arbeitsweise der Agenten

### Leitsatz

Der Projektverantwortliche am 15.11.2026:

> „dass wir ohne Fremdreview arbeiten möchten und dass wir mit dem Leitsatz arbeiten
> möchten: Minimal token usage at best possible quality. Am besten immer ohne
> Subagents und proaktiver mit dem Nutzer zusammen. Das heißt immer eine Editierung
> oder du arbeitest etwas ab, was der Nutzer gesagt hat.“
>
> „Aber immer nur in kleinen Teilen, sodass wir halt gleichzeitig mit drüber gucken
> können. Und das Review in dem Moment der Nutzer macht.“

Daraus folgt die Arbeitsschleife für jede Aufgabe an der Website:

1. **Verstehen:** Suche die betroffene Stelle gezielt und lies nur, was der Schritt
   braucht. Ändert eine offene Frage das Ergebnis, stelle genau diese eine Frage;
   sonst entscheide selbst und nenne die Annahme in einem Satz.
2. **Ein Schritt:** Setze eine Editierung um, also eine Änderung, die der
   Projektverantwortliche auf einen Blick prüfen kann. Einen größeren Wunsch zerlegst
   du in eine kurze Schrittliste; umgesetzt wird immer nur der nächste Schritt.
3. **Selbst prüfen:** wie unter „Prüfen vor dem Zeigen“.
4. **Zeigen:** Melde in zwei bis vier Sätzen, was sich geändert hat, wo es zu sehen
   ist und was geprüft wurde. Diese Meldung ist der Arbeitsbericht.
5. **Review abwarten:** Der Projektverantwortliche schaut im Browser drüber und
   bestätigt, korrigiert oder verwirft. Erst danach folgt der nächste Schritt.

Für die Schleife gilt:

- **Direkt arbeiten:** Die Sitzung, die den Auftrag erhält, erledigt ihn selbst. Sie
  startet keine Hilfsagenten, kein zweites Modell und keine fremde Prüfung. Eine
  Ausnahme gilt nur, wenn der Projektverantwortliche sie für eine Aufgabe ausdrücklich
  verlangt.
- **Proaktiv mitarbeiten:** Jede Meldung nennt höchstens einen konkreten Vorschlag
  für den nächsten Schritt. Fällt außerhalb des Schritts etwas auf, etwa ein Fehler,
  ein Widerspruch zu dieser Datei oder eine bessere Lösung, sag es in einem Satz,
  statt es ungefragt mitzuändern oder zu verschweigen.
- **Spielraum nutzen:** Im Wortlaut: „Dass wir ein bisschen mehr Spielraum lassen“.
  Diese Datei setzt den Rahmen aus Ziel, festen Entscheidungen und Verboten. Innerhalb
  davon entscheidet der Agent Gestaltung und Umsetzung selbst und richtet sich nach
  dem Ziel der Website. Passt eine Regel erkennbar nicht auf einen Fall, benenne das
  und schlage eine Lösung vor, statt die Regel zu dehnen oder blind zu befolgen.
- **Befehl:** `/edit-website <Wunsch>` startet diese Schleife. Die Anweisungen dazu
  stehen in `commands/edit-website.md`.

### Prüfen vor dem Zeigen

Der Agent prüft so viel, wie der Schritt verlangt, und nicht mehr.

- **Code geändert:** `npm run lint` und `npx tsc --noEmit` laufen ohne Fehler.
- **Layout, Bewegung oder Bedienung geändert:** Sieh die Stelle einmal im echten
  Browser an, bei 360 px und bei 1440 px Breite und ohne Fehler in der Konsole. Für
  Bewegung gelten die Hinweise im Abschnitt „Bewegung“. Reine Text- und
  Wertänderungen brauchen keinen Screenshot.
- **Entwicklungsserver:** Läuft bereits einer auf Port 3000, nutze ihn. Er gehört
  dem Projektverantwortlichen und wird weder beendet noch neu gestartet.
- **Vor dem Push:** `npm run build` läuft durch, weil jeder Push veröffentlicht.
- **Ehrlich melden:** Übersprungene Prüfungen stehen als übersprungen in der Meldung.

### Sparsam arbeiten

Ziel ist das bestmögliche Ergebnis bei möglichst geringem Verbrauch an Tokens, Zeit
und Geld. Gespart wird am Weg, nie an der Qualität des Ergebnisses.

- **Gezielt lesen:** Erst suchen, dann den Ausschnitt lesen. Große Dateien werden
  über Überschriften und Suche erschlossen, nicht vollständig geladen.
- **Nichts doppelt holen:** Was in der Sitzung bereits gelesen, recherchiert oder
  erzeugt ist, wird wiederverwendet, solange es gültig ist.
- **Kleine Ausgaben:** Rufe Befehle so auf, dass nur das Nötige zurückkommt. Ein
  Screenshot zeigt die betroffene Stelle in der kleinsten Größe, die die Frage
  beantwortet.
- **Keine Dokumente auf Vorrat:** Plan-, Analyse- und Berichtsdateien entstehen nur,
  wenn der Projektverantwortliche sie verlangt.
- **Ansatz wechseln statt wiederholen:** Scheitert derselbe Weg zweimal, suche die
  Ursache eine Ebene höher, etwa im Verständnis der Aufgabe oder im Werkzeug, oder
  frag nach, statt weitere Versuche zu starten.
- **Kurz berichten:** Erst das Ergebnis, dann Belege und Offenes, ohne den Arbeitsweg
  nachzuerzählen.

### Workflow Harness

Das Workflow Harness (`C:\Users\conta\harness-workflow` auf Svens Rechner,
`C:\DevTools\harnesses\harness-workflow` auf Lucas Rechner) ist in diesem Projekt
nicht der Regelfall, weil es Arbeit an Hilfsagenten verteilt und unabhängig prüfen
lässt. Es läuft nur, wenn der Projektverantwortliche es für eine Aufgabe ausdrücklich
verlangt, dann im Modus `efficient`.

### Sprache

Das Gespräch mit dem Projektverantwortlichen ist deutsch. Code, Bezeichner,
Kommentare, Commit-Beschreibungen und Agenten-Artefakte sind englisch. Was Besucher
sehen, ist deutsch und englisch. Deutsche Texte verwenden korrekte Umlaute und ß.

### Zugangsdaten

Schlüssel, Tokens und Passwörter liegen nur lokal in der `.env`. Agenten zeigen sie
nie an, kopieren sie nicht in Prompts, Logs, Meldungen oder versionierte Dateien und
übergeben sie nicht auf der Kommandozeile. Die lokale `.env` stammt aus dem
ParkIt-Projekt. Die Skripte unter `scripts/` lesen Schlüssel zuerst aus ihr, weil die
Umgebung des Rechners einen Schlüssel eines anderen Google-Projekts mit eigenem
Ausgabenlimit enthalten kann.

### Mehrere Agenten gleichzeitig

In der Regel arbeitet eine Sitzung an der Website. Laufen doch mehrere, stören sie
sich nicht gegenseitig.

- **Fremde Änderungen bleiben:** Änderungen im Arbeitsverzeichnis, die nicht aus der
  eigenen Sitzung stammen, werden weder committet noch zurückgesetzt noch
  umformatiert. Ein Commit enthält nur die Dateien des eigenen Schritts.
- **Fremde Prozesse bleiben:** Kein Agent beendet Prozesse, die er nicht selbst
  gestartet hat. Ein eigener Entwicklungsserver läuft auf einem anderen Port als 3000
  und wird am Ende beendet.
- **Ein Browser, ein Agent:** Es steuert immer nur ein Agent gleichzeitig den Browser.

### Projekt sauber halten

- **Ablage:** Hilfsdateien, Screenshots und Ideenbilder liegen von Anfang an unter
  `.harness/runs/`, das nicht eingecheckt wird, nie im Projektstamm oder zwischen dem
  Code.
- **Skripte:** Skripte, die Inhalte erzeugen oder verändern, sind deren
  reproduzierbare Quelle und bleiben versioniert unter `scripts/`. Wegwerfskripte,
  Zwischenstände und Duplikate werden entfernt.
- **Nur Eigenes aufräumen:** Dateien des Projektverantwortlichen oder anderer
  Sitzungen werden nicht gelöscht. Vermutlich Überflüssiges wird in der Meldung
  genannt, und der Projektverantwortliche entscheidet.

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
- **Hosting:** Die Website zieht auf einen eigenen Server bei Hetzner, beschlossen am
  18.11.2026. Im Wortlaut: „Also bei Hetzner würden wir sowas wie einen V-Server oder
  auch einen Dedicated Server am ehesten wahrscheinlich am Ende haben. Irgendwas mit
  Ubuntu zum Beispiel. Das Ganze ein bisschen selbst übernehmen.“ Bis zum Umzug läuft
  sie auf GitHub Pages, gebaut und veröffentlicht über GitHub Actions
  (`.github/workflows/deploy.yml`) bei jedem Push auf `main`, seit dem 10.10.2026
  unter `https://sentrixcode.com`.
- **Repository:** `maystudios/sentrix-code-website`, öffentlich. Deshalb gelangen
  keine Zugangsdaten, Schlüssel, `.env`-Dateien, internen Dokumente, Kunden- oder
  Vertragsdaten und keine Inhalte aus dem Second Brain ins Repository.
- **Versionsverwaltung:** Git mit dem Hauptzweig `main`. Weil jeder Push auf `main`
  sofort veröffentlicht wird, baut `main` immer und ist jederzeit vorzeigbar. Fasse
  Arbeit in kleine, in sich geschlossene Commits mit verständlicher Beschreibung.
  Agenten committen und pushen abgeschlossene und geprüfte Arbeitsschritte
  selbstständig mit dem GitHub-Konto, das auf dem jeweiligen Rechner angemeldet
  ist. Sie melden sich nicht als anderer Benutzer an und verändern keine
  Zugangsdaten. Unfertiges oder Ungeprüftes wird nicht auf `main` gepusht. Geprüft
  heißt seit dem 15.11.2026: Der Projektverantwortliche hat den Schritt im Review
  bestätigt. *(Vorschlag)*
- **Vor dem Start nicht auffindbar:** Bis zum Start tragen alle Seiten `noindex`,
  damit Suchmaschinen den Zwischenstand nicht aufnehmen. Start ist der Zeitpunkt, zu
  dem der Projektverantwortliche `noindex` entfernen lässt. *(Vorschlag)*
- **Gemeinsame Anweisungen:** Befehle für Agenten haben einen kanonischen
  Anweisungssatz unter `commands/` und dünne Host-Wrapper, derzeit unter
  `.claude/commands/`.
- **Bauen bei der ersten Nutzung:** Werkzeuge, Tests und Abstraktionen entstehen,
  wenn sie zum ersten Mal wirklich gebraucht werden, nicht auf Vorrat.

Festgelegt vom Projektverantwortlichen am 09.10.2026. Installiert waren an diesem
Tag Next.js 16.4.0 und React 19.3.0; `package.json` legt am 15.11.2026 dieselben
Versionen fest.

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

Die Kundenlogos des Vorbilds haben kein Gegenstück, weil die Website keine fremden
Logos zeigt. Fallstudien und Kennzahlen erscheinen bis zum Start nur als markierte
Beispielinhalte nach „Wahrheit vor Wirkung“.

Die Analyse des Vorbilds, gelesen am 09.10.2026, liegt in `docs/reference/mistral.md`.
Die Screenshots dazu bleiben lokal unter `.harness/notes/references/mistral/` und
werden nicht eingecheckt.

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
- Keine Slogan-Pillen. Die Pille „Neu gegründet in Monheim am Rhein“ im Hero ist
  deshalb entfernt. Im Wortlaut: „Das ist ja so ein typischer i-Slogan“ (gemeint:
  KI-Slogan).

### Bilder

- Ein durchgehender Bildstil (siehe „Bildsprache“); keine abweichend generierten
  Einzelbilder, keine gemischten Icon-Familien.
- Keine generischen 3D-Blobs, keine Plastik-Illustrationen, keine Stock-Menschen im
  perfekt beleuchteten Büro, keine Schrift und keine Fantasielogos im Bild.

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

Welches der beiden Tiefblau die maßgebliche Markenfarbe ist, ist offen.

## Design-System

Im Wortlaut des Projektverantwortlichen: „leg dir auch gerne dann einen
Design-Style und so weiter fest und analysiere das wirklich in der Tiefe.“ Das
Design-System ist aus der Referenzanalyse (`docs/reference/mistral.md`) und den
Logofarben abgeleitet und am 09.10.2026 festgelegt.

### Grundcharakter

Dunkel, ruhig und präzise wie das Vorbild. Ein sichtbares Linienraster gibt
Ordnung. Farbe kommt fast nur aus Illustrationen, geometrischen Blöcken und
Akzenten in der Ozean-Palette. Verspielte Voxel- und Pixel-Momente setzen den
Kontrast zu sachlichen Aussagen.

### Tokens

Maßgeblich für alle Werte ist der Code: Farben, Radien, Kurven und Schriftstile
stehen in `src/app/globals.css`, Dauern, Federn und Staffelung in
`src/lib/motion.ts`. Diese Datei wiederholt die Werte nicht, weil zwei Stellen
auseinanderlaufen. *(Vorschlag)* Komponenten verwenden ausschließlich Tokens. Ein
neuer Token braucht einen Grund und wird in der Meldung genannt.

Für den Einsatz der Tokens gilt:

- **Ozean-Palette:** Die Markenfarben `#023E8A` und `#0077B6` gehören zur bekannten
  Ozean-Palette; ihre Stufen `ocean-950` bis `ocean-100` bilden die Akzent- und
  Illustrationsskala.
- **Akzente:** `ocean-700` ist die Primärschaltfläche mit weißer Schrift.
  `ocean-400` trägt Links, Akzenttext und den Fokusring auf `base`.
- **Kontrast:** Text erreicht mindestens 4,5 : 1 zum Hintergrund. Fließtext steht
  deshalb nie in `ocean-700` auf `base`.
- **Bernstein:** `#FFB703` kommt nur in Illustrationen vor, sparsam als warmer
  Akzent für Flammen, Licht und Funken.
- **Zustandsfarben:** `success` und `danger` stehen nur für Formularzustände.

### Typografie

Geist Sans für Überschriften und Fließtext, Geist Mono für technische Beschriftungen.
Beide werden über `next/font` beim Build geladen und selbst ausgeliefert. Die
eigene Schrift des Vorbilds wird nicht verwendet; Bruno Ace bleibt dem Schriftzug
des Logos vorbehalten. Die Schriftstile `text-display` bis `text-label` stehen in
`src/app/globals.css`. Überschriften sind kurz und gern zweiteilig mit paralleler
Struktur.

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

- **Stil:** Illustrationen sind 2D-Pixel-Art wie beim Vorbild, in der Ozean-Palette
  mit Bernstein als sparsamem Akzent. Jeder Abschnitt trägt Bildmaterial. Erstes
  Werkzeug ist Nano Banana Pro, das im Stiltest am 09.10.2026 bei 2D-Pixel-Art
  stärker war als Codex.
- **Keine Fotos:** Fotos und realistische Menschen kommen vorerst nicht vor. Bilder
  enthalten keine lesbare Schrift und keine Logos.
- **Erst generieren, dann nachbauen, dann animieren:** Im Wortlaut vom 10.10.2026:
  „generier dir ein Foto und dann bau es nach […] Einfach pixel-perfect einmal
  nachbauen und danach kannst du es ja wirklich animieren.“ Figuren, Requisiten und
  Icons werden auf Magenta erzeugt, mit den Skripten unter `scripts/pixel-art/`
  pixelgenau als Raster nachgebaut und im Code in Ebenen gezeigt, damit Teile sich
  bewegen. Sie werden nie frei Hand gezeichnet und nicht auf ein gröberes Raster
  heruntergerechnet; passt die Rastergröße nicht, wird neu erzeugt.
- **Szenen und Flächen:** Sie entstehen im Format 16:9 und werden mit
  `scripts/optimize-images.py` für die Website aufbereitet.
- **Herkunft:** Die Herkunft jedes verwendeten Bildes steht in `docs/provenance.md`.

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
3. **Lebendig durch Choreografie.** Der Hero hat eine Eröffnungssequenz von
   insgesamt 900 bis 1400 ms, Inhalte erscheinen beim Scrollen gestaffelt, im
   Hintergrund gibt es langsame Dauerbewegung, und an ausgewählten Stellen gibt es
   kleine Überraschungen, etwa eine Figur, die beim Hover hervorschaut.
4. **Inhalt zuerst.** Text ist nach spätestens 600 ms lesbar. Keine Animation
   blockiert Lesen oder Bedienen. Das Scrollen wird geglättet, aber nie
   übernommen oder umgelenkt.
5. **Rücksicht.** Bei `prefers-reduced-motion` bleiben nur kurze Überblendungen;
   Dauerbewegung, Parallaxe und geglättetes Scrollen entfallen.

### Liebe zum Detail

Im Wortlaut des Projektverantwortlichen: „Liebe zum Detail […] wie links, die kleine
Katze bewegt sich […] oben bewegt sich ein kleiner Greifarm […] dass man damit
interagieren kann, wenn man mit der Maus hin und her zieht, dass das wirklich sich
mitbewegt, physikalisch“.

Jeder Abschnitt hat deshalb eigene kleine Bewegungsmomente, die auf Zeiger, Ziehen
und Scrollen physikalisch reagieren. Welche Momente es gibt, zeigt der Code unter
`src/components/`; diese Datei listet sie nicht auf.

### Bewegungsschalter und Prüfung

Im Fuß jeder Seite wählen Besucher zwischen „System“, „Voll“ und „Ruhig“. Die Wahl
wird im lokalen Speicher des Browsers abgelegt und gilt für alle Seiten. Eine
gemeinsame Einstellung (`src/components/motion/MotionPolicy.tsx`) steuert Motion,
Lenis und die CSS-Dauerbewegung; jede eigene Bewegung fragt sie über
`useMotionPolicy()` ab.

Prüfe Bewegung immer auch in der vollen Fassung. Fordert der Rechner weniger
Bewegung an, etwa weil unter Windows die Animationseffekte ausgeschaltet sind,
zeigt der Zusatz `?motion=full` an der Adresse die vollständige Bewegung. Prüfe
Animationen nur in einem sichtbaren, aktiven Tab, weil der Browser sie in
Hintergrund-Tabs anhält.

### Technik

Motion (`motion`, ehemals Framer Motion) für Federn, Gesten, scrollgekoppelte
Animationen und Layout-Übergänge; Lenis für geglättetes Scrollen; CSS-Transitions
für einfache Farbwechsel. Eine weitere Animationsbibliothek kommt nur nach
Entscheidung des Projektverantwortlichen hinzu.

## Seitenstruktur

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

- **Inhalte:** Texte stehen getrennt nach Sprache in `src/content/`. Jede Seite kennt
  ihr Gegenstück in der anderen Sprache; eine Textänderung erfolgt in beiden
  Sprachen.
- **Navigation:** Die Kopfzeile öffnet wie beim Vorbild Mega-Menüs für Leistungen und
  Unternehmen. Der Fuß bietet Sprachwahl und Bewegungsschalter.
- **Seitenwechsel:** Ein kurzer Pixel-Übergang, der für ruhige Bewegung entfällt.

## Kleine Verantwortlichkeiten und begründete Abstraktionen

Für den Code der Website gilt die praktische Anwendung von SRP (Single
Responsibility Principle), DRY (Don't Repeat Yourself) und KISS (Keep It Simple).

- **Eine klare Zuständigkeit:** Jede Komponente und jedes Modul hat einen
  beschreibbaren Verantwortungsbereich. Fasse zusammen, was aus denselben Gründen
  geändert wird, und trenne, was unabhängige Änderungsgründe hat.
- **Eine Regel, eine Stelle:** Dieselbe Regel, Berechnung oder Einstellung wird an
  genau einer Stelle gepflegt. Beispiele aus diesem Projekt: Texte in
  `src/content/`, Gestaltungswerte als Tokens, die Bewegungseinstellung in
  `MotionPolicy.tsx`, einwilligungspflichtige Dienste in `src/lib/consent.ts`.
- **Abstraktionen brauchen einen Grund:** Neue Schichten, Hilfsmodule und
  Abhängigkeiten entstehen nur für ein konkretes Problem. Nenne in der Meldung,
  welches Problem sie lösen und warum es einfacher nicht geht.
- **Vorhandenes vor Eigenbau:** Nutze Funktionen von Next.js, React, Tailwind und
  Motion sowie vorhandene Bausteine unter `src/components/ui/`, bevor Eigenes
  entsteht.
- **Klare Namen:** Technische Namen sind englisch und eindeutig. Derselbe Begriff
  heißt projektweit gleich.
- **Fehler sichtbar machen:** Fehlerpfade zeigen eine verständliche Meldung mit dem
  nächsten Schritt; Fehler werden nicht still verschluckt.
- **Kein Pauschalumbau:** Vereinfachungen erfolgen im beauftragten Umfang. Diese
  Grundsätze erlauben keinen ungefragten Umbau bestehenden Codes.

## Tests: erst rot, dann grün

Die Website hat keine Unit-Tests. Maschinell geprüft wird mit `npm run lint`,
`npx tsc --noEmit`, `npm run build` und den Browser-Prüfungen unter `scripts/qa/`,
die mit Playwright gegen den Entwicklungsserver laufen.

- **Erst rot, dann grün:** Ändert ein Schritt Verhalten mit Regeln, etwa
  Einwilligung, Formular, Physik oder Navigation, oder behebt er einen Fehler, zählt
  eine Prüfung erst als Nachweis, wenn sie zuvor aus dem fachlichen Grund
  fehlgeschlagen ist und danach besteht. Sie gehört nach `scripts/qa/`.
- **Sichtbares prüft der Mensch:** Für Gestaltung, Text und Bewegung ist das Review
  des Projektverantwortlichen der Nachweis; dafür entstehen keine Tests auf Vorrat.
- **Nichts passend machen:** Ändere keine Erwartungen oder Grenzwerte, nur um einen
  Lauf grün zu machen.
- **Keine bezahlten Dienste in Prüfungen:** Generatoren und Schnittstellen werden nur
  in ausdrücklichen Läufen aufgerufen.
- **Ehrlich auswerten:** Übersprungene oder abgebrochene Prüfungen sind kein Erfolg.

## Fertig heißt fertig

Ein Schritt gilt erst als fertig, wenn alle zutreffenden Punkte erfüllt sind.

1. Er setzt um, was der Projektverantwortliche verlangt hat, und nicht mehr.
2. Die Prüfungen aus „Prüfen vor dem Zeigen“ sind gelaufen; Übersprungenes ist
   genannt.
3. Geändertes Verhalten mit Regeln ist erst rot, dann grün nachgewiesen.
4. Die Vorgaben der berührten Abschnitte sind eingehalten, vor allem „Wahrheit vor
   Wirkung“ und „Kein AI-Slop“; erfundene Inhalte sind markiert.
5. Deutsch und Englisch sind beide angepasst.
6. Keine Zugangsdaten in Code, Logs, Meldungen oder versionierten Dateien; die
   Herkunft generierter und fremder Inhalte steht in `docs/provenance.md`.
7. Der Projektverantwortliche hat den Schritt gesehen und bestätigt. Eine
   unabhängige Prüfung durch einen anderen Agenten oder ein anderes Modell entfällt
   nach seiner Entscheidung vom 15.11.2026.
8. Alles, was die Arbeit vorübergehend angelegt hat, ist aufgeräumt.

## KI-Dienste und Bildgenerierung

Im Wortlaut des Projektverantwortlichen: „Da darf auch reingeschrieben werden, dass
Geld ausgegeben werden darf.“ Die Werkzeugtabelle ist auf seinen Wunsch aus der
ParkIt-GDD übernommen und auf die Website angepasst.

| Werkzeug | Wofür | Zugang |
| --- | --- | --- |
| `gen` (Skill `gen-media`) | Bilder über die Abos: Google Flow mit Nano Banana Pro, 2.1 und 2 Lite sowie Codex, mit Warteschlange und Herkunftsdateien | lokales Werkzeug unter `C:\Development\Apps\3D Pipeline`, nur auf Svens Rechner |
| Google Flow | Nano Banana für Bilder, Omni für Videos | Abo, über Browsersteuerung |
| Gemini-Schnittstelle | Nano Banana und Nano Banana Pro für Bilder, Omni für Videos, Lyria für Musik, TTS für Sprache | Schlüssel `GEMINI_API_KEY` in der lokalen `.env` |
| ElevenLabs | Bevorzugt für Sound Effects, zusätzlich für Musik | Schlüssel `ELEVENLABS_API_KEY` in der lokalen `.env`; globaler Skill `elevenlabs-audio` |
| Codex | Bilder erzeugen und bearbeiten | Codex CLI |
| Antigravity mit Gemini | Videos ansehen und auf Fehler prüfen | Antigravity CLI |

Die Tabelle pflegt der Projektverantwortliche. Was nicht darin steht, nutzen Agenten
nicht. Die Dienste erzeugen Inhalte und werten sie aus; als Hilfsagenten oder als
Prüfer von Arbeitsschritten setzt sie kein Agent ein, außer der Projektverantwortliche
verlangt es (siehe „Leitsatz“). Agenten dürfen die freigegebenen Dienste ohne feste
Obergrenze nutzen; sie halten Verbrauch und Kosten in `docs/provenance.md` und in der
Meldung fest. Für Bilder nehmen sie zuerst `gen`, weil es über die Abos läuft. Ist
ein Dienst im Abo und über eine bezahlte Schnittstelle erreichbar, nehmen sie für
einzelne Bilder und Videos zuerst das Abo. Die Schnittstelle nutzen sie für viele
Erzeugungen am Stück oder wenn der Browser gerade belegt ist.

### Browsersteuerung

- Der Agent steuert den Browser über die Chrome-Erweiterung oder über Codex. Er
  arbeitet im angemeldeten Chrome des Projektverantwortlichen in einem eigenen Tab.
- Anmelden muss sich immer ein Mensch. Der Agent tippt nie ein Passwort ein.
- Er ändert nichts am Konto, kauft kein Guthaben und schließt kein Upgrade ab;
  dazu gehört auch das Ausgabenlimit einer Schnittstelle.
- Klappt die Website nach zwei oder drei Versuchen nicht, nimmt er einen anderen
  Weg, etwa über die Schnittstelle, und setzt das Motiv auf eine Liste für später.

### Bildgenerierung aktiv nutzen

- **Platzhalter mit echten Motiven:** Fehlen Inhalte, werden Bilder generiert,
  damit die Website von Anfang an verständlich ist.
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
- **Selbst vergleichen, dann zeigen:** Der Agent vergleicht ein erzeugtes Bild mit
  Auftrag und Vorbild, bevor er es einbaut. Die Entscheidung trifft der
  Projektverantwortliche im Review.
- **Herkunft festhalten:** Für jedes verwendete generierte Bild stehen Werkzeug,
  Modell, Prompt, Vorlage, Datum und gewählte Variante in `docs/provenance.md`.

### Kennzeichnung

Im Wortlaut: „Auch wenn wir wissen, dass die noch gekennzeichnet werden müssten,
rein theoretisch, ist okay. Wir können trotzdem erst mal Bilder generieren, dass
wir auch erst mal sowas Richtiges als Platzhalter haben, um das Ganze zu
verstehen.“

Während der Entwicklung dienen generierte Bilder deshalb ungekennzeichnet als
Platzhalter. Vor dem Start wird jedes generierte Bild entweder ersetzt oder nach der
dann geltenden Rechtslage gekennzeichnet. Grundlage dafür ist `docs/provenance.md`.

## Rechtliches

Diese Vorgaben ersetzen keine Rechtsberatung. Vor dem Start prüft der
Projektverantwortliche die Rechtstexte.

- **Impressum** nach § 5 Digitale-Dienste-Gesetz mit Firma samt Zusatz „i. G.“,
  Anschrift, beiden Geschäftsführern, E-Mail-Adresse und einem zweiten schnellen
  Kontaktweg, Stand der Handelsregistereintragung sowie der
  Umsatzsteuer-Identifikationsnummer, sobald sie erteilt ist.
- **Kontakt:** Die Kontaktadresse der Website ist `contact@sentrixcode.com`. Dazu
  kommt ein funktionierendes Kontaktformular. Weil die Website statisch
  ausgeliefert wird, braucht das Formular einen externen Dienst; seine Auswahl ist
  offen und muss zum Datenschutz passen.
- **Datenschutzerklärung** mindestens zum Hosting (bis zum Umzug GitHub Pages, danach
  Hetzner) einschließlich der Server-Logs, zum Kontaktformular-Dienst und zur
  Kontaktaufnahme per E-Mail.
- **Keine Drittanbieter zur Laufzeit:** Die Website lädt im Browser nichts von
  Google Fonts, Content Delivery Networks, Analyse- oder Marketingdiensten,
  solange der Projektverantwortliche das nicht ausdrücklich entscheidet. Schriften
  werden selbst ausgeliefert; `next/font` lädt sie beim Build und erfüllt das.
  Ziel ist eine Website, die keinen Cookie-Banner braucht.
- **Einwilligung:** Kommt nach einer solchen Entscheidung ein optionaler Dienst
  hinzu, wird er in `src/lib/consent.ts` eingetragen und lädt erst nach
  Einwilligung. Ohne eingetragenen Dienst erscheint kein Banner.
- **Lizenzen:** Herkunft und Lizenz generierter und fremder Inhalte stehen in
  `docs/provenance.md`.

## Offene Punkte

- Bestätigen oder streichen: die Punkte mit *(Vorschlag)* zu Commit und Push nach
  dem Review, zum Start der Website und zu den Tokens im Code.
- Wann startet die Website, wird also `noindex` entfernt?
- Umzug zu Hetzner: Servertyp (virtueller oder dedizierter Server) und Termin.
- Welches Tiefblau ist die maßgebliche Markenfarbe: `#023E8A` oder `#034078`?
- Schriftzug in Pfade umwandeln.
- Weitere Kontaktadressen neben `contact@sentrixcode.com` und bei Bedarf eine
  Telefonnummer.
- Dienst für das Kontaktformular.
- Alle als Beispiel markierten Inhalte in `src/content/` ersetzen, bestätigen oder
  entfernen: Fallbeispiele mit Zitaten, FAQ-Antworten, „Antwort innerhalb eines
  Werktags“, „Das erste Gespräch kostet Sie nichts“, Etappen alle zwei Wochen und
  Python in der Technologieleiste.
- Website-Prinzipien in Rangfolge, jeweils mit „Deshalb“ und „Deshalb nicht“.
- Gewichtung und Anordnung der vier Leistungsbereiche.
- Tonalität bestätigen: Die Texte sprechen Besucher derzeit mit „Sie“ an.
- URL-Struktur bestätigen: Deutsch unter `/`, Englisch unter `/en/`, Rechtstexte
  nur auf Deutsch.
- Darstellung des Teams: echte Fotos, Rollen und Werdegang.
- Ob und welche eigenen Produkte die Website zeigt.
- Noch zu erarbeitender Abschnitt: Performance, SEO und Barrierefreiheit.
