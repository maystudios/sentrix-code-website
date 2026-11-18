import type { Pages } from "./pages.types";

// Copy rules: WEBSITE.md, "Wahrheit vor Wirkung" and "Kein AI-Slop".
// `example: true` and `// EXAMPLE` mark invented content that needs replacing before launch.
export const pagesDe: Pages = {
  routes: {
    home: "/",
    services: {
      game: "/leistungen/spieleentwicklung/",
      software: "/leistungen/softwareentwicklung/",
      apps: "/leistungen/app-entwicklung/",
      ai: "/leistungen/ki/",
      workshop: "/leistungen/workshops/",
    },
    about: "/ueber-uns/",
    contact: "/kontakt/",
    imprint: "/impressum/",
    privacy: "/datenschutz/",
  },
  menu: {
    services: "Leistungen",
    company: "Unternehmen",
    about: "Über uns",
    allServices: "Alle Leistungen im Überblick",
    previewCta: "Mehr erfahren",
  },
  shared: {
    backToTop: "Nach oben",
    moreServices: "Weitere Leistungen",
    questionsTitle: "Fragen, die wir oft hören",
    stackTitle: "Womit wir arbeiten",
  },
  services: [
    {
      kind: "software",
      nav: "Softwareentwicklung",
      menuText: "Webanwendungen, Portale, Schnittstellen und Backends",
      icon: "server",
      meta: {
        title: "Softwareentwicklung im Auftrag · Sentrix Code",
        description:
          "Webanwendungen, Kundenportale, Schnittstellen, Backends und Code-Audits, die zu Ihren Abläufen passen. Softwareentwicklung aus Monheim am Rhein.",
      },
      hero: {
        title: "Software, die zu Ihrer Arbeit passt.",
        intro:
          "Wenn Standardsoftware an ihre Grenzen kommt, bauen wir die passende Lösung: Webanwendungen, Portale, Schnittstellen und Backends, die Ihre bestehenden Systeme verbinden.",
        scene: "/images/scenes/server-room",
        sceneAlt: "Pixel-Szene: der Roboter prüft mit einem Klemmbrett die Serverschränke",
      },
      offer: {
        title: "Was wir bauen und prüfen",
        items: [
          {
            title: "Webanwendungen und Portale",
            text: "Kundenportale, interne Werkzeuge und Dashboards, die im Browser laufen und mit Ihren echten Daten arbeiten.",
            icon: "code",
          },
          {
            title: "Schnittstellen",
            text: "Wir verbinden ERP, Shop, CRM und Fachsysteme, damit niemand mehr Daten von Hand von einem System ins nächste tippt.",
            icon: "chip",
          },
          {
            title: "Backends und APIs",
            text: "Stabile Server und APIs in Java, TypeScript oder Python, mit Tests, Protokollen und Überwachung von Anfang an.",
            icon: "server",
          },
          {
            title: "Modernisierung",
            text: "Gewachsene Altsysteme lösen wir Schritt für Schritt ab, während der laufende Betrieb weitergeht.",
            icon: "prototype",
          },
          {
            title: "Code-Audit und Code-Qualität",
            text: "Wir prüfen bestehende Software, auch solche, die schnell mit KI entstanden ist: Architektur, Datenmodell, Tests und Sicherheit. Sie bekommen konkrete Fundstellen im Code und eine ehrliche Empfehlung, was bleiben kann und was neu muss.",
            icon: "test",
          },
        ],
      },
      stack: {
        title: "Womit wir arbeiten",
        text: "Mit dem, was zu Ihnen passt. Wir haben Informatik gelernt und haben unsere Lieblingssprachen, aber seit KI mitarbeitet, ist Code ein Material, das sich formen lässt. Entscheidend ist nicht die Sprache, sondern dass Ihr Betrieb produktiver wird. Deshalb überlegen wir gern mit Ihnen gemeinsam, wie sich ein Ablauf einfacher lösen lässt.",
      },
      questions: [
        {
          question: "Betreiben Sie die Software auch?",
          answer: "Auf Wunsch ja. Wir richten Hosting, Updates und Überwachung ein oder übergeben alles geordnet an Ihre IT.",
          example: true,
        },
        {
          question: "Wie gehen Sie mit unseren Daten um?",
          answer: "Vertraulich und nach DSGVO. Wo es geht, arbeiten wir mit Testdaten, und wir schließen mit Ihnen einen Vertrag zur Auftragsverarbeitung.",
          example: true,
        },
      ],
      cta: {
        title: "Welcher Ablauf kostet Sie heute zu viel Zeit?",
        text: "Beschreiben Sie ihn in ein paar Sätzen. Wir melden uns mit einer ersten Idee, wie Software ihn einfacher macht.",
      },
    },
    {
      kind: "apps",
      nav: "App-Entwicklung",
      menuText: "Apps für iOS und Android aus einer Codebasis",
      icon: "phone",
      meta: {
        title: "App-Entwicklung mit Flutter · Sentrix Code",
        description:
          "Apps für iOS und Android aus einer gemeinsamen Codebasis mit Flutter, vom Konzept bis zur Veröffentlichung im Store.",
      },
      hero: {
        title: "Apps, die Ihre Nutzer gern öffnen.",
        intro:
          "Wir entwickeln Apps für iOS und Android aus einer gemeinsamen Codebasis mit Flutter. Das spart Zeit und Budget, ohne dass sich die App wie ein Kompromiss anfühlt.",
        scene: "/images/scenes/app-world",
        sceneAlt: "Pixel-Szene: der Roboter hält ein Smartphone mit bunten App-Kacheln, aus dem Nachrichten aufpoppen",
      },
      offer: {
        title: "Von der Idee bis in den Store",
        items: [
          {
            title: "Konzept und Design",
            text: "Wir klären, was die erste Version können muss, und gestalten Abläufe, die ohne Anleitung funktionieren.",
            icon: "design",
          },
          {
            title: "Entwicklung mit Flutter",
            text: "Eine Codebasis für iOS und Android, mit Kamera, Standort und Push-Benachrichtigungen, wo Ihre App sie braucht.",
            icon: "phone",
          },
          {
            title: "Anbindung an Ihre Systeme",
            text: "Login, Zahlungen, Buchungen und Daten aus Ihrem Backend, sicher und nachvollziehbar angebunden.",
            icon: "chip",
          },
          {
            title: "Veröffentlichung und Pflege",
            text: "Wir bringen die App in den App Store und zu Google Play und halten sie mit Updates auf dem aktuellen Stand.",
            icon: "rocket",
          },
        ],
      },
      stack: {
        title: "Womit wir arbeiten",
        items: ["Flutter", "Dart", "Firebase", "RevenueCat", "AdMob", "App Store Connect", "Google Play Console"],
      },
      questions: [
        {
          question: "Warum Flutter und nicht zwei native Apps?",
          answer: "Eine Codebasis heißt: Funktionen kommen auf beiden Plattformen gleichzeitig, und Fehler werden einmal behoben. Wo eine App wirklich native Technik braucht, binden wir sie gezielt ein.",
          example: true,
        },
        {
          question: "Wer kümmert sich um die Konten in den Stores?",
          answer: "Apple und Google verlangen ein eigenes Entwicklerkonto auf Ihren Namen. Wir richten es mit Ihnen ein und übernehmen die Veröffentlichung.",
          example: true,
        },
      ],
      cta: {
        title: "Welche App fehlt Ihren Kunden noch?",
        text: "Erzählen Sie uns, wofür Ihre Nutzer sie öffnen sollen. Wir zeigen Ihnen, wie eine erste Version aussehen kann.",
      },
    },
    {
      kind: "ai",
      nav: "KI & Machine Learning",
      menuText: "Beratung, Assistenten und Automatisierung mit KI",
      icon: "chip",
      meta: {
        title: "KI und Machine Learning für Unternehmen · Sentrix Code",
        description:
          "Beratung, KI-Assistenten, Automatisierung und Datenauswertung: KI, die in Ihre Abläufe passt und datenschutzkonform bleibt.",
      },
      hero: {
        title: "KI, die Arbeit abnimmt, statt neue zu machen.",
        intro:
          "Wir finden mit Ihnen die Stellen, an denen KI wirklich hilft, und bauen Lösungen, die in Ihre Abläufe passen: verständlich, überprüfbar und datenschutzkonform.",
        scene: "/images/scenes/ai-lab",
        sceneAlt: "Pixel-Szene: der Roboter am Laptop, daneben eine Skulptur aus verbundenen Knoten und eine Glühbirne",
      },
      offer: {
        title: "Wie wir KI für Sie nutzbar machen",
        items: [
          {
            title: "Beratung und Potenzialanalyse",
            text: "In einem Workshop sehen wir uns Ihre Abläufe an und bewerten ehrlich, wo sich KI lohnt und wo nicht.",
            icon: "idea",
          },
          {
            title: "KI-Assistenten",
            text: "Assistenten für Kunden oder Mitarbeitende, die aus Ihren Dokumenten und Daten antworten und ihre Quellen nennen.",
            icon: "robot",
          },
          {
            title: "Automatisierung",
            text: "Wiederkehrende Aufgaben wie Zusammenfassungen, Einordnung von Anfragen oder Datenabgleich laufen von selbst.",
            icon: "prototype",
          },
          {
            title: "Datenauswertung und Machine Learning",
            text: "Wir werten Ihre Daten aus und trainieren eigene Modelle, wenn fertige Lösungen nicht ausreichen.",
            icon: "chip",
          },
          {
            title: "Workshops",
            text: "Ein Tag mit Ihrem Team: was KI heute kann, wie man sie sicher und datenschutzkonform nutzt und welche Aufgaben bei Ihnen zuerst profitieren. Für Geschäftsführung, Fachabteilungen oder Entwickler.",
            icon: "concept",
          },
        ],
      },
      stack: {
        title: "Womit wir arbeiten",
        // EXAMPLE: the AI stack is not yet confirmed by the project owner.
        items: ["Python", "LLM-Schnittstellen", "Retrieval Augmented Generation", "Vektordatenbanken", "PyTorch"],
      },
      questions: [
        {
          question: "Bleiben unsere Daten bei uns?",
          answer: "Wenn Sie das möchten, ja. Wir setzen auf Anbieter mit Rechenzentren in der EU oder auf Modelle, die in Ihrer eigenen Umgebung laufen.",
          example: true,
        },
        {
          question: "Brauchen wir dafür große Datenmengen?",
          answer: "Oft nicht. Viele Assistenten arbeiten mit Ihren vorhandenen Dokumenten, ganz ohne eigenes Training.",
          example: true,
        },
      ],
      cta: {
        title: "Wo würde KI Ihrem Team die meiste Zeit sparen?",
        text: "Nennen Sie uns eine Aufgabe, die sich jede Woche wiederholt. Wir sagen Ihnen, ob KI sie übernehmen kann.",
      },
    },
    {
      kind: "workshop",
      nav: "Workshops",
      menuText: "KI-Workshops für Ihr Team, vor Ort oder remote",
      icon: "concept",
      meta: {
        title: "KI-Workshops für Unternehmen · Sentrix Code",
        description:
          "Workshops für Geschäftsführung, Fachabteilungen und Entwickler: KI sicher und datenschutzkonform nutzen, an Ihren echten Aufgaben. Vor Ort oder remote.",
      },
      hero: {
        title: "Workshops, nach denen Ihr Team KI wirklich nutzt.",
        intro:
          "Wir kommen zu Ihnen oder schalten uns remote dazu. Statt Folien arbeiten wir mit Ihren echten Aufgaben, damit Ihr Team am Ende weiß, was KI kann, wo ihre Grenzen liegen und wie es sie sicher einsetzt.",
        scene: "/images/scenes/team",
        sceneAlt: "Pixel-Szene: ein kleines Studio mit zwei Schreibtischen, dazwischen winkt der Roboter",
      },
      offer: {
        title: "Welche Workshops wir anbieten",
        // EXAMPLE: the workshop formats are not yet confirmed by the project owner.
        items: [
          {
            title: "KI im Betrieb",
            text: "Für ganze Teams und Fachabteilungen: was KI heute kann, wie man gute Ergebnisse bekommt und was man ihr besser nicht anvertraut. Mit Übungen an Aufgaben aus Ihrem Alltag.",
            icon: "idea",
          },
          {
            title: "KI für die Geschäftsführung",
            text: "Wo KI in Ihrem Unternehmen Zeit und Geld spart, was sie kostet und wie Sie den Einsatz sicher und datenschutzkonform aufsetzen.",
            icon: "concept",
          },
          {
            title: "KI für Entwickler",
            text: "Wie man mit KI-Agenten Software baut, die hält: erst die Anforderungen, dann Tests, dann Code, und eine Prüfung durch einen zweiten Agenten. Aus unserer eigenen Werkstatt.",
            icon: "code",
          },
          {
            title: "Workshop nach Maß",
            text: "Ein Thema, das Sie gerade beschäftigt, etwa ein bestimmter Ablauf oder ein neues Werkzeug. Wir stellen den Tag passend dazu zusammen.",
            icon: "prototype",
          },
        ],
      },
      stack: {
        title: "Womit wir arbeiten",
        text: "Mit den Werkzeugen, die Ihr Team nutzen darf. Wir richten uns nach Ihren Regeln zu Datenschutz und IT-Sicherheit, nicht umgekehrt, und zeigen auch, welche Daten in keine KI gehören.",
      },
      questions: [
        {
          question: "Wie lange dauert ein Workshop?",
          answer: "Meist einen Tag, vor Ort oder remote. Wer tiefer einsteigen will, kann die Inhalte auch auf mehrere halbe Tage verteilen.",
          example: true,
        },
        {
          question: "Brauchen die Teilnehmenden Vorkenntnisse?",
          answer: "Nein. Wir holen alle dort ab, wo sie stehen, und arbeiten mit Aufgaben aus ihrem eigenen Alltag.",
          example: true,
        },
      ],
      cta: {
        title: "Was soll Ihr Team nach dem Workshop leichter erledigen?",
        text: "Schreiben Sie uns, wer teilnimmt und was Sie vorhaben. Wir schlagen Ihnen einen passenden Ablauf vor.",
      },
    },
    {
      kind: "game",
      nav: "Spieleentwicklung",
      menuText: "Prototypen, Gameplay und Multiplayer mit Unreal Engine",
      icon: "gamepad",
      meta: {
        title: "Spieleentwicklung im Auftrag · Sentrix Code",
        description:
          "Prototypen, Gameplay-Programmierung, Multiplayer und Werkzeuge mit Unreal Engine und C++. Spieleentwicklung im Auftrag aus Monheim am Rhein.",
      },
      hero: {
        title: "Ihr Spiel, gebaut von Leuten, die selbst Spiele machen.",
        intro:
          "Wir entwickeln Spiele und Prototypen im Auftrag, vor allem mit Unreal Engine und C++. Für Studios, die Verstärkung brauchen, und für Unternehmen, die ein Spiel als Produkt, Lernwerkzeug oder für ihr Marketing einsetzen wollen.",
        scene: "/images/scenes/games-studio",
        sceneAlt: "Pixel-Szene: der Roboter spielt an einem Schreibtisch mit zwei Monitoren, daneben ein Arcade-Automat",
      },
      offer: {
        title: "Was wir für Ihr Spiel tun",
        items: [
          {
            title: "Prototypen und Vertical Slices",
            text: "Aus einer Idee wird in wenigen Wochen etwas Spielbares. Damit testen Sie den Spielspaß, überzeugen Publisher oder beantragen Förderung.",
            icon: "gamepad",
          },
          {
            title: "Gameplay-Programmierung",
            text: "Mechaniken, Gegner-KI, Fahrzeuge, Kampf und Inventar entstehen als Systeme in C++, die sauber zusammenspielen und sich erweitern lassen.",
            icon: "code",
          },
          {
            title: "Multiplayer",
            text: "Koop und Online-Spiel mit Listen-Server oder dedizierten Servern. Wir testen auch unter schlechter Verbindung, nicht nur im Büronetz.",
            icon: "server",
          },
          {
            title: "Werkzeuge und Pipelines",
            text: "Editor-Werkzeuge, automatische Tests und Build-Pipelines sorgen dafür, dass Ihr Team schneller Inhalte baut und weniger sucht.",
            icon: "prototype",
          },
        ],
      },
      stack: {
        title: "Womit wir arbeiten",
        items: ["Unreal Engine 5", "C++", "Blueprints", "Gameplay Ability System", "Steam", "Epic Online Services", "Perforce"],
      },
      questions: [
        {
          question: "Arbeiten Sie auch mit Unity oder Godot?",
          answer: "Unser Schwerpunkt ist Unreal Engine. Für kleinere Spiele und Prototypen sprechen wir gern auch über Unity oder Godot.",
          example: true,
        },
        {
          question: "Können Sie in ein laufendes Projekt einsteigen?",
          answer: "Ja. Wir arbeiten uns in bestehenden Code ein und übernehmen klar abgegrenzte Systeme oder ganze Bereiche.",
          example: true,
        },
      ],
      cta: {
        title: "Erzählen Sie uns von Ihrem Spiel.",
        text: "Ein Pitch-Dokument, eine Skizze oder nur eine Idee: Wir sagen Ihnen, wie wir es angehen würden.",
      },
    },
  ],
  about: {
    meta: {
      title: "Über uns · Sentrix Code",
      description: "Sentrix Code ist eine junge Softwarefirma aus Monheim am Rhein für Spiele, Software, Apps und KI.",
    },
    hero: {
      title: "Wir sind Sentrix Code.",
      intro:
        "Gegründet 2026 von Luca Finn Wiegand und Sven Fredrik Maibaum in Monheim am Rhein. Wir entwickeln Spiele, Software, Apps und KI im Auftrag.",
      scene: "/images/scenes/team",
      sceneAlt: "Pixel-Szene: ein kleines Studio mit zwei Schreibtischen, dazwischen winkt der Roboter, im Fenster ein Fluss mit Brücke",
    },
    story: {
      title: "Wir haben programmiert, bevor KI es konnte.",
      paragraphs: [
        "Wir haben Spiele mit Unreal Engine und C++ gebaut, dazu Backends, Apps und Plugins, die andere Entwickler kaufen. Architektur, Datenbanken, Server und Sicherheit kennen wir aus jahrelanger Arbeit, nicht aus einem Prompt.",
        "Heute arbeiten wir jeden Tag mit KI, in jedem Projekt. Sie macht uns schneller, aber sie entscheidet nichts. Wir verstehen jede Zeile, die wir ausliefern, und beraten Sie deshalb ehrlich, wo KI hilft und wo klassische Software die bessere Wahl ist.",
        "Deshalb deckt Sentrix Code die ganze IT ab, von der Beratung über Server und Schnittstellen bis zur App. Und wir stehen für das Ergebnis gerade, auch wenn aus hundert Nutzern hunderttausend werden.",
      ],
      example: true,
    },
    founders: {
      title: "Die Gründer",
      people: [
        {
          name: "Sven Fredrik Maibaum",
          initials: "SM",
          role: "Geschäftsführer · Technik",
          text: "Verantwortet Architektur und Entwicklung. Kommt aus der Spieleentwicklung mit Unreal Engine und C++ und hat Backends für Plattformen mit vielen Nutzern gebaut.",
          example: true,
        },
        {
          name: "Luca Finn Wiegand",
          initials: "LW",
          role: "Geschäftsführer · Projekte und Finanzen",
          text: "Kümmert sich um Projekte, Kunden und Zahlen und entwickelt selbst Webanwendungen mit React und Next.js.",
          example: true,
        },
      ],
    },
    principles: {
      title: "Wie wir arbeiten",
      items: [
        { text: "Wir zeigen früh etwas Lauffähiges, statt lange Konzepte zu schreiben.", icon: "rocket" },
        { text: "Wir sagen es offen, wenn eine Idee teurer wird als ihr Nutzen.", icon: "idea" },
        { text: "Wir schreiben Code, den auch andere später weiterführen können.", icon: "code" },
        { text: "Wir nutzen KI als Werkzeug. Die Verantwortung für das Ergebnis bleibt bei uns.", icon: "chip" },
      ],
      example: true,
    },
  },
  contact: {
    meta: {
      title: "Kontakt · Sentrix Code",
      description: "Erzählen Sie uns von Ihrem Projekt. Wir melden uns mit einer ersten Einschätzung.",
    },
    title: "Lassen Sie uns über Ihr Projekt sprechen.",
    intro: "Ein paar Sätze genügen. Je genauer Sie beschreiben, was Sie vorhaben, desto konkreter wird unsere erste Einschätzung.",
    scene: "/images/scenes/contact",
    sceneAlt: "Pixel-Szene: der Roboter wirft einen Papierflieger, Briefe fliegen zu einem Briefkasten",
    form: {
      name: "Ihr Name",
      email: "E-Mail-Adresse",
      company: "Unternehmen (optional)",
      topic: "Worum geht es?",
      topics: ["Spieleentwicklung", "Softwareentwicklung", "App-Entwicklung", "KI & Machine Learning", "Etwas anderes"],
      message: "Ihre Nachricht",
      messageHint: "Was soll entstehen? Gibt es schon einen Entwurf oder einen gewünschten Termin?",
      consent: "Ich bin einverstanden, dass meine Angaben zur Beantwortung meiner Anfrage verarbeitet werden. Mehr dazu in der",
      privacyLabel: "Datenschutzerklärung",
      submit: "Anfrage senden",
      required: "Bitte füllen Sie dieses Feld aus.",
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      tooShort: "Ein paar Worte mehr helfen uns, Ihr Projekt einzuschätzen.",
      unavailable:
        "Das Formular wird gerade angebunden. Bis dahin erreichen Sie uns per E-Mail: contact@sentrixcode.com",
      sent: "Danke! Ihr E-Mail-Programm öffnet sich mit Ihrer Anfrage.",
    },
    aside: {
      title: "Direkt erreichen",
      text: "Sentrix Code GmbH, Krischerstraße 14, 40789 Monheim am Rhein",
      response: { text: "Wir antworten innerhalb eines Werktags.", example: true },
    },
  },
  notFound: {
    title: "Hier ist nichts. Noch nicht.",
    text: "Diese Seite gibt es nicht. Unser Roboter hat die Karte schon gedreht, aber auch er findet sie nicht.",
    home: "Zur Startseite",
  },
};
