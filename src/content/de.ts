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
      "Wir entwickeln Spiele, Software, Apps und KI-Lösungen im Auftrag. Für Studios, für den Mittelstand und für Unternehmen, die mehr vorhaben als Standardsoftware hergibt.",
    primaryCta: "Projekt anfragen",
    secondaryCta: "Leistungen ansehen",
  },
  tech: {
    // EXAMPLE: Python ist vom Projektverantwortlichen noch nicht bestätigt.
    label: "Womit wir arbeiten",
    items: ["Unreal Engine", "C++", "Flutter", "React", "Next.js", "TypeScript", "Java", "Python"],
  },
  statement: {
    title: "Von der ersten Idee bis zum Release, ohne Übergabe an Dritte.",
    chips: ["Idee", "Konzept", "Prototyp", "Design", "Entwicklung", "Tests", "Release"],
  },
  positioning:
    "Wir entwickeln im Auftrag. Vom ersten Prototyp bis zur Anwendung, die Ihre Nutzer jeden Tag verwenden.",
  services: {
    title: "Vier Bereiche. Ein Team.",
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
  },
  cases: {
    title: "So sieht das in der Praxis aus.",
    cta: "Ähnliches Projekt anfragen",
    items: [
      {
        tab: "Spiele",
        client: "Lernspiel für einen Bildungsverlag",
        title: "Ein Mathe-Spiel, das Kinder freiwillig weiterspielen.",
        text: "Der Verlag wollte Übungsaufgaben spielerischer machen. Wir haben ein Puzzlespiel für Tablets entwickelt, das Aufgaben aus dem Lehrplan in Level verwandelt. Lehrkräfte sehen den Fortschritt ihrer Klasse.",
        quote: "Die Kinder fragen nach dem nächsten Level, nicht nach dem Ende der Stunde.",
        role: "Produktleitung, Bildungsverlag",
        sprite: "/images/sprites/gamepad.webp",
        example: true,
      },
      {
        tab: "Mittelstand",
        client: "Maschinenbauer aus dem Bergischen Land",
        title: "Ein Kundenportal ersetzt Excel-Listen und Rückfragen am Telefon.",
        text: "Aufträge, Lieferzeiten und Ersatzteile lagen in drei Systemen. Wir haben ein Portal gebaut, das die Daten aus dem ERP holt und Kunden den Stand ihrer Bestellung selbst zeigt.",
        quote: "Unser Vertrieb spricht mit Kunden wieder über neue Maschinen statt über Liefertermine.",
        role: "Geschäftsführer, Maschinenbau",
        sprite: "/images/sprites/server.webp",
        example: true,
      },
      {
        tab: "Apps",
        client: "Fitnessstudio-Kette mit zwölf Standorten",
        title: "Kurse buchen mit zwei Fingertipps statt am Tresen.",
        text: "Die Kette wollte eine eigene App statt einer fremden Buchungsplattform. Wir haben sie mit Flutter für iOS und Android gebaut und an die bestehende Mitgliederverwaltung angebunden.",
        quote: "Die meisten Buchungen kommen inzwischen über die App, und am Tresen bleibt wieder Zeit für Beratung.",
        role: "Leitung Digitales, Fitnessstudio-Kette",
        sprite: "/images/sprites/phone.webp",
        example: true,
      },
      {
        tab: "KI",
        client: "Onlinehändler für Ersatzteile",
        title: "Ein KI-Assistent beantwortet die Standardfragen im Kundenservice.",
        text: "Viele Anfragen drehten sich um Passform und Lieferung. Unser Assistent antwortet aus Produktdaten und Handbüchern und gibt schwierige Fälle mit allen Angaben an das Team weiter.",
        quote: "Das Team kümmert sich jetzt um die Fälle, bei denen es wirklich gebraucht wird.",
        role: "Leitung Kundenservice, Onlinehandel",
        sprite: "/images/sprites/chip.webp",
        example: true,
      },
    ],
  },
  process: {
    title: "So arbeiten wir.",
    intro: "Vier Schritte, und Sie wissen in jedem davon, wo Ihr Projekt steht.",
    steps: [
      {
        title: "Kennenlernen",
        text: "Sie erzählen uns von Ihrem Vorhaben, wir stellen die Fragen, die über Umfang und Technik entscheiden. Das erste Gespräch kostet Sie nichts.",
        scene: "/images/scenes/meet",
        sceneAlt: "Pixel-Szene: zwei Figuren am Tisch mit Kaffee und Sprechblasen",
        example: true,
      },
      {
        title: "Konzept und Angebot",
        text: "Sie bekommen einen klaren Umfang, einen Zeitplan und ein nachvollziehbares Angebot. Ist die Idee noch unsicher, beginnen wir mit einem kleinen Prototyp.",
        scene: "/images/scenes/concept",
        sceneAlt: "Pixel-Szene: eine Figur zeigt auf eine Tafel mit einem Ablaufplan",
      },
      {
        title: "Entwicklung in Etappen",
        text: "Wir arbeiten in kurzen Etappen. Alle zwei Wochen sehen Sie einen lauffähigen Stand und können mitentscheiden, was als Nächstes kommt.",
        scene: "/images/scenes/build",
        sceneAlt: "Pixel-Szene: zwei Figuren bauen mit einem Kran aus Blöcken, daneben ein Monitor mit Code",
        example: true,
      },
      {
        title: "Start und Übergabe",
        text: "Wir bringen das Produkt live, übergeben Code und Dokumentation und bleiben auf Wunsch Ihr Partner für die nächsten Versionen.",
        scene: "/images/scenes/launch",
        sceneAlt: "Pixel-Szene: eine Rakete startet, eine Figur winkt",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen.",
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
