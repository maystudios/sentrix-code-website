import { pagesDe } from "./pages.de";
import type { Dictionary } from "./types";

// Copy rules: WEBSITE.md, "Wahrheit vor Wirkung" and "Kein AI-Slop".
// Everything with `example: true` is invented and needs replacing before launch.
export const de: Dictionary = {
  locale: "de",
  pages: pagesDe,
  meta: {
    title: "Sentrix Code · Spiele, Software, Apps und KI im Auftrag",
    description:
      "Sentrix Code entwickelt Software, Apps und KI für den Mittelstand und Spiele im Auftrag. Sitz in Monheim am Rhein.",
  },
  anchors: { services: "leistungen", cases: "praxis", process: "vorgehen", faq: "fragen", contact: "kontakt" },
  nav: {
    services: "Leistungen",
    cases: "Praxis",
    process: "Vorgehen",
    contact: "Kontakt",
    cta: "Projekt anfragen",
    menu: "Menü",
    close: "Schließen",
    switchLanguage: { label: "English version", href: "/en/", short: "EN" },
  },
  hero: {
    headlineA: "Software und KI",
    headlineB: "für den Mittelstand.",
    subline:
      "Wir bauen Anwendungen, Apps und KI-Assistenten für Ihre Abläufe, binden sie an ERP und Shop an und halten sie sicher und aktuell.",
    primaryCta: "Projekt anfragen",
    secondaryCta: "Leistungen ansehen",
  },
  tech: {
    // EXAMPLE: Python ist vom Projektverantwortlichen noch nicht bestätigt.
    label: "Womit wir arbeiten",
    items: ["Unreal Engine", "C++", "Flutter", "React", "Next.js", "TypeScript", "Java", "Python"],
  },
  statement: {
    title: "Ein Team. Von der Idee bis zum Release.",
    chips: [
      { label: "Gameplay", icon: "gamepad", muted: true },
      { label: "Idee", icon: "idea" },
      { label: "Konzept", icon: "concept" },
      { label: "Prototyp", icon: "prototype" },
      { label: "Design", icon: "design" },
      { label: "Schnittstellen", icon: "chip", muted: true },
      { label: "KI-Integration", icon: "robot", muted: true },
      { label: "Entwicklung", icon: "code" },
      { label: "Tests", icon: "test" },
      { label: "Wartung", icon: "server", muted: true },
      { label: "Release", icon: "rocket" },
      { label: "App-Stores", icon: "phone", muted: true },
    ],
  },
  engine: {
    title: "Wir haben uns eine eigene Werkstatt gebaut.",
    text: "Ein KI-Abo kann heute jeder kaufen. Den Unterschied macht, was drumherum steht. Wir haben uns über die Zeit eine eigene Infrastruktur aufgebaut, mit Agenten, Prüfregeln und Rechenkapazität, die nur für unsere Projekte arbeiten. Jede Aufgabe läuft darin durch feste Stationen, und am Ende nimmt einer von uns das Ergebnis ab. Für Sie heißt das: schneller fertig, ohne an der Qualität zu sparen.",
    task: "Shop-Aufträge ins ERP",
    done: "Freigegeben",
    stations: [
      { label: "Entwurf", note: "Zwei Agenten, zwei Lösungen, die bessere gewinnt", icon: "concept" },
      { label: "Tests", note: "Erst rot, dann grün", icon: "test" },
      { label: "Gegenprüfung", note: "Ein zweiter Agent sucht Fehler und Lücken", icon: "chip" },
      { label: "Dokumentation", note: "Für alle, die später weiterarbeiten", icon: "code" },
      { label: "Abnahme", note: "Einer von uns gibt frei", icon: "rocket" },
    ],
    example: true,
  },
  positioning:
    "Auch der Mittelstand hat gute Software verdient. Seit KI mitarbeitet, entscheidet Software darüber, wer mithält. Sie müssen dafür kein Entwickler werden. Sie brauchen einen Partner, der sie baut, sicher hält und weiterdenkt.",
  services: {
    title: "Was wir für Sie bauen.",
    items: [
      {
        id: "software",
        visual: "software",
        nav: "Softwareentwicklung",
        title: "Schluss mit Excel-Listen, die nur eine Person versteht.",
        text: "Wir bauen Anwendungen und Portale für Ihre Abläufe und binden sie an ERP, Warenwirtschaft oder Shop an. Bestehende Software prüfen wir im Code-Audit, und nach dem Start halten wir alles sicher und auf Stand.",
        cta: "Erzählen Sie uns, welcher Ablauf hakt",
        imageAlt: "Code-Editor mit einem Deploy-Plan und Server auf einem blauen Pixel-Mosaik",
      },
      {
        id: "apps",
        visual: "apps",
        nav: "App-Entwicklung",
        title: "Ihr Team ist unterwegs. Ihre Software sollte es auch sein.",
        text: "Apps für iOS und Android aus einer Codebasis mit Flutter, für Ihre Kunden oder Ihre Leute im Außendienst und in der Werkstatt. Wir bringen sie in den App Store und zu Google Play und pflegen sie danach weiter.",
        cta: "App-Idee besprechen",
        imageAlt: "Smartphone mit App-Karten und Benachrichtigungen auf einem blauen Pixel-Mosaik",
      },
      {
        id: "ki",
        visual: "ai",
        nav: "KI & Machine Learning",
        title: "Wo KI Ihrem Team schon heute Stunden spart, und wo nicht.",
        text: "Wir prüfen mit Ihnen, welche Aufgaben sich für KI eignen, und bauen sie in Ihre Systeme ein. Von Assistenten für Kunden und Team bis zur Auswertung von Angeboten, Dokumenten und Daten.",
        cta: "Herausfinden, wo KI hilft",
        imageAlt: "KI-Chat mit Beispielaufgaben, Roboter und Drohne auf einem blauen Pixel-Mosaik",
      },
      {
        id: "workshops",
        visual: "workshop",
        nav: "Workshops",
        title: "Ein Tag, nach dem Ihr Team KI sicher nutzt.",
        text: "Wir kommen zu Ihnen oder schalten uns remote dazu und arbeiten mit Ihren echten Aufgaben: was KI heute kann, wie man sie datenschutzkonform einsetzt und wo sie bei Ihnen zuerst Zeit spart. Für Geschäftsführung, Fachabteilungen oder Entwickler.",
        cta: "Workshop anfragen",
        imageAlt: "Workshop-Tafel mit Tagesordnung, abgehakten Punkten und einer Haftnotiz auf einem blauen Pixel-Mosaik",
      },
      {
        id: "spiele",
        visual: "game",
        nav: "Spieleentwicklung",
        title: "Aus Ihrer Spielidee wird etwas, das man spielen kann.",
        text: "Wir entwickeln Spiele und Prototypen im Auftrag, vor allem mit Unreal Engine und C++. Von der ersten Mechanik bis zum Build, den Sie Spielern und Publishern zeigen können.",
        cta: "Spielprojekt besprechen",
        imageAlt: "Pixel-Illustration: Sticker mit Gamepad, Schatzkiste, Levelkarte und Spielfigur auf einer dunklen Tafel",
      },
    ],
    mockups: {
      codeFile: "plan.ts",
      code: [
        ["const ", "projekt", " = await ", "sentrix", ".plan({"],
        ["  ziel: ", "\"Ihre Prozesse\"", ","],
        ["  anbindung: [", "\"ERP\", \"Shop\"", "],"],
        ["  tests: ", "true", ","],
        ["});"],
        ["await ", "projekt", ".deploy();"],
      ],
      buildPassed: "Build erfolgreich",
      appNotes: ["Neue Nachricht", "Update installiert"],
      workshop: {
        title: "KI im Betrieb",
        agenda: ["Was KI heute kann", "Sicher und datenschutzkonform", "Ihre Aufgaben, live ausprobiert", "Die ersten drei Schritte"],
        note: "Angebote von der KI vorsortieren lassen!",
      },
      aiPrompts: [
        "Fasse die Kundenanfragen dieser Woche zusammen",
        "Finde Auffälligkeiten in den Produktionsdaten",
        "Beantworte Standardfragen im Support",
      ],
      example: true,
    },
    apps: {
      title: "Apps aus unserem Team",
      items: [
        { name: "SplitUp", text: "Ausgaben in der Gruppe fair teilen: Belege scannen, Salden im Blick.", icon: "/images/work/apps/splitup-icon.webp", screen: "/images/work/apps/splitup-screen.webp", screenAlt: "SplitUp: Gruppe „Lisbon Trip“ mit Gesamtausgaben, Salden und letzten Zahlungen", note: "Cara hat 18,40 € für Tapas eingetragen." },
        { name: "FamFlow", text: "Der Familienplaner: gemeinsamer Kalender, Autos, Aufgaben und Pinnwand.", screen: "/images/work/apps/famflow-screen.webp", screenAlt: "FamFlow: Übersicht einer Familie mit offenen Aufgaben, Autoreservierungen und Mitgliedern", note: "Das Auto ist morgen ab 8 Uhr für dich reserviert." },
        { name: "Shapes", text: "Schiebepuzzle: Formen verschieben, den Ausgang finden. Acht Stufen, kein Timer.", icon: "/images/work/apps/shapes-icon.webp", screen: "/images/work/apps/shapes-screen.webp", screenAlt: "Shapes: Startbildschirm mit Level 1 und Play-Knopf", note: "Stufe 2 ist freigeschaltet." },
        { name: "Tiles", text: "Logikrätsel mit 1000 geprüften Leveln: ein Juwel pro Farbe, Zeile und Spalte.", icon: "/images/work/apps/tiles-icon.webp", screen: "/images/work/apps/tiles-screen.webp", screenAlt: "Tiles: Level 210, ein farbiges Raster mit den Regeln darüber", note: "Das Tagesrätsel wartet: Level 211." },
        { name: "Wake Up", text: "Ein Wecker, der erst verstummt, wenn du den QR-Code an der Wand scannst." },
      ],
    },
  },
  cases: {
    title: "Wie aus einer Aufgabe ein Produkt wird.",
    cta: "Ähnliches Projekt anfragen",
    items: [
      {
        tab: "Heistline",
        client: "Emotions-Gaming, unabhängiges Studio aus Deutschland",
        title: "Heistline: Polizei gegen Kriminelle, gespielt von echten Menschen.",
        text: "Heistline ist ein Heist-MMO: Die einen planen Ausbrüche und Überfälle, die anderen jagen sie, im Koop und gegeneinander. Wir haben an der Entwicklung mitgearbeitet. Das Spiel ist kostenlos spielbar und auf Steam angekündigt.",
        icon: "gamepad",
        kind: "game",
        reference: {
          facts: ["Multiplayer: Koop und PvP", "Free to Play", "Steam, Windows", "Deutsch und Englisch"],
          image: { src: "/images/work/heistline-vault.webp", alt: "Szene aus Heistline: Ein maskierter Räuber stapelt Geld im Tresorraum, hinter der offenen Tresortür kommt ein Komplize", width: 1600, height: 517 },
          links: [
            { label: "Heistline auf Steam", href: "https://store.steampowered.com/app/3613860/Heistline/" },
            { label: "heistline.de", href: "https://heistline.de/" },
          ],
        },
      },
      {
        tab: "Mr. Dork 3",
        client: "MayStudios und Simsalabim Studio",
        title: "Mr. Dork 3: ein Jump'n'Run auf Notizpapier.",
        text: "Mr. Dork 3: One Last Doodle ist ein 2D-Plattformer mit Rätseln, gebaut mit der Unreal Engine. Eine Strichfigur springt über Lineale und Bleistifte: 30 Level, Koop für zwei, Battles im Splitscreen und endlose Level. Das Spiel ist auf Steam angekündigt, weitere Plattformen folgen.",
        icon: "gamepad",
        kind: "game",
        reference: {
          facts: ["Unreal Engine", "Koop und Splitscreen", "30 Level", "Steam, Windows"],
          image: { src: "/images/work/mrdork3-level.webp", alt: "Level aus Mr. Dork 3: Eine Strichfigur springt über Lineale und Bleistifte auf liniertem Papier zur Zielflagge", width: 1600, height: 900 },
          links: [
            { label: "Mr. Dork 3 auf Steam", href: "https://store.steampowered.com/app/3274870/Mr_Dork_3_One_Last_Doodle/" },
            { label: "mrdork3.com", href: "https://mrdork3.com/" },
          ],
        },
      },
      {
        tab: "Mittelstand",
        kind: "software",
        client: "Maschinenbauer aus dem Bergischen Land",
        title: "Ein Kundenportal ersetzt Excel-Listen und Rückfragen am Telefon.",
        text: "Aufträge, Lieferzeiten und Ersatzteile lagen in drei Systemen. Wir haben ein Portal gebaut, das die Daten aus dem ERP holt und Kunden den Stand ihrer Bestellung selbst zeigt.",
        quote: "Unser Vertrieb spricht mit Kunden wieder über neue Maschinen statt über Liefertermine.",
        role: "Geschäftsführer, Maschinenbau",
        icon: "server",
        example: true,
      },
      {
        tab: "Apps",
        kind: "apps",
        client: "Fitnessstudio-Kette mit zwölf Standorten",
        title: "Kurse buchen mit zwei Fingertipps statt am Tresen.",
        text: "Die Kette wollte eine eigene App statt einer fremden Buchungsplattform. Wir haben sie mit Flutter für iOS und Android gebaut und an die bestehende Mitgliederverwaltung angebunden.",
        quote: "Die meisten Buchungen kommen inzwischen über die App, und am Tresen bleibt wieder Zeit für Beratung.",
        role: "Leitung Digitales, Fitnessstudio-Kette",
        icon: "phone",
        example: true,
      },
      {
        tab: "KI",
        kind: "ai",
        client: "Onlinehändler für Ersatzteile",
        title: "Ein KI-Assistent beantwortet die Standardfragen im Kundenservice.",
        text: "Viele Anfragen drehten sich um Passform und Lieferung. Unser Assistent antwortet aus Produktdaten und Handbüchern und gibt schwierige Fälle mit allen Angaben an das Team weiter.",
        quote: "Das Team kümmert sich jetzt um die Fälle, bei denen es wirklich gebraucht wird.",
        role: "Leitung Kundenservice, Onlinehandel",
        icon: "chip",
        example: true,
      },
    ],
  },
  process: {
    title: "So arbeiten wir.",
    prototype: { live: "Live", build: "Build läuft", thanks: "Danke!", revenue: "Umsatz", play: "Automatischen Wechsel fortsetzen", pause: "Automatischen Wechsel anhalten" },
    intro: "Sie sehen Zwischenergebnisse und entscheiden mit, was als Nächstes kommt.",
    steps: [
      {
        title: "Kennenlernen",
        text: "Sie erzählen uns von Ihrem Vorhaben, wir stellen die Fragen, die über Umfang und Technik entscheiden. Das erste Gespräch kostet Sie nichts.",
        scene: "/images/scenes/meet",
        sceneAlt: "Das Produkt ist noch eine Skizze auf Papier, daneben eine Glühbirne.",
        example: true,
      },
      {
        title: "Konzept und Angebot",
        text: "Sie bekommen einen klaren Umfang, einen Zeitplan und ein nachvollziehbares Angebot. Ist die Idee noch unsicher, beginnen wir mit einem kleinen Prototyp.",
        scene: "/images/scenes/concept",
        sceneAlt: "Aus der Skizze wird ein graues Wireframe mit Platzhaltern.",
      },
      {
        title: "Entwicklung in Etappen",
        text: "Wir arbeiten in kurzen Etappen. Alle zwei Wochen sehen Sie einen lauffähigen Stand und können mitentscheiden, was als Nächstes kommt.",
        scene: "/images/scenes/build",
        sceneAlt: "Das Wireframe füllt sich mit Farbe und Inhalten, der Roboter programmiert daneben.",
        example: true,
      },
      {
        title: "Start und Übergabe",
        text: "Wir bringen das Produkt live, übergeben Code und Dokumentation und bleiben auf Wunsch Ihr Partner für die nächsten Versionen.",
        scene: "/images/scenes/launch",
        sceneAlt: "Das fertige Produkt leuchtet auf, daneben steigt der Umsatz in Balken.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen.",
    more: {
      title: "Ihre Frage ist nicht dabei?",
      text: "Schreiben Sie uns. Wir antworten persönlich, nicht mit einem Textbaustein.",
      cta: "Frage stellen",
    },
    items: [
      {
        question: "Was kostet ein Projekt?",
        answer:
          "Das hängt vom Umfang ab. Nach dem ersten Gespräch bekommen Sie ein Angebot, entweder mit festem Umfang oder als Stundenkontingent. Ein Prototyp braucht oft wenige Wochen, größere Vorhaben planen wir in Etappen.",
        example: true,
      },
      {
        question: "Wie schnell können Sie anfangen?",
        answer: "Meist innerhalb von zwei Wochen nach der Beauftragung. Wenn es eilt, sagen Sie es uns gleich im ersten Gespräch.",
        example: true,
      },
      {
        question: "Arbeiten Sie auch mit unserem bestehenden Code oder Team?",
        answer:
          "Ja. Wir steigen in laufende Projekte ein, übernehmen einzelne Module oder arbeiten mit Ihrem Team im selben Repository.",
        example: true,
      },
      {
        question: "Wem gehören Code und Rechte am Ende?",
        answer:
          "Ihnen. Nach vollständiger Bezahlung gehen die Rechte am entwickelten Code auf Sie über, so wie es im Vertrag steht.",
        example: true,
      },
      {
        question: "Arbeiten Sie nur in der Region?",
        answer:
          "Nein. Unser Sitz ist in Monheim am Rhein, wir arbeiten mit Kunden in ganz Deutschland und im Ausland. Zu Workshops kommen wir gern vorbei.",
        example: true,
      },
      {
        question: "Setzen Sie selbst KI in der Entwicklung ein?",
        answer:
          "Ja, gezielt. KI-Werkzeuge übernehmen bei uns Routinearbeit und helfen beim Testen. Über Architektur und Qualität entscheiden Menschen, und jede Änderung wird geprüft.",
        example: true,
      },
    ],
  },
  contact: {
    title: "Erzählen Sie uns von Ihrem Projekt.",
    text: "Ein paar Sätze zu Ihrer Idee genügen. Wir melden uns mit einer ersten Einschätzung und einem Terminvorschlag.",
    emailLabel: "E-Mail",
    email: "contact@sentrixcode.com",
    missingEmail: "[OFFEN: Kontakt-E-Mail-Adresse]",
    button: "E-Mail schreiben",
    toForm: "Zum Kontaktformular",
    promise: { text: "Antwort innerhalb eines Werktags", example: true },
  },
  footer: {
    columns: [
      {
        title: "Leistungen",
        links: [
          { label: "Spieleentwicklung", href: "/#spiele" },
          { label: "Softwareentwicklung", href: "/#software" },
          { label: "App-Entwicklung", href: "/#apps" },
          { label: "KI & Machine Learning", href: "/#ki" },
          { label: "Workshops", href: "/#workshops" },
        ],
      },
      {
        title: "Unternehmen",
        links: [
          { label: "Praxis", href: "/#praxis" },
          { label: "Vorgehen", href: "/#vorgehen" },
          { label: "Häufige Fragen", href: "/#fragen" },
          { label: "Kontakt", href: "/#kontakt" },
        ],
      },
      {
        title: "Rechtliches",
        links: [
          { label: "Impressum", href: "/impressum/" },
          { label: "Datenschutz", href: "/datenschutz/" },
        ],
      },
    ],
    company: "Sentrix Code GmbH",
    tagline: "Spiele, Software, Apps und KI im Auftrag. Aus Monheim am Rhein.",
  },
  consent: {
    settingsLink: "Datenschutz-Einstellungen",
    banner: {
      title: "Ihre Privatsphäre",
      text: "Wir nutzen nur, was diese Website zum Funktionieren braucht. Optionale Dienste laden wir erst, wenn Sie zustimmen. Ihre Wahl können Sie jederzeit unter „Datenschutz-Einstellungen“ im Fußbereich ändern.",
      accept: "Alle akzeptieren",
      reject: "Alle ablehnen",
      settings: "Einstellungen",
    },
    dialog: {
      title: "Datenschutz-Einstellungen",
      intro: "Diese Website setzt keine Cookies. Sie speichert nur Einstellungen, die Sie selbst wählen, im lokalen Speicher Ihres Browsers. Für optionale Dienste fragen wir Sie vorher.",
      always: "Immer aktiv",
      none: "Derzeit nutzen wir keinen Dienst dieser Art.",
      save: "Auswahl speichern",
      acceptAll: "Alle akzeptieren",
      rejectAll: "Alle ablehnen",
      close: "Schließen",
      saved: "Ihre Auswahl vom",
      privacy: "Datenschutzerklärung",
      imprint: "Impressum",
      categories: {
        necessary: {
          title: "Notwendig",
          text: "Speichert Ihre Einstellung für Animationen, ob Sie den kleinen Begleiter für diese Sitzung ausgeblendet haben, und diese Auswahl. Keine Cookies; die Angaben verlassen Ihr Gerät nicht.",
        },
        statistics: {
          title: "Statistik",
          text: "Zeigt uns, welche Seiten wie oft besucht werden, damit wir die Website verbessern können.",
        },
        media: {
          title: "Externe Medien",
          text: "Inhalte anderer Plattformen, etwa Videos oder Spiele-Trailer. Beim Laden erhält der jeweilige Anbieter Ihre IP-Adresse.",
        },
      },
    },
  },
};
