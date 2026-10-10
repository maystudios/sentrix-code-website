"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import { duration, ease, spring } from "@/lib/motion";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { TiltPanel } from "@/components/ui/TiltPanel";

type PageHeroProps = {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  intro: string;
  scene: string;
  sceneAlt: string;
  sprite?: string;
  actions?: ReactNode;
};

// Hero for sub-pages: words rise out of a mask, the scene tilts towards the pointer and
// a role figure of the robot sits on the panel's edge.
export function PageHero({ breadcrumb, title, intro, scene, sceneAlt, sprite, actions }: PageHeroProps) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 pb-20 pt-32 md:pt-36 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo }}
          >
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {breadcrumb.map((item, index) => (
                <li key={item.label} className="flex items-center gap-2">
                  {item.href ? (
                    <Link href={item.href} transitionTypes={["nav-back"]} className="transition-colors duration-150 hover:text-fg">
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-fg">
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumb.length - 1 && <span aria-hidden="true" className="text-line-strong">/</span>}
                </li>
              ))}
            </ol>
          </motion.nav>
          <RevealHeading as="h1" text={title} trigger="mount" delay={0.1} className="text-h2-xl mt-6 max-w-xl" />
          <motion.p
            className="text-body-lg mt-6 max-w-xl text-muted"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.45 }}
          >
            {intro}
          </motion.p>
          {actions && (
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.6 }}
            >
              {actions}
            </motion.div>
          )}
        </div>
        <div className="relative">
          <TiltPanel>
            <img
              src={asset(`${scene}.webp`)}
              srcSet={`${asset(`${scene}-800.webp`)} 800w, ${asset(`${scene}.webp`)} 1600w`}
              sizes="(min-width: 1024px) 620px, 92vw"
              alt={sceneAlt}
              width={1600}
              height={900}
              className="block aspect-video w-full object-cover"
            />
          </TiltPanel>
          {sprite && (
            <motion.img
              src={asset(sprite)}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, y: -60, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ ...spring.playful, delay: 0.8 }}
              whileHover={{ y: -10, rotate: -6, transition: spring.ui }}
              className="absolute -bottom-8 -left-4 w-24 drop-shadow-[0_8px_0_rgba(3,4,94,0.45)] md:-left-8 md:w-32"
            />
          )}
        </div>
      </div>
    </section>
  );
}
