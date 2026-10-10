"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Dictionary } from "@/content/types";
import { ease, spring } from "@/lib/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { Mosaic } from "@/components/ui/Mosaic";
import { TextLink } from "@/components/ui/TextLink";
import { PixelIcon } from "@/components/brand/PixelIcon";
import { ReferenceFigure, ReferenceLinks } from "./ReferenceFigure";

// Practice by project, laid out like the reference's customer section: tabs, the story in
// the middle, on the right the project's image (real references) or the quote (examples).
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
              <PixelIcon name={entry.icon} px={2} className="relative" />
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
              <p className="text-sm text-ocean-300">{item.client}</p>
              <h3 className="text-h3 mt-2">{item.title}</h3>
              <p className="mt-4 text-muted">{item.text}</p>
              {item.reference && (
                <div className="mt-6">
                  <ReferenceLinks reference={item.reference} />
                </div>
              )}
              <TextLink href={`#${dict.anchors.contact}`} className="mt-auto pt-8">
                {dict.cases.cta}
              </TextLink>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center p-6 lg:border-l lg:border-line lg:p-10">
          <AnimatePresence mode="wait">
            {item.reference ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: ease.outExpo }}
                className="w-full"
              >
                <ReferenceFigure reference={item.reference} title={item.tab} />
              </motion.div>
            ) : (
              <motion.figure
                key={active}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: ease.outExpo }}
                className="relative w-full overflow-hidden rounded-[var(--radius-card)] border border-ocean-400/30 bg-surface shadow-[inset_0_0_0_1px_rgba(72,202,228,0.08)]"
              >
                <div className="p-7">
                  <span aria-hidden="true" className="font-mono text-4xl leading-none text-ocean-400">„</span>
                  <blockquote className="mt-2 text-xl font-medium leading-snug tracking-tight md:text-2xl">{item.quote}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-sm text-muted">
                    <PixelIcon name={item.icon} px={2} />
                    {item.role}
                  </figcaption>
                </div>
                <Mosaic className="h-6" tile={24} from={1} to={5} direction="horizontal" seed={active + 2} twinkle={false} />
              </motion.figure>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
