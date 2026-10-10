import type { Pages } from "./pages.types";

export type Locale = "de" | "en";

// Content marked `example: true` is invented placeholder content. It must be replaced,
// confirmed or removed before the site launches on its own domain (WEBSITE.md,
// "Wahrheit vor Wirkung").

export type ServiceVisualKind = "game" | "software" | "apps" | "ai";

export type ServiceItem = {
  id: string;
  visual: ServiceVisualKind;
  nav: string;
  title: string;
  text: string;
  tags: string[];
  cta: string;
  imageAlt: string;
};

// Texts shown inside the illustrative UI mock-ups of the service panels.
// Our own apps (real, from the founders' projects). `screen` and `icon` are optional:
// apps without published artwork are listed by name and text only.
export type AppShowcase = { name: string; text: string; icon?: string; screen?: string; screenAlt?: string };

export type ServiceMockups = {
  codeFile: string;
  code: string[][];
  buildPassed: string;
  appNotes: string[];
  aiPrompts: string[];
  example: true;
};

// Hand-drawn pixel icons (src/components/brand/PixelIcon.tsx).
export type IconName = "idea" | "concept" | "prototype" | "design" | "code" | "test" | "rocket" | "chip" | "server" | "phone" | "gamepad" | "robot";

// A real project we worked on: facts from public sources, official images, links.
export type CaseReference = {
  facts: string[];
  image: { src: string; alt: string; width: number; height: number };
  links: { label: string; href: string }[];
};

// Practice cases. Invented examples carry `example: true` and a quote; real references
// carry `reference` and never an invented quote (WEBSITE.md, "Wahrheit vor Wirkung").
export type CaseItem = {
  tab: string;
  client: string;
  title: string;
  text: string;
  icon: IconName;
  // Which service page shows this case.
  kind: ServiceVisualKind;
  quote?: string;
  role?: string;
  reference?: CaseReference;
  example?: true;
};

export type ProcessStep = {
  title: string;
  text: string;
  scene: string;
  sceneAlt: string;
  example?: true;
};

export type FaqItem = { question: string; answer: string; example?: true };

export type Dictionary = {
  locale: Locale;
  pages: Pages;
  meta: { title: string; description: string };
  anchors: { services: string; cases: string; process: string; faq: string; contact: string };
  nav: {
    services: string;
    cases: string;
    process: string;
    contact: string;
    cta: string;
    menu: string;
    close: string;
    switchLanguage: { label: string; href: string; short: string };
  };
  hero: {
    headlineA: string;
    headlineB: string;
    subline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  tech: { label: string; items: string[] };
  // Terms in the brick grid under the statement, read in rows of three. Muted terms
  // stay grey and hide their icon until they are hovered.
  statement: { title: string; chips: { label: string; icon: IconName; muted?: true }[] };
  positioning: string;
  services: { title: string; items: ServiceItem[]; mockups: ServiceMockups; apps: { title: string; items: AppShowcase[] } };
  cases: { title: string; cta: string; items: CaseItem[] };
  process: { title: string; intro: string; steps: ProcessStep[]; prototype: { live: string; build: string; thanks: string; revenue: string; play: string; pause: string } };
  faq: { title: string; items: FaqItem[]; more: { title: string; text: string; cta: string } };
  contact: {
    title: string;
    text: string;
    emailLabel: string;
    // null until the project owner supplies the address (WEBSITE.md, "Offene Punkte").
    email: string | null;
    missingEmail: string;
    button: string;
    toForm: string;
    promise: { text: string; example: true };
  };
  footer: {
    columns: { title: string; links: { label: string; href: string }[] }[];
    company: string;
    tagline: string;
  };
};
