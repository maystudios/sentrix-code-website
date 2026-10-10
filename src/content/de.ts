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
      "Sentrix Code entwickelt Spiele, Software, Apps und KI-Lösungen im Auftrag für Studios, Mittelstand und Unternehmen. Sitz in Monheim am Rhein.",
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
    headlineA: "Ihre Idee.",
    headlineB: "Unser Code.",
    subline:
      "Wir entwickeln Spiele, Software, Apps und KI im Auftrag. Für Studios und Unternehmen, die ein konkretes Vorhaben umsetzen wollen.",
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
  positioning:
    "Wir entwickeln im Auftrag. Vom ersten Prototyp bis zur Anwendung, die Ihre Nutzer jeden Tag verwenden.",
  services: {
    title: "Was möchten Sie entwickeln?",
    items: [
      {
        id: "spiele",
        visual: "game",
        nav: "Spieleentwicklung",
        title: "Sie haben die Spielidee. Wir bauen das Spiel.",
        text: "Wir entwickeln Spiele und Prototypen im Auftrag, vor allem mit Unreal Engine und C++. Von der ersten Mechanik bis zum Build, den Sie Spielern und Publishern zeigen können.",
        tags: ["Unreal Engine", "Multiplayer", "Prototypen"],
        cta: "Spielprojekt besprechen",
        imageAlt: "Pixel-Illustration: Sticker mit Gamepad, Schatzkiste, Levelkarte und Spielfigur auf einer dunklen Tafel",
      },
      {
        id: "software",
        visual: "software",
        nav: "Softwareentwicklung",
        title: "Sie kennen Ihre Prozesse. Wir bauen die Software dazu.",
        text: "Individuelle Anwendungen, Schnittstellen und Backends für Ihre Abläufe. Statt Ihre Arbeit an Standardsoftware anzupassen, passen wir die Software an Ihre Arbeit an.",
        tags: ["Webanwendungen", "Schnittstellen", "Backends"],
        cta: "Softwareprojekt besprechen",
        imageAlt: "Code-Editor mit einem Deploy-Plan und Server auf einem blauen Pixel-Mosaik",
      },
      {
        id: "apps",
        visual: "apps",
        nav: "App-Entwicklung",
        title: "Sie haben die Nutzer. Wir bauen die App.",
        text: "Apps für iOS und Android aus einer gemeinsamen Codebasis mit Flutter. Wir begleiten Sie von der ersten Skizze bis zur Veröffentlichung im App Store und bei Google Play.",
        tags: ["iOS", "Android", "Flutter"],
        cta: "App-Projekt besprechen",
        imageAlt: "Smartphone mit App-Karten und Benachrichtigungen auf einem blauen Pixel-Mosaik",
      },
      {
        id: "ki",
        visual: "ai",
        nav: "KI & Machine Learning",
        title: "Sie haben die Daten. Wir machen KI nutzbar.",
        text: "Wir zeigen Ihnen, wo KI in Ihrem Unternehmen wirklich Arbeit abnimmt, und bauen sie in Ihre Systeme ein. Von Assistenten für Kunden und Team bis zur Auswertung Ihrer Daten.",
        tags: ["KI-Assistenten", "Datenauswertung", "Beratung"],
        cta: "KI-Projekt besprechen",
        imageAlt: "KI-Chat mit Beispielaufgaben, Roboter und Drohne auf einem blauen Pixel-Mosaik",
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
        { name: "SplitUp", text: "Ausgaben in der Gruppe fair teilen: Belege scannen, Salden im Blick.", icon: "/images/work/apps/splitup-icon.webp", screen: "/images/work/apps/splitup-screen.webp", screenAlt: "SplitUp: Gruppe „Lisbon Trip“ mit Gesamtausgaben, Salden und letzten Zahlungen" },
        { name: "FamFlow", text: "Der Familienplaner: gemeinsamer Kalender, Autos, Aufgaben und Pinnwand.", screen: "/images/work/apps/famflow-screen.webp", screenAlt: "FamFlow: Übersicht einer Familie mit offenen Aufgaben, Autoreservierungen und Mitgliedern" },
        { name: "Shapes", text: "Schiebepuzzle: Formen verschieben, den Ausgang finden. Acht Stufen, kein Timer.", icon: "/images/work/apps/shapes-icon.webp", screen: "/images/work/apps/shapes-screen.webp", screenAlt: "Shapes: Startbildschirm mit Level 1 und Play-Knopf" },
        { name: "Tiles", text: "Logikrätsel mit 1000 geprüften Leveln: ein Juwel pro Farbe, Zeile und Spalte.", icon: "/images/work/apps/tiles-icon.webp", screen: "/images/work/apps/tiles-screen.webp", screenAlt: "Tiles: Level 210, ein farbiges Raster mit den Regeln darüber" },
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
    prototype: { live: "Live", build: "Build läuft", thanks: "Danke!", play: "Automatischen Wechsel fortsetzen", pause: "Automatischen Wechsel anhalten" },
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
        sceneAlt: "Das fertige Produkt leuchtet auf, eine Rakete startet.",
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
    email: null,
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
    company: "Sentrix Code GmbH i. G.",
    tagline: "Spiele, Software, Apps und KI im Auftrag. Aus Monheim am Rhein.",
  },
};
