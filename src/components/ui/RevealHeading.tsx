"use client";

import { motion } from "motion/react";
import { createElement } from "react";
import { ease } from "@/lib/motion";

type RevealHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  // "mount" plays on load (page heroes), "view" when scrolled into view.
  trigger?: "mount" | "view";
};

// Words slide up out of a mask one after another.
export function RevealHeading({ text, as = "h2", className = "", delay = 0, trigger = "view" }: RevealHeadingProps) {
  const words = text.split(" ");
  const play = trigger === "mount" ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -12% 0px" } };
  return createElement(
    as,
    { className },
    <motion.span initial="hidden" {...play} className="inline">
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              shown: { y: 0, transition: { duration: 0.85, ease: ease.outExpo, delay: delay + index * 0.05 } },
            }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>,
  );
}
