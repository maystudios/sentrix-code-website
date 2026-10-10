import type { Pages } from "./pages.types";

// Copy rules: WEBSITE.md, "Wahrheit vor Wirkung" and "Kein AI-Slop". Keep in step with pages.de.ts.
// `example: true` and `// EXAMPLE` mark invented content that needs replacing before launch.
export const pagesEn: Pages = {
  routes: {
    home: "/en/",
    services: {
      game: "/en/services/game-development/",
      software: "/en/services/software-development/",
      apps: "/en/services/app-development/",
      ai: "/en/services/ai/",
    },
    about: "/en/about/",
    contact: "/en/contact/",
    imprint: "/impressum/",
    privacy: "/datenschutz/",
  },
  menu: {
    services: "Services",
    company: "Company",
    about: "About us",
    allServices: "All services at a glance",
    previewCta: "Learn more",
  },
  shared: {
    backToTop: "Back to top",
    moreServices: "More services",
    questionsTitle: "Questions we hear often",
    stackTitle: "What we work with",
  },
  services: [
    {
      kind: "game",
      nav: "Game development",
      menuText: "Prototypes, gameplay and multiplayer in Unreal Engine",
      icon: "gamepad",
      meta: {
        title: "Game development on commission · Sentrix Code",
        description:
          "Prototypes, gameplay programming, multiplayer and tools with Unreal Engine and C++. Game development on commission from Monheim am Rhein, Germany.",
      },
      hero: {
        title: "Your game, built by people who make games themselves.",
        intro:
          "We develop games and prototypes on commission, mostly with Unreal Engine and C++. For studios that need extra hands, and for companies that want a game as a product, a learning tool or for marketing.",
        scene: "/images/scenes/games-studio",
        sceneAlt: "Pixel scene: the robot plays at a desk with two monitors, an arcade cabinet next to it",
      },
      offer: {
        title: "What we do for your game",
        items: [
          {
            title: "Prototypes and vertical slices",
            text: "An idea becomes something playable within a few weeks. Use it to test the fun, win over publishers or apply for funding.",
            icon: "gamepad",
          },
          {
            title: "Gameplay programming",
            text: "Mechanics, enemy AI, vehicles, combat and inventory are built as C++ systems that work together cleanly and stay extensible.",
            icon: "code",
          },
          {
            title: "Multiplayer",
            text: "Co-op and online play with listen servers or dedicated servers. We test on bad connections too, not just on the office network.",
            icon: "server",
          },
          {
            title: "Tools and pipelines",
            text: "Editor tools, automated tests and build pipelines help your team build content faster and search less.",
            icon: "prototype",
          },
        ],
      },
      stack: {
        title: "What we work with",
        items: ["Unreal Engine 5", "C++", "Blueprints", "Gameplay Ability System", "Steam", "Epic Online Services", "Perforce"],
      },
      questions: [
        {
          question: "Do you also work with Unity or Godot?",
          answer: "Our focus is Unreal Engine. For smaller games and prototypes we are happy to talk about Unity or Godot as well.",
          example: true,
        },
        {
          question: "Can you join a project that is already running?",
          answer: "Yes. We get to know the existing code and take over clearly defined systems or whole areas.",
          example: true,
        },
      ],
      cta: {
        title: "Tell us about your game.",
        text: "A pitch deck, a sketch or just an idea: we will tell you how we would approach it.",
      },
    },
    {
      kind: "software",
      nav: "Software development",
      menuText: "Web applications, portals, integrations and backends",
      icon: "server",
      meta: {
        title: "Software development on commission · Sentrix Code",
        description:
          "Web applications, customer portals, integrations and backends that fit the way you work. Software development from Monheim am Rhein, Germany.",
      },
      hero: {
        title: "Software that fits the way you work.",
        intro:
          "When off-the-shelf software reaches its limits, we build what fits: web applications, portals, integrations and backends that connect the systems you already use.",
        scene: "/images/scenes/server-room",
        sceneAlt: "Pixel scene: the robot checks the server racks with a clipboard",
      },
      offer: {
        title: "What we build for you",
        items: [
          {
            title: "Web applications and portals",
            text: "Customer portals, internal tools and dashboards that run in the browser and work with your real data.",
            icon: "code",
          },
          {
            title: "Integrations",
            text: "We connect ERP, shop, CRM and specialist systems so nobody copies data from one system into the next by hand.",
            icon: "chip",
          },
          {
            title: "Backends and APIs",
            text: "Robust servers and APIs in Java, TypeScript or Python, with tests, logging and monitoring from day one.",
            icon: "server",
          },
          {
            title: "Modernisation",
            text: "We replace grown legacy systems step by step while daily operations carry on.",
            icon: "prototype",
          },
        ],
      },
      stack: {
        title: "What we work with",
        // EXAMPLE: PostgreSQL and Docker are not yet confirmed by the project owner.
        items: ["TypeScript", "React", "Next.js", "Java", "Python", "PostgreSQL", "Docker"],
      },
      questions: [
        {
          question: "Do you also run the software?",
          answer: "If you like, yes. We set up hosting, updates and monitoring, or hand everything over to your IT in good order.",
          example: true,
        },
        {
          question: "How do you handle our data?",
          answer: "Confidentially and in line with GDPR. Wherever possible we work with test data, and we sign a data processing agreement with you.",
          example: true,
        },
      ],
      cta: {
        title: "Which process costs you too much time today?",
        text: "Describe it in a few sentences. We will come back with a first idea of how software can make it simpler.",
      },
    },
    {
      kind: "apps",
      nav: "App development",
      menuText: "Apps for iOS and Android from one codebase",
      icon: "phone",
      meta: {
        title: "App development with Flutter · Sentrix Code",
        description:
          "Apps for iOS and Android from one shared Flutter codebase, from the concept to the release in the stores.",
      },
      hero: {
        title: "Apps your users like to open.",
        intro:
          "We build apps for iOS and Android from one shared Flutter codebase. That saves time and budget without the app feeling like a compromise.",
        scene: "/images/scenes/app-world",
        sceneAlt: "Pixel scene: the robot holds up a smartphone with colourful app tiles and message bubbles popping out",
      },
      offer: {
        title: "From the idea to the store",
        items: [
          {
            title: "Concept and design",
            text: "We work out what the first version has to do and design flows that work without a manual.",
            icon: "design",
          },
          {
            title: "Development with Flutter",
            text: "One codebase for iOS and Android, with camera, location and push notifications wherever your app needs them.",
            icon: "phone",
          },
          {
            title: "Connecting your systems",
            text: "Login, payments, bookings and data from your backend, connected securely and traceably.",
            icon: "chip",
          },
          {
            title: "Release and care",
            text: "We take the app to the App Store and Google Play and keep it current with updates.",
            icon: "rocket",
          },
        ],
      },
      stack: {
        title: "What we work with",
        items: ["Flutter", "Dart", "Firebase", "RevenueCat", "AdMob", "App Store Connect", "Google Play Console"],
      },
      questions: [
        {
          question: "Why Flutter instead of two native apps?",
          answer: "One codebase means features land on both platforms at once and bugs are fixed once. Where an app truly needs native technology, we add it specifically.",
          example: true,
        },
        {
          question: "Who takes care of the store accounts?",
          answer: "Apple and Google require a developer account in your name. We set it up with you and handle the release.",
          example: true,
        },
      ],
      cta: {
        title: "Which app are your customers still missing?",
        text: "Tell us what your users should open it for. We will show you what a first version could look like.",
      },
    },
    {
      kind: "ai",
      nav: "AI & machine learning",
      menuText: "Advice, assistants and automation with AI",
      icon: "chip",
      meta: {
        title: "AI and machine learning for companies · Sentrix Code",
        description:
          "Advice, AI assistants, automation and data analysis: AI that fits your workflows and stays GDPR-compliant.",
      },
      hero: {
        title: "AI that takes work off your plate instead of adding more.",
        intro:
          "Together we find the places where AI genuinely helps, and we build solutions that fit your workflows: understandable, verifiable and GDPR-compliant.",
        scene: "/images/scenes/ai-lab",
        sceneAlt: "Pixel scene: the robot at a laptop next to a sculpture of connected nodes and a light bulb",
      },
      offer: {
        title: "How we make AI useful for you",
        items: [
          {
            title: "Advice and assessment",
            text: "In a workshop we look at your workflows and give you an honest view of where AI pays off and where it does not.",
            icon: "idea",
          },
          {
            title: "AI assistants",
            text: "Assistants for customers or staff that answer from your documents and data and cite their sources.",
            icon: "robot",
          },
          {
            title: "Automation",
            text: "Recurring tasks such as summaries, sorting requests or matching data run by themselves.",
            icon: "prototype",
          },
          {
            title: "Data analysis and machine learning",
            text: "We analyse your data and train our own models when ready-made solutions are not enough.",
            icon: "chip",
          },
        ],
      },
      stack: {
        title: "What we work with",
        // EXAMPLE: the AI stack is not yet confirmed by the project owner.
        items: ["Python", "LLM APIs", "Retrieval augmented generation", "Vector databases", "PyTorch"],
      },
      questions: [
        {
          question: "Does our data stay with us?",
          answer: "If you want it to, yes. We use providers with data centres in the EU or models that run in your own environment.",
          example: true,
        },
        {
          question: "Do we need a lot of data for this?",
          answer: "Often not. Many assistants work with the documents you already have, without any training of their own.",
          example: true,
        },
      ],
      cta: {
        title: "Where would AI save your team the most time?",
        text: "Name a task that comes back every week. We will tell you whether AI can take it over.",
      },
    },
  ],
  about: {
    meta: {
      title: "About us · Sentrix Code",
      description: "Sentrix Code is a young software company from Monheim am Rhein, Germany, for games, software, apps and AI.",
    },
    hero: {
      title: "We are Sentrix Code.",
      intro:
        "Founded in 2026 by Luca Finn Wiegand and Sven Fredrik Maibaum in Monheim am Rhein, Germany. We build games, software, apps and AI on commission.",
      scene: "/images/scenes/team",
      sceneAlt: "Pixel scene: a small studio with two desks, the robot waving between them, a river with a bridge outside the window",
    },
    story: {
      title: "Why we exist",
      paragraphs: [
        "We have worked in studios, start-ups and as freelancers, and kept seeing the same thing: good ideas rarely fail because of the idea, but because nobody builds them properly.",
        "That is why we founded Sentrix Code. We bring game development, classic software and AI together in one team and take responsibility for the result, not just for hours.",
      ],
      example: true,
    },
    founders: {
      title: "The founders",
      people: [
        {
          name: "Sven Fredrik Maibaum",
          initials: "SM",
          role: "Managing director · Technology",
          text: "Leads architecture and development. Comes from game development with Unreal Engine and C++ and has built backends for platforms with many users.",
          example: true,
        },
        {
          name: "Luca Finn Wiegand",
          initials: "LW",
          role: "Managing director · Projects and finance",
          text: "Looks after projects, clients and numbers, and builds web applications with React and Next.js himself.",
          example: true,
        },
      ],
    },
    location: {
      title: "Monheim am Rhein",
      text: "We are based between Cologne and Düsseldorf. We work with clients across Germany, mostly remotely, and are happy to come by for workshops.",
    },
    principles: {
      title: "How we work",
      items: [
        { text: "We show something that runs early instead of writing long concepts.", icon: "rocket" },
        { text: "We say so openly when an idea would cost more than it brings.", icon: "idea" },
        { text: "We write code that others can carry on later.", icon: "code" },
        { text: "We use AI as a tool. Responsibility for the result stays with us.", icon: "chip" },
      ],
      example: true,
    },
  },
  contact: {
    meta: {
      title: "Contact · Sentrix Code",
      description: "Tell us about your project. We will get back to you with a first assessment.",
    },
    title: "Let's talk about your project.",
    intro: "A few sentences are enough. The more precisely you describe your plans, the more concrete our first assessment will be.",
    scene: "/images/scenes/contact",
    sceneAlt: "Pixel scene: the robot throws a paper plane, letters fly towards a mailbox",
    form: {
      name: "Your name",
      email: "Email address",
      company: "Company (optional)",
      topic: "What is it about?",
      topics: ["Game development", "Software development", "App development", "AI & machine learning", "Something else"],
      message: "Your message",
      messageHint: "What should be built? Is there a draft already, or a target date?",
      consent: "I agree that my details are processed to answer my request. More in the",
      privacyLabel: "privacy policy (German)",
      submit: "Send request",
      required: "Please fill in this field.",
      invalidEmail: "Please enter a valid email address.",
      tooShort: "A few more words help us assess your project.",
      unavailable: "The form is being connected. Until then you can reach us by email: contact@sentrixcode.com",
      sent: "Thank you! Your email program opens with your request.",
    },
    aside: {
      title: "Reach us directly",
      text: "Sentrix Code GmbH i. G., Krischerstraße 14, 40789 Monheim am Rhein, Germany",
      response: { text: "We reply within one working day.", example: true },
    },
  },
  notFound: {
    title: "Nothing here. Not yet.",
    text: "This page does not exist. Our robot has already turned the map around, but it cannot find it either.",
    home: "Back to the home page",
  },
};
