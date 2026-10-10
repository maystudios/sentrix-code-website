"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";

// Words not yet reached stay readable (large text, at least 3:1 on the base colour); the
// emphasis comes from brightening, not from appearing.
function Word({ word, progress, range, reduced }: { word: string; progress: MotionValue<number>; range: [number, number]; reduced: boolean }) {
  const opacity = useTransform(progress, range, [0.45, 1]);
  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }} className="mr-[0.26em] inline-block last:mr-0">
      {word}
    </motion.span>
  );
}

// The sentence lights up word by word as it scrolls through the viewport.
export function Positioning({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { reduced } = useMotionPolicy();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <section className="border-b border-line py-24 md:py-36">
      <p ref={ref} className="text-h2-xl mx-auto max-w-5xl px-6 text-center">
        {words.map((word, index) => (
          <Word
            key={index}
            word={word}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
            reduced={reduced}
          />
        ))}
      </p>
    </section>
  );
}
