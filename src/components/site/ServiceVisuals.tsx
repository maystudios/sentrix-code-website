"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { IconName, ServiceMockups } from "@/content/types";
import { ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { Mosaic } from "@/components/ui/Mosaic";
import { PixelIcon } from "@/components/brand/PixelIcon";
import { PixelProp, type PropName } from "@/components/brand/PixelCharacters";

// Illustrative product UI inside the service panels. The mock-up texts come from
// src/content (services.mockups, marked as example; WEBSITE.md, "Wahrheit vor Wirkung").

function Sprite({ name, className, delay = 0 }: { name: PropName; className: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 14, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ...spring.playful, delay }}
      whileHover={{ y: -8, rotate: -6, transition: spring.ui }}
      className={`absolute ${className}`}
    >
      <PixelProp name={name} className="h-auto w-full drop-shadow-[0_6px_0_rgba(3,4,94,0.35)]" />
    </motion.div>
  );
}

const TOKEN_COLORS = ["text-ocean-300", "text-fg", "text-ocean-300", "text-ocean-400", "text-muted"];

export function SoftwareVisual({ mockups }: { mockups: ServiceMockups }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-ocean-950">
      <Mosaic className="absolute inset-0" from={2} to={6} seed={3} />
      <motion.div
        className="absolute right-[5%] top-[10%] w-[76%] overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-base/95 font-mono text-[10px] leading-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] sm:text-[12px] sm:leading-6"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      >
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="ml-2 text-[10px] text-muted">{mockups.codeFile}</span>
        </div>
        <div className="px-4 py-3">
          {mockups.code.map((tokens, line) => (
            <motion.div
              key={line}
              className="whitespace-pre"
              variants={{
                hidden: { opacity: 0, x: -8 },
                shown: { opacity: 1, x: 0, transition: { duration: 0.4, ease: ease.outExpo, delay: 0.3 + line * 0.18 } },
              }}
            >
              <span className="mr-3 select-none text-line-strong">{line + 1}</span>
              {tokens.map((token, index) => (
                <span key={index} className={TOKEN_COLORS[index % TOKEN_COLORS.length]}>
                  {token}
                </span>
              ))}
              {line === mockups.code.length - 1 && (
                <span className="ambient ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-twinkle bg-ocean-400" />
              )}
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mx-4 mb-3 inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] text-success"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            shown: { opacity: 1, scale: 1, transition: { ...spring.playful, delay: 1.5 } },
          }}
        >
          ✓ {mockups.buildPassed}
        </motion.div>
      </motion.div>
      <Sprite name="server" className="bottom-[6%] left-[5%] w-[17%]" delay={0.2} />
      <Sprite name="chip" className="ambient right-[3%] top-[62%] w-[13%] animate-bob" delay={0.5} />
    </div>
  );
}

const APP_CARDS = ["bg-ocean-500", "bg-ocean-300", "bg-ocean-700", "bg-ocean-400", "bg-ocean-600"];

