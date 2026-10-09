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
export type ServiceMockups = {
  codeFile: string;
  code: string[][];
  buildPassed: string;
  appNotes: string[];
  aiPrompts: string[];
  example: true;
};

export type CaseItem = {
  tab: string;
  client: string;
  title: string;
  text: string;
  quote: string;
  role: string;
  sprite: string;
  example: true;
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
  statement: { title: string; chips: string[] };
  positioning: string;
  services: { title: string; items: ServiceItem[]; mockups: ServiceMockups };
  cases: { title: string; cta: string; items: CaseItem[] };
  process: { title: string; intro: string; steps: ProcessStep[] };
  faq: { title: string; items: FaqItem[] };
  contact: {
    title: string;
    text: string;
    emailLabel: string;
    // null until the project owner supplies the address (WEBSITE.md, "Offene Punkte").
    email: string | null;
    missingEmail: string;
    button: string;
    promise: { text: string; example: true };
  };
  footer: {
    columns: { title: string; links: { label: string; href: string }[] }[];
    company: string;
    tagline: string;
  };
};
