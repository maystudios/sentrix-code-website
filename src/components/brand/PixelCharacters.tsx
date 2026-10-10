"use client";

import { motion, useAnimate, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { PixelArt } from "./PixelArt";
import { FIGURES } from "./figures";

// The site's cast: pixel-perfect rebuilds of generated images (scripts/pixel-art), split
// into layers so each part can move. Loops only run while a figure is on screen and
// motion is on.

// Figure sizes in art pixels, for callers that size boxes by the shared pixel size.
export const FIGURE_SIZE = Object.fromEntries(Object.entries(FIGURES).map(([name, figure]) => [name, [figure.width, figure.height]])) as Record<
  keyof typeof FIGURES,
  [number, number]
>;

// A counter that ticks while `active`; figures derive their frames from it.
function useTick(ms: number, active: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((value) => value + 1), ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
  return tick;
}

// Blinks at irregular intervals, sometimes twice in a row.
function useBlink(active: boolean) {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (!active) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        const twice = Math.random() < 0.25;
        setClosed(true);
        timer = window.setTimeout(() => {
          setClosed(false);
          if (!twice) return schedule();
          timer = window.setTimeout(() => {
            setClosed(true);
            timer = window.setTimeout(() => {
              setClosed(false);
              schedule();
            }, 110);
          }, 160);
        }, 120);
      }, 2200 + Math.random() * 3600);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [active]);
  return closed;
}

function useLive<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "120px" });
  const { reduced } = useMotionPolicy();
  return { ref, live: inView && !reduced, reduced };
}

// ---------------------------------------------------------------------------------------

type PixelRobotProps = {
  className?: string;
  // Waves every few seconds when idle.
  waves?: boolean;
  // Eyes follow the pointer.
  watching?: boolean;
};

