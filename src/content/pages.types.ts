import type { FaqItem, IconName, ServiceVisualKind } from "./types";

// Sub-page content. Same marking rule as the home page: `example: true` is invented
// placeholder content and needs replacing before launch (WEBSITE.md, "Wahrheit vor Wirkung").

export type Routes = {
  home: string;
  services: Record<ServiceVisualKind, string>;
  about: string;
  contact: string;
  imprint: string;
  privacy: string;
};

export type ServiceDetail = {
  kind: ServiceVisualKind;
  nav: string;
  menuText: string;
  icon: IconName;
  meta: { title: string; description: string };
  hero: { title: string; intro: string; scene: string; sceneAlt: string };
  offer: { title: string; items: { title: string; text: string; icon: IconName }[] };
  stack: { title: string; items: string[] };
  questions: FaqItem[];
  cta: { title: string; text: string };
};

export type AboutPage = {
  meta: { title: string; description: string };
  hero: { title: string; intro: string; scene: string; sceneAlt: string };
  story: { title: string; paragraphs: string[]; example: true };
  founders: {
    title: string;
    people: { name: string; initials: string; role: string; text: string; example: true }[];
  };
  location: { title: string; text: string };
  principles: { title: string; items: { text: string; icon: IconName }[]; example: true };
};

export type ContactPage = {
  meta: { title: string; description: string };
  title: string;
  intro: string;
  scene: string;
  sceneAlt: string;
  form: {
    name: string;
    email: string;
    company: string;
    topic: string;
    topics: string[];
    message: string;
    messageHint: string;
    consent: string;
    privacyLabel: string;
    submit: string;
    required: string;
    invalidEmail: string;
    tooShort: string;
    // Shown while no form service or address is connected (WEBSITE.md, "Offene Punkte").
    unavailable: string;
    sent: string;
  };
  aside: { title: string; text: string; response: { text: string; example: true } };
};

export type NotFoundPage = { title: string; text: string; home: string };

export type MenuCopy = {
  services: string;
  company: string;
  about: string;
  allServices: string;
  previewCta: string;
};

export type Pages = {
  routes: Routes;
  menu: MenuCopy;
  services: ServiceDetail[];
  about: AboutPage;
  contact: ContactPage;
  notFound: NotFoundPage;
  shared: { backToTop: string; moreServices: string; questionsTitle: string; stackTitle: string };
};
