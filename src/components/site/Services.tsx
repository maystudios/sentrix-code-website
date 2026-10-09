"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Dictionary, ServiceItem, ServiceMockups } from "@/content/types";
import { ease, spring } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { TextLink } from "@/components/ui/TextLink";
import { TiltPanel } from "@/components/ui/TiltPanel";
import { AiVisual, AppsVisual, GameVisual, SoftwareVisual } from "./ServiceVisuals";

function Visual({ item, mockups }: { item: ServiceItem; mockups: ServiceMockups }) {
  switch (item.visual) {
    case "game":
      return <GameVisual alt={item.imageAlt} />;
    case "software":
      return <SoftwareVisual mockups={mockups} />;
    case "apps":
      return <AppsVisual mockups={mockups} />;
    case "ai":
      return <AiVisual mockups={mockups} />;
  }
}

export function Services({ dict }: { dict: Dictionary }) {
  const items = dict.services.items;
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <section id={dict.anchors.services} className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-24 md:pt-32">
        <h2 className="text-h2-xl max-w-2xl">{dict.services.title}</h2>
      </div>

      <div className="mx-auto grid max-w-[1280px] lg:grid-cols-[260px_1fr]">
        <nav aria-label={dict.nav.services} className="hidden lg:block">
          <ul className="sticky top-24 m-6 overflow-hidden rounded-[var(--radius-card)] border border-line">
            {items.map((item) => (
              <li key={item.id} className="border-b border-line last:border-b-0">
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`relative flex items-center justify-between px-4 py-3 text-sm transition-colors duration-150 ${
                    active === item.id ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active === item.id && (
                    <motion.span layoutId="service-active" className="absolute inset-0 bg-raised" transition={spring.ui} />
                  )}
                  <span className="relative">{item.nav}</span>
                  {active === item.id && (
                    <motion.span
                      className="relative"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={spring.ui}
                    >
                      <Arrow className="size-4" />
                    </motion.span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:border-l lg:border-line">
          {items.map((item, index) => (
            <article
              key={item.id}
              id={item.id}
              className="grid items-center gap-10 border-t border-line px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-20 lg:px-10"
            >
              <motion.div
                className={index % 2 === 1 ? "md:order-2" : ""}
                initial={{ opacity: 0, x: index % 2 === 1 ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.8, ease: ease.outExpo }}
              >
                <h3 className="text-h3">{item.title}</h3>
                <p className="mt-4 max-w-md text-muted">{item.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-[var(--radius-control)] border border-line px-2.5 py-1 font-mono text-xs text-ocean-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <TextLink href={`#${dict.anchors.contact}`} className="mt-8">
                  {item.cta}
                </TextLink>
              </motion.div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <TiltPanel>
                  <Visual item={item} mockups={dict.services.mockups} />
                </TiltPanel>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
