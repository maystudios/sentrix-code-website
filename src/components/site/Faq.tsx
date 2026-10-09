"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import { spring } from "@/lib/motion";
import { FaqList } from "@/components/ui/FaqList";
import { PixelRobot } from "@/components/brand/PixelCharacters";

export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section id={dict.anchors.faq} className="border-b border-line">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative">
          <h2 className="text-h2 lg:sticky lg:top-28">{dict.faq.title}</h2>
          <motion.div
            aria-hidden="true"
            className="mt-10 hidden w-24 lg:sticky lg:top-56 lg:block"
            whileHover={{ rotate: -8 }}
            transition={spring.playful}
          >
            <PixelRobot className="w-full" />
          </motion.div>
        </div>
        <FaqList items={dict.faq.items} />
      </div>
    </section>
  );
}