export function AppsVisual({ mockups }: { mockups: ServiceMockups }) {
  const notes = mockups.appNotes;
  return (
    <div className="relative aspect-video overflow-hidden bg-ocean-950">
      <Mosaic className="absolute inset-0" from={6} to={1} seed={5} />
      <motion.div
        className="absolute left-[12%] top-[9%] h-[82%] w-[26%] min-w-[110px] overflow-hidden rounded-[var(--radius-device)] border-[3px] border-base bg-base shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
        initial={{ opacity: 0, y: 30, rotate: -4 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true }}
        transition={spring.playful}
      >
        <div className="mx-auto mt-1.5 h-1.5 w-10 rounded-full bg-line-strong" />
        <div className="mx-2 mt-2 h-2 w-1/2 rounded-sm bg-fg/80" />
        <div className="relative mt-2 h-full overflow-hidden px-2">
          <div className="ambient flex animate-[app-scroll_9s_linear_infinite] flex-col gap-1.5">
            {[...APP_CARDS, ...APP_CARDS].map((color, index) => (
              <div key={index} className="flex items-center gap-1.5 rounded-md bg-surface p-1.5">
                <span className={`size-5 shrink-0 rounded ${color}`} />
                <span className="flex-1 space-y-1">
                  <span className="block h-1.5 w-4/5 rounded-sm bg-fg/60" />
                  <span className="block h-1.5 w-1/2 rounded-sm bg-muted/50" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      {notes.map((note, index) => (
        <motion.div
          key={note}
          className="absolute flex items-center gap-2 rounded-[var(--radius-control)] border border-white/10 bg-base/95 px-3 py-2 text-[11px] shadow-lg sm:text-xs"
          style={{ left: "44%", top: `${24 + index * 22}%` }}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...spring.playful, delay: 0.6 + index * 0.35 }}
          whileHover={{ scale: 1.05, transition: spring.ui }}
        >
          <span className="size-2 rounded-full bg-ocean-400" />
          {note}
        </motion.div>
      ))}
      <Sprite name="phone" className="bottom-[7%] right-[24%] w-[11%]" delay={0.4} />
      <Sprite name="flag" className="ambient bottom-[9%] right-[8%] w-[12%] animate-bob" delay={0.7} />
    </div>
  );
}

const PROMPT_ICONS: IconName[] = ["concept", "test", "idea"];

export function AiVisual({ mockups }: { mockups: ServiceMockups }) {
  const prompts = mockups.aiPrompts;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const { reduced } = useMotionPolicy();
  const [index, setIndex] = useState(0);
  // Starts empty on server and client alike, so hydration matches.
  const [typed, setTyped] = useState("");

  // Type, pause, clear, next prompt. Runs only while visible; with reduced motion the
  // first prompt simply appears in full.
  useEffect(() => {
    if (!inView) return;
    const full = prompts[index];
    let timer: ReturnType<typeof setTimeout>;
    if (reduced) {
      timer = setTimeout(() => setTyped(full), 0);
    } else if (typed.length < full.length) {
      timer = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 38);
    } else {
      timer = setTimeout(() => {
        setTyped("");
        setIndex((value) => (value + 1) % prompts.length);
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [inView, reduced, typed, index, prompts]);

  return (
    <div ref={ref} className="relative aspect-video overflow-hidden bg-ocean-950">
      <Mosaic className="absolute inset-0" from={1} to={5} seed={9} />
      <motion.div
        className="absolute left-1/2 top-[22%] w-[76%] -translate-x-1/2 rounded-[var(--radius-card)] border border-white/10 bg-base/95 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: ease.outExpo }}
      >
        <div className="flex items-center gap-2 rounded-[var(--radius-control)] border border-line px-3 py-2 text-[11px] sm:text-[13px]">
          <span className="text-muted">+</span>
          <span className="min-h-[1.2em] flex-1 truncate">
            {typed}
            <span className="ambient ml-px inline-block h-[1em] w-px translate-y-0.5 animate-twinkle bg-ocean-400" />
          </span>
          <span className="flex size-6 items-center justify-center rounded bg-ocean-700 text-white">↑</span>
        </div>
        <ul className="mt-2 space-y-0.5">
          {prompts.map((prompt, row) => (
            <li
              key={prompt}
              className={`flex items-center gap-2 rounded px-2 py-1.5 text-[10px] transition-colors duration-300 sm:text-xs ${
                row === index ? "bg-raised text-fg" : "text-muted"
              }`}
            >
              <PixelIcon name={PROMPT_ICONS[row]} px={1.5} />
              {prompt}
            </li>
          ))}
        </ul>
      </motion.div>
      <Sprite name="drone" className="ambient right-[5%] top-[6%] w-[14%] animate-bob" delay={0.7} />
      <Sprite name="chip" className="bottom-[5%] left-[6%] w-[11%]" delay={0.9} />
    </div>
  );
}
