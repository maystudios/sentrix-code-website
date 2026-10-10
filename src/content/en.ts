import { pagesEn } from "./pages.en";
import type { Dictionary } from "./types";

// Copy rules: WEBSITE.md, "Wahrheit vor Wirkung" and "Kein AI-Slop". Keep in step with de.ts.
// Everything with `example: true` is invented and needs replacing before launch.
export const en: Dictionary = {
  locale: "en",
  pages: pagesEn,
  meta: {
    title: "Sentrix Code · Games, software, apps and AI on commission",
    description:
      "Sentrix Code builds games, software, apps and AI solutions on commission for studios, mid-sized companies and enterprises. Based in Monheim am Rhein, Germany.",
  },
  anchors: { services: "services", cases: "work", process: "process", faq: "questions", contact: "contact" },
  nav: {
    services: "Services",
    cases: "Work",
    process: "Process",
    contact: "Contact",
    cta: "Start a project",
    menu: "Menu",
    close: "Close",
    switchLanguage: { label: "Deutsche Version", href: "/", short: "DE" },
  },
  hero: {
    headlineA: "Your idea.",
    headlineB: "Our code.",
    subline:
      "We build games, software, apps and AI on commission. For studios and companies with a concrete project in mind.",
    primaryCta: "Start a project",
    secondaryCta: "Explore services",
  },
  tech: {
    // EXAMPLE: Python is not yet confirmed by the project owner.
    label: "What we work with",
    items: ["Unreal Engine", "C++", "Flutter", "React", "Next.js", "TypeScript", "Java", "Python"],
  },
  statement: {
    title: "One team. From the idea to release.",
    chips: [
      { label: "Gameplay", icon: "gamepad", muted: true },
      { label: "Idea", icon: "idea" },
      { label: "Concept", icon: "concept" },
      { label: "Prototype", icon: "prototype" },
      { label: "Design", icon: "design" },
      { label: "APIs", icon: "chip", muted: true },
      { label: "AI integration", icon: "robot", muted: true },
      { label: "Development", icon: "code" },
      { label: "Testing", icon: "test" },
      { label: "Maintenance", icon: "server", muted: true },
      { label: "Release", icon: "rocket" },
      { label: "App stores", icon: "phone", muted: true },
    ],
  },
  positioning:
    "We build on commission. From the first prototype to the application your users rely on every day.",
  services: {
    title: "What would you like to build?",
    items: [
      {
        id: "games",
        visual: "game",
        nav: "Game development",
        title: "You have the game idea. We build the game.",
        text: "We develop games and prototypes on commission, mostly with Unreal Engine and C++. From the first mechanic to a build you can put in front of players and publishers.",
        tags: ["Unreal Engine", "Multiplayer", "Prototypes"],
        cta: "Discuss a game project",
        imageAlt: "Pixel illustration: stickers with a gamepad, treasure chest, level map and hero on a dark board",
      },
      {
        id: "software",
        visual: "software",
        nav: "Software development",
        title: "You know your processes. We build the software for them.",
        text: "Custom applications, interfaces and backends for the way you work. Instead of bending your work around off-the-shelf software, we shape the software around your work.",
        tags: ["Web applications", "Integrations", "Backends"],
        cta: "Discuss a software project",
        imageAlt: "Code editor with a deploy plan and a server on a blue pixel mosaic",
      },
      {
        id: "apps",
        visual: "apps",
        nav: "App development",
        title: "You have the users. We build the app.",
        text: "Apps for iOS and Android from one shared Flutter codebase. We take you from the first sketch to the release on the App Store and Google Play.",
        tags: ["iOS", "Android", "Flutter"],
        cta: "Discuss an app project",
        imageAlt: "Smartphone with app cards and notifications on a blue pixel mosaic",
      },
      {
        id: "ai",
        visual: "ai",
        nav: "AI & machine learning",
        title: "You have the data. We make AI useful.",
        text: "We show you where AI genuinely takes work off your plate and build it into your systems. From assistants for customers and staff to making sense of your data.",
        tags: ["AI assistants", "Data analysis", "Advice"],
        cta: "Discuss an AI project",
        imageAlt: "AI chat with example tasks, a robot and a drone on a blue pixel mosaic",
      },
    ],
    mockups: {
      codeFile: "plan.ts",
      code: [
        ["const ", "project", " = await ", "sentrix", ".plan({"],
        ["  goal: ", "\"Your processes\"", ","],
        ["  connect: [", "\"ERP\", \"Shop\"", "],"],
        ["  tests: ", "true", ","],
        ["});"],
        ["await ", "project", ".deploy();"],
      ],
      buildPassed: "Build passed",
      appNotes: ["New message", "Update installed"],
      aiPrompts: [
        "Summarise this week's customer requests",
        "Find anomalies in the production data",
        "Answer routine support questions",
      ],
      example: true,
    },
  },
  cases: {
    title: "How a task becomes a product.",
    cta: "Ask about a similar project",
    items: [
      {
        tab: "Heistline",
        client: "Emotions-Gaming, an independent studio from Germany",
        title: "Heistline: cops against criminals, played by real people.",
        text: "Heistline is a heist MMO: one side plans breakouts and robberies, the other hunts them down, in co-op and head to head. We worked on its development. The game is free to play and announced on Steam.",
        icon: "gamepad",
        kind: "game",
        reference: {
          facts: ["Multiplayer: co-op and PvP", "Free to play", "Steam, Windows", "German and English"],
          image: { src: "/images/work/heistline-vault.webp", alt: "Scene from Heistline: a masked robber stacks cash in the vault while an accomplice comes through the open vault door", width: 1600, height: 517 },
          links: [
            { label: "Heistline on Steam", href: "https://store.steampowered.com/app/3613860/Heistline/" },
            { label: "heistline.de", href: "https://heistline.de/" },
          ],
        },
      },
      {
        tab: "Mr. Dork 3",
        client: "MayStudios and Simsalabim Studio",
        title: "Mr. Dork 3: a platformer on notebook paper.",
        text: "Mr. Dork 3: One Last Doodle is a 2D platformer with puzzles, built in Unreal Engine. A stick figure jumps across rulers and pencils: 30 levels, two-player co-op, split-screen battles and endless levels. The game is announced on Steam, more platforms will follow.",
        icon: "gamepad",
        kind: "game",
        reference: {
          facts: ["Unreal Engine", "Co-op and split screen", "30 levels", "Steam, Windows"],
          image: { src: "/images/work/mrdork3-level.webp", alt: "Level from Mr. Dork 3: a stick figure jumps across rulers and pencils on lined paper towards the goal flag", width: 1600, height: 900 },
          links: [
            { label: "Mr. Dork 3 on Steam", href: "https://store.steampowered.com/app/3274870/Mr_Dork_3_One_Last_Doodle/" },
            { label: "mrdork3.com", href: "https://mrdork3.com/" },
          ],
        },
      },
      {
        tab: "Mid-sized",
        kind: "software",
        client: "Machine builder from the Bergisches Land region",
        title: "A customer portal replaces spreadsheets and status calls.",
        text: "Orders, delivery dates and spare parts lived in three systems. We built a portal that pulls the data from the ERP and lets customers check their order status themselves.",
        quote: "Our sales team talks to customers about new machines again, not about delivery dates.",
        role: "Managing director, machine building",
        icon: "server",
        example: true,
      },
      {
        tab: "Apps",
        kind: "apps",
        client: "Gym chain with twelve locations",
        title: "Booking a class takes two taps instead of a queue at the desk.",
        text: "The chain wanted its own app rather than a third-party booking platform. We built it with Flutter for iOS and Android and connected it to the existing membership system.",
        quote: "Most bookings now come through the app, and the front desk has time for advice again.",
        role: "Head of digital, gym chain",
        icon: "phone",
        example: true,
      },
      {
        tab: "AI",
        kind: "ai",
        client: "Online retailer for spare parts",
        title: "An AI assistant handles the routine questions in customer service.",
        text: "Many requests were about fit and delivery. Our assistant answers from product data and manuals and hands difficult cases to the team with everything they need.",
        quote: "The team now spends its time on the cases where it is really needed.",
        role: "Head of customer service, online retail",
        icon: "chip",
        example: true,
      },
    ],
  },
  process: {
    title: "How we work.",
    prototype: { live: "Live", build: "Building", thanks: "Thanks!", play: "Resume automatic steps", pause: "Pause automatic steps" },
    intro: "You see interim results and help decide what comes next.",
    steps: [
      {
        title: "Getting to know you",
        text: "You tell us about your plans, we ask the questions that decide scope and technology. The first conversation costs you nothing.",
        scene: "/images/scenes/meet",
        sceneAlt: "The product is still a sketch on paper, next to a lightbulb.",
        example: true,
      },
      {
        title: "Concept and quote",
        text: "You get a clear scope, a timeline and a quote you can follow. If the idea is still uncertain, we start with a small prototype.",
        scene: "/images/scenes/concept",
        sceneAlt: "The sketch becomes a grey wireframe with placeholders.",
      },
      {
        title: "Development in stages",
        text: "We work in short stages. Every two weeks you see a working build and help decide what comes next.",
        scene: "/images/scenes/build",
        sceneAlt: "The wireframe fills with colour and content while the robot codes next to it.",
        example: true,
      },
      {
        title: "Launch and handover",
        text: "We take the product live, hand over code and documentation, and stay on as your partner for the next versions if you like.",
        scene: "/images/scenes/launch",
        sceneAlt: "The finished product lights up and a rocket lifts off.",
      },
    ],
  },
  faq: {
    title: "Questions we hear often.",
    more: {
      title: "Your question is not here?",
      text: "Write to us. You will get a personal answer, not a canned reply.",
      cta: "Ask a question",
    },
    items: [
      {
        question: "What does a project cost?",
        answer:
          "That depends on the scope. After the first conversation you get a quote, either for a fixed scope or as a block of hours. A prototype often takes a few weeks; larger projects are planned in stages.",
        example: true,
      },
      {
        question: "How soon can you start?",
        answer: "Usually within two weeks of the go-ahead. If it is urgent, tell us in the first conversation.",
        example: true,
      },
      {
        question: "Do you work with our existing code or team?",
        answer: "Yes. We join running projects, take over single modules or work with your team in the same repository.",
        example: true,
      },
      {
        question: "Who owns the code and the rights in the end?",
        answer: "You do. Once paid in full, the rights to the code we developed pass to you, as set out in the contract.",
        example: true,
      },
      {
        question: "Do you only work locally?",
        answer:
          "No. We are based in Monheim am Rhein and work with clients across Germany and abroad. We are happy to come by for workshops.",
        example: true,
      },
      {
        question: "Do you use AI in your own development?",
        answer:
          "Yes, deliberately. AI tools take on routine work and help with testing. People decide on architecture and quality, and every change is reviewed.",
        example: true,
      },
    ],
  },
  contact: {
    title: "Tell us about your project.",
    text: "A few sentences about your idea are enough. We will get back to you with a first assessment and a suggested date to talk.",
    emailLabel: "Email",
    email: null,
    missingEmail: "[OPEN: contact email address]",
    button: "Write an email",
    toForm: "Open the contact form",
    promise: { text: "Reply within one working day", example: true },
  },
  footer: {
    columns: [
      {
        title: "Services",
        links: [
          { label: "Game development", href: "/en/#games" },
          { label: "Software development", href: "/en/#software" },
          { label: "App development", href: "/en/#apps" },
          { label: "AI & machine learning", href: "/en/#ai" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Work", href: "/en/#work" },
          { label: "Process", href: "/en/#process" },
          { label: "Questions", href: "/en/#questions" },
          { label: "Contact", href: "/en/#contact" },
        ],
      },
      {
        title: "Legal (German)",
        links: [
          { label: "Impressum", href: "/impressum/" },
          { label: "Datenschutz", href: "/datenschutz/" },
        ],
      },
    ],
    company: "Sentrix Code GmbH i. G.",
    tagline: "Games, software, apps and AI on commission. From Monheim am Rhein, Germany.",
  },
};
