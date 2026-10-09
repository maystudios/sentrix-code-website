"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Dictionary } from "@/content/types";
import { asset } from "@/lib/asset";
import { ease, spring } from "@/lib/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { Mosaic } from "@/components/ui/Mosaic";
import { TextLink } from "@/components/ui/TextLink";

// Practice examples by sector, laid out like the reference's customer section:
// sector tabs, the story in the middle, the quote on a coloured panel.
export function Cases({ dict }: { dict: Dictionary }) {
  const items = dict.cases.items;
  const [active, setActive] = useState(0);
  const item = items[active];
  const { tabProps } = useRovingTabs(items.length, active, setActive, "vertical");

  return (
    <section id={dict.anchors.cases} className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-24 md:pt-32">
        <h2 className="text-h2 max-w-2xl">{dict.cases.title}</h2>
      </div>

      <div className="mx-auto grid max-w-[1280px] border-t border-line lg:grid-cols-[220px_1fr_1.15fr]">
        <div role="tablist" aria-label={dict.cases.title} aria-orientation="vertical" className="flex overflow-x-auto border-b border-line lg:flex-col lg:border-b-0 lg:border-r">
          {items.map((entry, index) => (
            <button
              key={entry.tab}
              type="button"
              role="tab"
              id={`case-tab-${index}`}
              aria-selected={active === index}
              aria-controls="case-panel"
              {...tabProps(index)}
              onClick={() => setActive(index)}
              className={`relative flex shrink-0 items-center gap-3 border-r border-line px-5 py-5 text-left transition-colors duration-150 lg:border-b lg:border-r-0 ${
                active === index ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {active === index && (
                <motion.span layoutId="case-active" className="absolute inset-0 bg-surface" transition={spring.ui} />
              )}
              <img src={asset(entry.sprite)} alt="" className="relative size-7 object-contain" />
              <span className="relative text-[15px] font-medium">{entry.tab}</span>
            </button>
          ))}
        </div>

        <div id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${active}`} className="relative min-h-[360px] p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: ease.outExpo }}
              className="flex h-full flex-col"
            >
              <motion.img
                src={asset(item.sprite)}
                alt=""
                className="size-14 object-contain"
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={spring.playful}
              />
              <p className="mt-6 text-sm text-muted">{item.client}</p>
              <h3 className="text-h3 mt-2">{item.title}</h3>
              <p className="mt-4 text-muted">{item.text}</p>
              <TextLink href={`#${dict.anchors.contact}`} className="mt-auto pt-8">
                {dict.cases.cta}
              </TextLink>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative isolate min-h-[320px] overflow-hidden bg-ocean-900 lg:border-l lg:border-line">
          <Mosaic className="absolute inset-0 -z-10 opacity-60" columns={12} rows={9} from={1} to={4} seed={active + 2} />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ocean-950/90 via-ocean-900/40 to-transparent" />
          <AnimatePresence mode="wait">
            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: ease.outExpo }}
              className="flex h-full flex-col justify-end p-8 lg:p-10"
            >
              <blockquote className="text-2xl font-medium leading-snug tracking-tight text-white md:text-[28px]">
                {dict.locale === "de" ? `„${item.quote}“` : `“${item.quote}”`}
              </blockquote>
              <figcaption className="mt-5 text-sm text-ocean-100/80">{item.role}</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
