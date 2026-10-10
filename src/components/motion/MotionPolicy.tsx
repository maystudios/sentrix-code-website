"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

// One motion policy for the whole site (WEBSITE.md, "Bewegung"):
// - "system" follows prefers-reduced-motion,
// - "full" and "reduced" are the visitor's own choice from the footer switch,
// - "?motion=full" forces full motion for reviews.
// Server render and hydration always assume full motion; the real policy applies right
// after hydration. Changing it keeps the page as it is (form input, focus, scroll): Motion
// reads the setting for every new animation and components react to `reduced`.

export type MotionPreference = "system" | "full" | "reduced";

const STORAGE_KEY = "sentrix-motion";
const CHANGE_EVENT = "sentrix-motion-change";

type MotionPolicy = {
  preference: MotionPreference;
  reduced: boolean;
  setPreference: (preference: MotionPreference) => void;
};

const MotionPolicyContext = createContext<MotionPolicy>({
  preference: "system",
  reduced: false,
  setPreference: () => {},
});

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// Storage can be blocked (privacy settings); the choice then lasts for this page view only.
let memoryPreference: string | null = null;
function readStored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryPreference;
  }
}
function writeStored(value: string | null) {
  memoryPreference = value;
  try {
    if (value === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Kept in memory only.
  }
}

function readSnapshot(): string {
  if (new URLSearchParams(window.location.search).get("motion") === "full") return "full|0";
  const stored = readStored();
  const preference = stored === "full" || stored === "reduced" ? stored : "system";
  const system = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "1" : "0";
  return `${preference}|${system}`;
}

export function MotionPolicyProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => "system|0");
  const [preference, system] = snapshot.split("|") as [MotionPreference, string];
  const reduced = preference === "reduced" || (preference === "system" && system === "1");

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  // Browser back and forward: the page slide runs the other way (globals.css,
  // "Seitenwechsel"); any click on the page returns to the forward direction.
  useEffect(() => {
    const root = document.documentElement;
    const onPop = () => {
      root.dataset.nav = "back";
    };
    const onClick = () => {
      delete root.dataset.nav;
    };
    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const policy: MotionPolicy = {
    preference,
    reduced,
    setPreference: (next) => {
      writeStored(next === "system" ? null : next);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
  };

  return (
    <MotionPolicyContext.Provider value={policy}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        <ReactLenis
          root
          options={{ lerp: reduced ? 1 : 0.1, anchors: { offset: -72 }, autoRaf: true, respectReducedMotion: false }}
        >
          {children}
        </ReactLenis>
      </MotionConfig>
    </MotionPolicyContext.Provider>
  );
}

export function useMotionPolicy() {
  return useContext(MotionPolicyContext);
}
