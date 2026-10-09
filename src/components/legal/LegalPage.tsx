"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { de } from "@/content/de";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { PageHero } from "@/components/page/PageHero";
import { SiteShell } from "@/components/site/SiteShell";

export type LegalSection = { id: string; title: string; body: ReactNode };

type LegalPageProps = {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

// German legal pages with a sticky table of contents that follows the reading position.
// Drafts stay marked until the project owner has had them reviewed (WEBSITE.md, "Rechtliches").
export function LegalPage({ title, intro, updated, sections }: LegalPageProps) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <SiteShell dict={de} alternateHref="/en/">
      <PageHero
        breadcrumb={[{ label: "Sentrix Code", href: "/" }, { label: title }]}
        title={title}
        intro={intro}
        scene="/images/scenes/legal"
        sceneAlt="Pixel-Szene: der Roboter liest mit einer Lupe eine lange Papierrolle"
      />
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Inhalt" className="hidden lg:block">
            <ol className="sticky top-24 space-y-1 border-l border-line">
              {sections.map((section) => (
                <li key={section.id} className="relative">
                  {active === section.id && (
                    <motion.span layoutId="legal-active" className="absolute -left-px inset-y-0 w-px bg-ocean-400" transition={spring.ui} />
                  )}
                  <a
                    href={`#${section.id}`}
                    aria-current={active === section.id ? "true" : undefined}
                    className={`block py-1.5 pl-4 text-sm transition-colors duration-150 ${
                      active === section.id ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-10 inline-flex items-center gap-3 rounded-[var(--radius-control)] border border-line-strong bg-surface px-4 py-2.5 text-sm text-muted">
              <img src={asset("/images/icons/test.webp")} alt="" className="size-5 object-contain" />
              Entwurf, Stand {updated}. Vor der Veröffentlichung unter eigener Domain rechtlich prüfen.
            </p>
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.6, ease: ease.outExpo }}
                className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0"
              >
                <h2 className="flex items-baseline gap-4 text-2xl font-medium tracking-tight">
                  <span className="font-mono text-sm text-ocean-400">{index + 1}</span>
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 leading-relaxed text-fg/85 [&_a]:text-ocean-400 [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-fg [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.body}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function Open({ children }: { children: ReactNode }) {
  return <span className="font-mono text-sm text-ocean-300">[OFFEN: {children}]</span>;
}
