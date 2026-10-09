"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Dictionary } from "@/content/types";
import { PixelLogo } from "@/components/brand/PixelLogo";
import { PixelRobot } from "@/components/brand/PixelCharacters";
import { MotionSwitch } from "@/components/motion/MotionSwitch";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { LanguageSwitch } from "./LanguageSwitch";

const BANDS = ["#00b4d8", "#0096c7", "#0077b6", "#023e8a"];

type FooterProps = { dict: Dictionary; alternateHref?: string };

// The big pixel logo rises out of the ocean bands as the page end comes into view and
// sinks again when scrolling back up, with the robot sitting in the chevron.
export function Footer({ dict, alternateHref }: FooterProps) {
  const { pages } = dict;
  const { reduced } = useMotionPolicy();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end end"] });
  const rise = useSpring(useTransform(scrollYProgress, [0, 1], [100, 0]), { stiffness: 120, damping: 22 });
  const riseY = useTransform(rise, (value) => `${reduced ? 0 : value}%`);

  const columns = [
    {
      title: pages.menu.services,
      links: pages.services.map((service) => ({ label: service.nav, href: pages.routes.services[service.kind] })),
    },
    {
      title: pages.menu.company,
      links: [
        { label: pages.menu.about, href: pages.routes.about },
        { label: dict.nav.cases, href: `${pages.routes.home}#${dict.anchors.cases}` },
        { label: dict.nav.process, href: `${pages.routes.home}#${dict.anchors.process}` },
        { label: dict.nav.contact, href: pages.routes.contact },
      ],
    },
    {
      title: dict.footer.columns[2].title,
      links: [
        { label: "Impressum", href: pages.routes.imprint },
        { label: "Datenschutz", href: pages.routes.privacy },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-16 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <p className="font-medium">{dict.footer.company}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{dict.footer.tagline}</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm text-muted">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1 text-sm text-fg/90 transition-colors duration-150 hover:text-ocean-300">
                    <span className="h-px w-0 bg-ocean-300 transition-all duration-200 group-hover:w-2.5" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6 border-t border-line px-6 py-6">
        <p className="text-xs text-muted">© 2026 {dict.footer.company}</p>
        <div className="flex flex-wrap items-center gap-5">
          <MotionSwitch locale={dict.locale} />
          <LanguageSwitch locale={dict.locale} alternateHref={alternateHref ?? dict.nav.switchLanguage.href} />
        </div>
      </div>

      {/* Stage: the logo rises from behind the bands. */}
      <div ref={stage} aria-hidden="true" className="relative mt-4 h-[clamp(140px,22vw,300px)] overflow-hidden">
        <motion.div className="absolute inset-x-0 bottom-0 flex justify-center" style={{ y: riseY }}>
          <div className="relative w-[min(78vw,640px)]">
            <PixelLogo />
            <div className="absolute bottom-[34%] left-[2%] w-[9%]">
              <PixelRobot className="w-full" />
            </div>
          </div>
        </motion.div>
      </div>
      <div aria-hidden="true" className="relative">
        {BANDS.map((color) => (
          <div key={color} className="h-6 md:h-7" style={{ background: color }} />
        ))}
      </div>
    </footer>
  );
}
