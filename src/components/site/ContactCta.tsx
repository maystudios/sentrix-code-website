"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { Dictionary } from "@/content/types";
import { ease, spring } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Mosaic } from "@/components/ui/Mosaic";
import { PixelRocket } from "@/components/brand/PixelCharacters";

export function ContactCta({ dict, title, text }: { dict: Dictionary; title?: string; text?: string }) {
  const [launch, setLaunch] = useState(false);
  const email = dict.contact.email;

  return (
    <section id={dict.anchors.contact} className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: ease.outExpo }}
          className="relative overflow-hidden rounded-[var(--radius-card)] border border-line"
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="bg-surface p-8 md:p-14">
              <h2 className="text-h2-xl max-w-xl">{title ?? dict.contact.title}</h2>
              <p className="text-body-lg mt-5 max-w-lg text-muted">{text ?? dict.contact.text}</p>
              <p className="mt-8 text-sm">
                <span className="text-muted">{dict.contact.emailLabel}: </span>
                {email ? (
                  <a href={`mailto:${email}`} className="text-ocean-400 underline-offset-4 hover:underline">
                    {email}
                  </a>
                ) : (
                  <span className="font-mono text-ocean-300">{dict.contact.missingEmail}</span>
                )}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {email ? (
                  <Button href={`mailto:${email}`} onHoverChange={setLaunch}>
                    {dict.contact.button}
                  </Button>
                ) : (
                  <Button href={dict.pages.routes.contact} onHoverChange={setLaunch}>
                    {dict.contact.toForm}
                  </Button>
                )}
                <span className="flex items-center gap-2 text-sm text-muted">
                  <span className="size-2 rounded-full bg-ocean-400" />
                  {dict.contact.promise.text}
                </span>
              </div>
            </div>
            <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden">
            <Mosaic className="absolute inset-0" tile={28} from={1} to={6} direction="horizontal" seed={11} />
            <motion.div
              aria-hidden="true"
              className="relative w-28 md:w-36"
              animate={launch ? { y: -22, rotate: -4 } : { y: 0, rotate: 0 }}
              transition={spring.playful}
            >
              <PixelRocket engine={launch ? "roar" : "idle"} className="ambient w-full animate-bob" />
            </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
