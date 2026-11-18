"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import { ease, spring } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Mosaic } from "@/components/ui/Mosaic";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ContactCta } from "@/components/site/ContactCta";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "./PageHero";
import { PixelIcon } from "@/components/brand/PixelIcon";

export function AboutPage({ dict, alternateHref }: { dict: Dictionary; alternateHref: string }) {
  const { pages } = dict;
  const about = pages.about;
  return (
    <SiteShell dict={dict} alternateHref={alternateHref}>
      <PageHero
        breadcrumb={[{ label: "Sentrix Code", href: pages.routes.home }, { label: pages.menu.about }]}
        title={about.hero.title}
        intro={about.hero.intro}
        scene={about.hero.scene}
        sceneAlt={about.hero.sceneAlt}
        actions={<Button href={pages.routes.contact}>{dict.nav.cta}</Button>}
      />

      <section className="overflow-x-clip border-b border-line">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <RevealHeading text={about.story.title} className="text-h2" />
          <div className="space-y-6">
            {about.story.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className="text-body-lg max-w-2xl text-fg/85"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease: ease.outExpo, delay: index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-x-clip border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <RevealHeading text={about.founders.title} className="text-h2" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {about.founders.people.map((person, index) => (
              <motion.article
                key={person.name}
                initial={{ opacity: 0, y: 30, rotate: index === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ ...spring.playful, delay: index * 0.12 }}
                whileHover={{ y: -6, transition: spring.ui }}
                className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface"
              >
                <div className="relative isolate flex h-40 items-end overflow-hidden p-6">
                  <Mosaic className="absolute inset-0 -z-10" tile={24} from={index === 0 ? 1 : 4} to={index === 0 ? 4 : 1} seed={index + 21} />
                  <span className="font-mono text-6xl font-medium text-white drop-shadow-[0_4px_0_rgba(3,4,94,0.6)]">{person.initials}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium tracking-tight">{person.name}</h3>
                  <p className="mt-1 text-sm text-ocean-300">{person.role}</p>
                  <p className="mt-4 text-muted">{person.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-x-clip border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <RevealHeading text={about.principles.title} className="text-h2" />
          <ol className="mt-12">
            {about.principles.items.map((item, index) => (
              <motion.li
                key={item.text}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease: ease.outExpo }}
                whileHover="hover"
                className={`flex items-center gap-6 border-t border-line py-8 last:border-b ${index % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""}`}
              >
                <motion.span
                  className="block shrink-0"
                  variants={{ hover: { rotate: index % 2 === 0 ? -10 : 10, scale: 1.12 } }}
                  transition={spring.playful}
                >
                  <PixelIcon name={item.icon} px={4} />
                </motion.span>
                <p className="text-h3 max-w-3xl">{item.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <ContactCta dict={dict} />
    </SiteShell>
  );
}
