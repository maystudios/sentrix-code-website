"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import { spring } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { PixelRobot } from "@/components/brand/PixelCharacters";

export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section id={dict.anchors.faq} className="border-b border-line">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <RevealHeading text={dict.faq.title} className="text-h2" />
          <motion.div
            className="mt-10 flex items-end gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.ui}
          >
            <PixelRobot className="w-16 shrink-0" watching />
            <div>
              <p className="font-medium">{dict.faq.more.title}</p>
              <p className="mt-2 text-sm text-muted">{dict.faq.more.text}</p>
              <Button href={dict.pages.routes.contact} size="sm" variant="secondary" className="mt-4">
                {dict.faq.more.cta}
              </Button>
            </div>
          </motion.div>
        </div>
        <FaqList items={dict.faq.items} />
      </div>
    </section>
  );
}
