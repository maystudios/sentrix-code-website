"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Mosaic } from "@/components/ui/Mosaic";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ContactCta } from "@/components/site/ContactCta";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "./PageHero";

// Rhine between Düsseldorf and Köln as pixel cells on a 24 x 16 grid (schematic, not to scale).
const RIVER = [
  [14, 0], [14, 1], [13, 2], [13, 3], [12, 4], [11, 5], [11, 6], [10, 7], [10, 8], [11, 9], [12, 10], [12, 11], [11, 12], [10, 13], [10, 14], [9, 15],
];
const CITIES = [
  { name: "Düsseldorf", x: 16, y: 2 },
  { name: "Köln", x: 13, y: 14 },
];
const HOME = { name: "Monheim am Rhein", x: 12, y: 7 };

function PixelMap() {
  return (
    <svg viewBox="0 0 24 16" className="w-full" shapeRendering="crispEdges" aria-hidden="true">
      {Array.from({ length: 24 * 16 }, (_, index) => (
        <rect key={index} x={(index % 24) + 0.45} y={Math.floor(index / 24) + 0.45} width={0.1} height={0.1} fill="#2b364a" />
      ))}
      {RIVER.map(([x, y], index) => (
        <motion.rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={2}
          height={1.02}
          fill="#0096c7"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04 }}
        />
      ))}
      {CITIES.map((city) => (
        <g key={city.name}>
          <rect x={city.x} y={city.y} width={1} height={1} fill="#8691a6" />
          <text x={city.x + 1.6} y={city.y + 0.85} fontSize="0.9" fill="#8691a6" fontFamily="var(--font-mono)">
            {city.name}
          </text>
        </g>
      ))}
      <motion.g
        initial={{ y: -4, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ...spring.playful, delay: 0.8 }}
      >
        <g className="ambient animate-bob">
          <rect x={HOME.x + 2.6} y={HOME.y - 1} width={1.6} height={1.6} fill="#48cae4" />
          <rect x={HOME.x + 3.1} y={HOME.y + 0.6} width={0.6} height={0.8} fill="#48cae4" />
        </g>
        <text x={HOME.x + 4.8} y={HOME.y + 0.2} fontSize="1" fill="#f3f6fa" fontFamily="var(--font-mono)">
          {HOME.name}
        </text>
      </motion.g>
    </svg>
  );
}

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
                  <Mosaic className="absolute inset-0 -z-10" columns={14} rows={5} from={index === 0 ? 1 : 5} to={index === 0 ? 5 : 1} seed={index + 21} />
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
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-24 lg:grid-cols-2">
          <div>
            <RevealHeading text={about.location.title} className="text-h2" />
            <p className="text-body-lg mt-5 max-w-lg text-muted">{about.location.text}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <PixelMap />
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
                <motion.img
                  src={asset(item.sprite)}
                  alt=""
                  className="size-14 shrink-0 object-contain"
                  variants={{ hover: { rotate: index % 2 === 0 ? -10 : 10, scale: 1.12 } }}
                  transition={spring.playful}
                />
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