// The mascot: blinks, looks at the pointer, its antenna glows, it waves now and then and
// while hovered, squints happily and hops when tapped.
export function PixelRobot({ className, waves = false, watching = false }: PixelRobotProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { margin: "120px" });
  const { reduced } = useMotionPolicy();
  const live = inView && !reduced;
  const blink = useBlink(live);
  const [waving, setWaving] = useState(false);
  const [happy, setHappy] = useState(false);
  const wave = waving || (happy && live);
  const tick = useTick(170, live && wave);
  const eyeX = useSpring(useMotionValue(0), { stiffness: 300, damping: 24 });
  const eyeY = useSpring(useMotionValue(0), { stiffness: 300, damping: 24 });

  useEffect(() => {
    if (!waves || !live) return;
    let timer: number;
    const loop = () => {
      timer = window.setTimeout(() => {
        setWaving(true);
        timer = window.setTimeout(() => {
          setWaving(false);
          loop();
        }, 1500);
      }, 4200 + Math.random() * 3600);
    };
    loop();
    return () => window.clearTimeout(timer);
  }, [waves, live]);

  useEffect(() => {
    if (!watching || !live) return;
    const onMove = (event: PointerEvent) => {
      const rect = scope.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height * 0.35);
      const distance = Math.max(1, Math.hypot(dx, dy));
      const reach = Math.min(1, distance / 140);
      eyeX.set((dx / distance) * reach * 1.4);
      eyeY.set((dy / distance) * reach * 0.8);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [watching, live, eyeX, eyeY, scope]);

  return (
    <motion.div
      ref={scope}
      className={className}
      whileHover={reduced ? undefined : { y: -4, transition: spring.ui }}
      onHoverStart={() => setHappy(true)}
      onHoverEnd={() => setHappy(false)}
      onTap={() => {
        if (reduced || !scope.current) return;
        animate(scope.current, { y: [0, -26, 0], scaleY: [1, 1.08, 0.9, 1] }, { duration: 0.55, ease: "easeOut" });
      }}
    >
      <PixelArt
        figure={FIGURES.robot}
        className="size-full"
        frames={{ arm: wave ? 2 + (tick % 2) : 1 }}
        parts={{
          antenna: { className: "ambient animate-glow" },
          eyes: {
            style: { x: eyeX, y: eyeY },
            animate: { scaleY: blink ? 0.15 : happy ? 0.5 : 1 },
            transition: { duration: 0.07 },
          },
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------------------

// The rocket. The flame flickers; when `launching` it roars and the hull shakes.
export function PixelRocket({ className, launching = false }: { className?: string; launching?: boolean }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const tick = useTick(launching ? 60 : 120, live);
  const flicker = live ? [1, 0.82, 1.08, 0.9][tick % 4] : 1;
  return (
    <motion.div
      ref={ref}
      className={className}
      animate={launching && live ? { x: [0, -1, 1, -1, 0] } : { x: 0 }}
      transition={launching ? { duration: 0.18, repeat: Infinity } : { duration: 0.2 }}
    >
      <PixelArt
        figure={FIGURES.rocket}
        className="size-full"
        parts={{
          flame: {
            style: { originY: 0 },
            animate: { scaleY: (launching ? 2 : 1) * flicker, scaleX: launching ? 1.2 : 1 },
            transition: { duration: 0.06 },
          },
          window: { className: launching ? "ambient animate-glow" : undefined },
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------------------

// The delivery drone: rotors spin, its camera eye looks around, the top light pulses and
// the claw opens when `open`.
export function PixelDrone({ className, open = false }: { className?: string; open?: boolean }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const tick = useTick(70, live);
  const look = live ? [0, 1, 1, 0, -1, -1, 0][Math.floor(tick / 20) % 7] : 0;
  return (
    <div ref={ref} className={className}>
      <PixelArt
        figure={FIGURES.drone}
        className="size-full"
        frames={{ blade: live ? (tick % 2) + 1 : 1, claw: open ? 1 : 2 }}
        parts={{
          pupil: { animate: { x: look }, transition: spring.ui },
          light: { className: "ambient animate-glow" },
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------------------

// A gamepad that plays itself: d-pad and buttons go down in a game-like rhythm, faster and
// with a little wiggle while hovered.
export function PixelGamepad({ className }: { className?: string }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const [hover, setHover] = useState(false);
  const tick = useTick(hover ? 110 : 240, live);
  const pattern = ["dpad", "", "buttons", "buttons", "", "dpad", "select", "", "buttons", "dpad", "", ""];
  const pressed = live ? pattern[tick % pattern.length] : "";
  const press = (name: string) => ({
    animate: { y: pressed === name ? 0.6 : 0, opacity: pressed === name ? 0.7 : 1 },
    transition: { duration: 0.05 },
  });
  return (
    <motion.div
      ref={ref}
      className={className}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      animate={hover && live ? { rotate: [0, -3, 3, 0] } : { rotate: 0 }}
      transition={hover ? { duration: 0.4, repeat: Infinity } : spring.ui}
    >
      <PixelArt
        figure={FIGURES.gamepad}
        className="size-full"
        parts={{ dpad: press("dpad"), buttons: press("buttons"), select: press("select"), lights: { className: "ambient animate-glow" } }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------------------

// Caret position after each typed line (cells); the caret layer sits at (6, 4).
const CARET_STOPS: [number, number][] = [
  [8, 4],
  [17, 4],
  [23, 6],
  [28, 9],
  [19, 11],
  [25, 13],
];

// A laptop that writes its code line by line, then clears the screen and starts again.
export function PixelLaptop({ className }: { className?: string }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const tick = useTick(300, live);
  const step = live ? tick % 16 : 15;
  const lines = Math.min(5, Math.floor(step / 2));
  const [cx, cy] = CARET_STOPS[lines];
  const caretOn = !live || tick % 2 === 0 || step % 2 === 1;
  return (
    <div ref={ref} className={className}>
      <PixelArt
        figure={FIGURES.laptop}
        className="size-full"
        parts={{
          "code-a": { hidden: lines < 1 },
          "code-b": { hidden: lines < 2 },
          "code-c": { hidden: lines < 3 },
          "code-d": { hidden: lines < 4 },
          "code-e": { hidden: lines < 5 },
          caret: { hidden: !caretOn, animate: { x: cx - 6, y: cy - 4 }, transition: { duration: 0 } },
          lights: { className: "ambient animate-glow" },
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------------------

// A deep-blue night cloud whose little stars twinkle.
export function PixelCloud({ className }: { className?: string }) {
  return <PixelArt figure={FIGURES.cloud} className={className} parts={{ stars: { className: "ambient animate-twinkle" } }} />;
}

// A four-point star whose bright core pulses.
export function PixelSparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span className={`ambient block animate-twinkle ${className ?? ""}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <PixelArt figure={FIGURES.sparkle} className="size-full" />
    </span>
  );
}

// ---------------------------------------------------------------------------------------

export type CompanionName = "robot-gamer" | "robot-coder" | "robot-phone" | "robot-ai" | "robot-astronaut";

// A robot holding the tool of a section: its eyes blink and its sparks twinkle.
export function PixelCompanion({ name, className }: { name: CompanionName; className?: string }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const blink = useBlink(live);
  return (
    <div ref={ref} className={className}>
      <PixelArt
        figure={FIGURES[name]}
        className="size-full"
        parts={{
          eyes: { animate: { scaleY: blink ? 0.15 : 1 }, transition: { duration: 0.07 } },
          sparks: { className: "ambient animate-twinkle" },
        }}
      />
    </div>
  );
}

export type PropName = "phone" | "flag" | "mailbox" | "paper-plane" | "server" | "chip" | "drone" | "laptop" | "gamepad";

// A still prop whose little lights pulse.
export function PixelProp({ name, className }: { name: PropName; className?: string }) {
  return <PixelArt figure={FIGURES[name]} className={className} parts={{ lights: { className: "ambient animate-glow" } }} />;
}
