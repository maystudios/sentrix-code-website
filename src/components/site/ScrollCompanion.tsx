"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Dictionary, ServiceVisualKind } from "@/content/types";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { PixelCompanion, type CompanionName } from "@/components/brand/PixelCharacters";

const ROLE: Record<ServiceVisualKind, CompanionName> = {
  game: "robot-gamer",
  software: "robot-coder",
  apps: "robot-phone",
  ai: "robot-ai",
};

const LABEL = { de: "Roboter ausblenden", en: "Hide the robot" };

const DISMISS_KEY = "sentrix-companion";
const readDismissed = () => window.sessionStorage.getItem(DISMISS_KEY) === "off";
function subscribeDismissed(callback: () => void) {
  window.addEventListener(DISMISS_KEY, callback);
  return () => window.removeEventListener(DISMISS_KEY, callback);
}

// A small companion in the corner that changes its tool with the section you are reading:
// gamepad for games, laptop for software, phone for apps, a glowing brain for AI.
// A click sends it away for the rest of the visit.
export function ScrollCompanion({ dict }: { dict: Dictionary }) {
  const { reduced } = useMotionPolicy();
  const [visible, setVisible] = useState(false);
  const [crowded, setCrowded] = useState(false);
  const dismissed = useSyncExternalStore(subscribeDismissed, readDismissed, () => false);
  const [sprite, setSprite] = useState<CompanionName>("robot-gamer");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const nearEnd = y + window.innerHeight > document.body.scrollHeight - 700;
    setVisible(y > window.innerHeight * 0.8 && !nearEnd);
  });

  useEffect(() => {
    const targets: [string, CompanionName][] = [
      ...dict.services.items.map((item) => [item.id, ROLE[item.visual]] as [string, CompanionName]),
      [dict.anchors.cases, "robot-coder"],
    ];
    // Sections with a figure of their own: the companion steps aside there.
    const own = [dict.anchors.process, dict.anchors.faq, dict.anchors.contact];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const match = targets.find(([id]) => id === entry.target.id);
          if (match) setSprite(match[1]);
          setCrowded(own.includes(entry.target.id));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const id of [...targets.map(([target]) => target), ...own]) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [dict]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && !crowded && (
        <motion.button
          type="button"
          aria-label={LABEL[dict.locale]}
          title={LABEL[dict.locale]}
          onClick={() => {
            window.sessionStorage.setItem(DISMISS_KEY, "off");
            window.dispatchEvent(new Event(DISMISS_KEY));
          }}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={reduced ? { duration: 0 } : spring.playful}
          whileHover={{ y: -6, rotate: -4 }}
          className="fixed bottom-4 right-4 z-40 hidden w-16 cursor-pointer md:block lg:w-20"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={sprite}
              className="aspect-square w-full"
              initial={reduced ? false : { y: -24, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring.playful}
            >
              <PixelCompanion name={sprite} className="size-full" />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
