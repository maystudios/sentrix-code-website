"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Dictionary, ServiceVisualKind } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { Mosaic } from "@/components/ui/Mosaic";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { TextLink } from "@/components/ui/TextLink";
import { ContactCta } from "@/components/site/ContactCta";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "./PageHero";

const ROLE_SPRITES: Record<ServiceVisualKind, string> = {
  game: "/images/sprites/robot-gamer.webp",
  software: "/images/sprites/robot-coder.webp",
  apps: "/images/sprites/robot-phone.webp",
  ai: "/images/sprites/robot-ai.webp",
};

const CASE_INDEX: Record<ServiceVisualKind, number> = { game: 0, software: 1, apps: 2, ai: 3 };

export function ServicePage({ dict, kind, alternateHref }: { dict: Dictionary; kind: ServiceVisualKind; alternateHref: string }) {
  const { pages } = dict;
  const service = pages.services.find((entry) => entry.kind === kind)!;
  const example = dict.cases.items[CASE_INDEX[kind]];
  const others = pages.services.filter((entry) => entry.kind !== kind);

  return (
    <SiteShell dict={dict} alternateHref={alternateHref}>
      <PageHero
        breadcrumb={[
          { label: "Sentrix Code", href: pages.routes.home },
          { label: pages.menu.services, href: `${pages.routes.home}#${dict.anchors.services}` },
          { label: service.nav },
        ]}
        title={service.hero.title}
        intro={service.hero.intro}
        scene={service.hero.scene}
        sceneAlt={service.hero.sceneAlt}
        sprite={ROLE_SPRITES[kind]}
        actions={
          <>
            <Button href={pages.routes.contact}>{dict.nav.cta}</Button>
            <Button href={`${pages.routes.home}#${dict.anchors.cases}`} variant="secondary">
              {dict.nav.cases}
            </Button>
          </>
        }
      />

      {/* What we deliver: sticky title, rows that react to the pointer. */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <RevealHeading text={service.offer.title} className="text-h2 lg:sticky lg:top-28 lg:self-start" />
          <ul className="border-t border-line">
            {service.offer.items.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, ease: ease.outExpo, delay: index * 0.06 }}
                whileHover="hover"
                className="group relative grid grid-cols-[56px_1fr] gap-5 border-b border-line py-7"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-4 -right-4 -z-10 origin-left rounded-[var(--radius-card)] bg-surface"
                  initial={{ scaleX: 0, opacity: 0 }}
                  variants={{ hover: { scaleX: 1, opacity: 1 } }}
                  transition={{ duration: 0.35, ease: ease.outExpo }}
                />
                <motion.img
                  src={asset(item.icon)}
                  alt=""
                  className="size-12 object-contain"
                  variants={{ hover: { y: -6, rotate: -8 } }}
                  transition={spring.playful}
                />
                <div>
                  <h3 className="text-xl font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-2 max-w-lg text-muted">{item.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stack */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <h2 className="text-sm text-muted">{service.stack.title}</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {service.stack.items.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...spring.playful, delay: index * 0.05 }}
                whileHover={{ y: -4, transition: spring.ui }}
                className="rounded-[var(--radius-control)] border border-line-strong bg-surface px-4 py-2.5 font-mono text-sm text-ocean-300"
              >
                <span className="text-line-strong">[</span> {item} <span className="text-line-strong">]</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* A matching example from practice. */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1280px] lg:grid-cols-[1.1fr_1fr]">
          <div className="px-6 py-20 lg:pr-12">
            <p className="text-sm text-muted">{example.client}</p>
            <RevealHeading text={example.title} className="text-h2 mt-3" />
            <p className="mt-5 max-w-xl text-muted">{example.text}</p>
            <TextLink href={`${pages.routes.home}#${dict.anchors.cases}`} className="mt-8">
              {dict.cases.cta}
            </TextLink>
          </div>
          <figure className="relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden bg-ocean-900 p-8 lg:p-12">
            <Mosaic className="absolute inset-0 -z-10 opacity-60" columns={12} rows={9} from={1} to={4} seed={CASE_INDEX[kind] + 4} />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ocean-950/90 via-ocean-900/40 to-transparent" />
            <img src={asset(example.sprite)} alt="" className="absolute right-8 top-8 w-16 object-contain" />
            <blockquote className="text-2xl font-medium leading-snug tracking-tight text-white md:text-[28px]">
              {dict.locale === "de" ? `„${example.quote}“` : `“${example.quote}”`}
            </blockquote>
            <figcaption className="mt-5 text-sm text-ocean-100/80">{example.role}</figcaption>
          </figure>
        </div>
      </section>

      {/* Questions */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <RevealHeading text={pages.shared.questionsTitle} className="text-h2" />
          <FaqList items={service.questions} />
        </div>
      </section>

      <ContactCta dict={dict} title={service.cta.title} text={service.cta.text} />

      {/* Other services */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <h2 className="text-sm text-muted">{pages.shared.moreServices}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {others.map((other) => (
              <li key={other.kind}>
                <Link
                  href={pages.routes.services[other.kind]}
                  className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line p-4 transition-colors duration-150 hover:border-line-strong hover:bg-surface"
                >
                  <img src={asset(other.icon)} alt="" className="size-10 object-contain transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6" />
                  <span>
                    <span className="block font-medium">{other.nav}</span>
                    <span className="block text-sm text-muted">{other.menuText}</span>
                  </span>
                  <span className="ml-auto text-ocean-400 transition-transform duration-200 group-hover:translate-x-1">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
