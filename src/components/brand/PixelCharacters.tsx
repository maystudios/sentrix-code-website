"use client";

import { motion, useAnimate, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { PixelArt } from "./PixelArt";
import { FIGURES } from "./figures";

// The site's cast: pixel-perfect rebuilds of generated images (scripts/pixel-art), split
// into layers so each part can move. Shapes change only in whole art pixels: eyes jump by
// one cell, blinking shows a closed-lid frame, rotors and flames swap between two frames
// in CSS. Loops run only while a figure is on screen, the tab is visible and motion is on.

// Figure sizes in art pixels, for callers that size boxes by the shared pixel size.
export const FIGURE_SIZE = Object.fromEntries(Object.entries(FIGURES).map(([name, figure]) => [name, [figure.width, figure.height]])) as Record<
  keyof typeof FIGURES,
  [number, number]
>;

// Two-frame swap in CSS (globals.css, "frame-swap"): frame A and frame B alternate.
const swapA = (seconds: number) => ({ className: "ambient", style: { animation: `frame-swap ${seconds}s steps(1) infinite` } });
const swapB = (seconds: number) => ({ className: "ambient", style: { animation: `frame-swap ${seconds}s steps(1) ${-seconds / 2}s infinite reverse` } });

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

// On screen, tab visible and motion allowed.
function useLive<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "120px" });
  const { reduced } = useMotionPolicy();
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);
  return { ref, live: inView && visible && !reduced, reduced };
}

// A counter that ticks while `active`; figures derive slow frame changes from it.
function useTick(ms: number, active: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((value) => value + 1), ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
  return tick;
}

// Blinks at irregular intervals, sometimes twice in a row. Opens the eyes again whenever
// the figure stops being live, so it never stays frozen mid-blink.
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
    return () => {
      window.clearTimeout(timer);
      setClosed(false);
    };
  }, [active]);
  return closed;
}

// ---------------------------------------------------------------------------------------

type PixelRobotProps = {
  className?: string;
  // Waves every few seconds when idle.
  waves?: boolean;
  // Eyes follow the pointer.
  watching?: boolean;
};

// The mascot: blinks, looks at the pointer (eyes move in whole art pixels), its antenna
// glows, it waves now and then and while hovered, and hops when tapped.
export function PixelRobot({ className, waves = false, watching = false }: PixelRobotProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { margin: "120px" });
  const { reduced } = useMotionPolicy();
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);
  const live = inView && visible && !reduced;
  const blink = useBlink(live);
  const [waving, setWaving] = useState(false);
  const [hover, setHover] = useState(false);
  const wave = live && (waving || hover);
  const tick = useTick(170, wave);
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const eyeX = useTransform(useSpring(lookX, { stiffness: 300, damping: 26 }), (value) => Math.round(value));
  const eyeY = useTransform(useSpring(lookY, { stiffness: 300, damping: 26 }), (value) => Math.round(value));

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
    return () => {
      window.clearTimeout(timer);
      setWaving(false);
    };
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
      lookX.set((dx / distance) * reach * 1.4);
      lookY.set((dy / distance) * reach * 0.9);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      lookX.set(0);
      lookY.set(0);
    };
  }, [watching, live, lookX, lookY, scope]);

  return (
    <motion.div
      ref={scope}
      className={className}
      whileHover={reduced ? undefined : { y: -4, transition: spring.ui }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onTap={() => {
        if (reduced || !scope.current) return;
        animate(scope.current, { y: [0, -26, 0] }, { duration: 0.5, ease: "easeOut" });
      }}
    >
      <PixelArt
        figure={FIGURES.robot}
        className="size-full"
        frames={{ arm: wave ? 2 + (tick % 2) : 1 }}
        parts={{
          antenna: { className: "ambient animate-glow" },
          eyes: { hidden: blink, style: { x: eyeX, y: eyeY } },
          lids: { hidden: !blink },
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------------------

// The rocket. Engine "idle" flickers a small flame, "roar" a long one with a rumbling hull,
// "off" shows no flame (coasting). The flame swaps between two frames in CSS.
export function PixelRocket({ className, engine = "idle" }: { className?: string; engine?: "off" | "idle" | "roar" }) {
  const { ref, live, reduced } = useLive<HTMLDivElement>();
  const roaring = engine === "roar";
  const flame = { style: { originY: 0 }, animate: { scaleY: roaring ? 2 : 1, scaleX: roaring ? 1.2 : 1 }, transition: spring.ui };
  const speed = roaring ? 0.1 : 0.2;
  return (
    <motion.div
      ref={ref}
      className={className}
      animate={roaring && live ? { x: [0, -1.2, 0, 1.2, 0] } : { x: 0 }}
      transition={roaring ? { duration: 0.16, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3, ease: "easeOut" }}
    >
      <PixelArt
        figure={FIGURES.rocket}
        className="size-full"
        parts={{
          flame: engine === "off" ? { hidden: true } : { ...flame, ...swapA(speed), style: { ...flame.style, ...swapA(speed).style } },
          "flame-b": engine === "off" || reduced ? { hidden: true } : { ...flame, ...swapB(speed), style: { ...flame.style, ...swapB(speed).style } },
          window: { className: roaring ? "ambient animate-glow" : undefined },
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------------------

const DRONE_LOOK = [0, 1, 1, 0, -1, -1, 0];

// The isometric delivery drone. Rotors spin (two frames in CSS), the camera pupil looks
// around in whole art pixels and the top light pulses; `open` spreads the claw's prongs.
// `part` draws the body ("back") or only the prongs ("front"), so a block can hang
// between them.
export function PixelDrone({ className, open = false, part = "all" }: { className?: string; open?: boolean; part?: "all" | "back" | "front" }) {
  const { ref, live, reduced } = useLive<HTMLDivElement>();
  const tick = useTick(1400, live && part !== "front");
  const look = live ? DRONE_LOOK[tick % DRONE_LOOK.length] : 0;
  // Propellers: disc, blade along, blade across, each for a third of a 0.18 s turn.
  const turn = 0.18;
  const third = (offset: number) => ({ className: "ambient", style: { animation: `frame-third ${turn}s steps(1) ${-offset * turn}s infinite` } });
  const disc = reduced ? {} : third(0);
  const include = (layer: string) => {
    if (layer === "cube") return false;
    const prong = layer.startsWith("claw") && layer !== "claw-head";
    return part === "all" || (part === "front" ? prong : !prong);
  };
  return (
    <div ref={ref} className={className}>
      <PixelArt
        figure={FIGURES.drone}
        className="size-full"
        include={include}
        frames={{ claw: open ? 2 : 1 }}
        parts={{
          "rotor-back": disc,
          "rotor-left": disc,
          "rotor-right": disc,
          "rotor-front": disc,
          "rotor-spin": reduced ? { hidden: true } : third(2 / 3),
          "rotor-spin-c": reduced ? { hidden: true } : third(1 / 3),
          pupil: { animate: { x: look }, transition: { duration: 0 } },
          light: { className: "ambient animate-glow" },
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------------------

const GAMEPAD_PATTERN = ["dpad", "", "buttons", "buttons", "", "dpad", "select", "", "buttons", "dpad", "", ""];

// A gamepad that plays itself: d-pad and buttons darken when pressed, in a game-like
// rhythm, faster and with little hops while hovered.
export function PixelGamepad({ className }: { className?: string }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const [hover, setHover] = useState(false);
  const tick = useTick(hover ? 110 : 240, live);
  const pressed = live ? GAMEPAD_PATTERN[tick % GAMEPAD_PATTERN.length] : "";
  const press = (name: string) => ({ animate: { filter: pressed === name ? "brightness(0.55)" : "brightness(1)" }, transition: { duration: 0 } });
  return (
    <motion.div
      ref={ref}
      className={className}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      animate={hover && live ? { y: [0, -3, 0, -2, 0] } : { y: 0 }}
      transition={hover ? { duration: 0.5, repeat: Infinity, ease: "easeOut" } : spring.ui}
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

// A four-point star that twinkles.
export function PixelSparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span className={`ambient block animate-twinkle ${className ?? ""}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <PixelArt figure={FIGURES.sparkle} className="size-full" />
    </span>
  );
}

// ---------------------------------------------------------------------------------------

export type CompanionName = "robot-gamer" | "robot-coder" | "robot-phone" | "robot-ai" | "robot-astronaut";

// A robot holding the tool of a section: it blinks and its sparks twinkle.
export function PixelCompanion({ name, className }: { name: CompanionName; className?: string }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const blink = useBlink(live);
  return (
    <div ref={ref} className={className}>
      <PixelArt
        figure={FIGURES[name]}
        className="size-full"
        parts={{ eyes: { hidden: blink }, lids: { hidden: !blink }, sparks: { className: "ambient animate-twinkle" } }}
      />
    </div>
  );
}

export type PropName = "phone" | "flag" | "mailbox" | "paper-plane" | "server" | "chip" | "drone" | "laptop" | "gamepad";

// A still prop whose little lights pulse.
export function PixelProp({ name, className }: { name: PropName; className?: string }) {
  return <PixelArt figure={FIGURES[name]} className={className} parts={{ lights: { className: "ambient animate-glow" } }} />;
}

// ---------------------------------------------------------------------------------------

// The robot walking back and forth along a line: four walk frames while it moves, a short
// rest and a look around at each end, then it turns (mirrored) and walks back.
export function PixelWalker({ className }: { className?: string }) {
  const { ref, live } = useLive<HTMLDivElement>();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const tick = useTick(130, live && walking);
  useEffect(() => {
    if (!live || !scope.current || !ref.current) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    (async () => {
      let direction: 1 | -1 = 1;
      while (!cancelled && scope.current && ref.current) {
        const track = ref.current.offsetWidth - scope.current.offsetWidth;
        const target = direction > 0 ? track : 0;
        const from = Number(scope.current.dataset.x ?? 0);
        const distance = Math.abs(target - from);
        setFacing(direction);
        setWalking(true);
        await animate(scope.current, { x: target }, { duration: distance / 46, ease: "linear" });
        scope.current.dataset.x = String(target);
        setWalking(false);
        await wait(1400 + Math.random() * 1600);
        direction = direction > 0 ? -1 : 1;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [live, animate, scope, ref]);
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div ref={scope} className="absolute bottom-0 left-0 h-full" style={{ aspectRatio: `${FIGURES["robot-walk"].width} / ${FIGURES["robot-walk"].height}` }}>
        <div className="size-full" style={{ transform: facing < 0 ? "scaleX(-1)" : undefined }}>
          <PixelArt figure={FIGURES["robot-walk"]} className="size-full" frames={{ walk: walking ? (tick % 4) + 1 : 2 }} />
        </div>
      </div>
    </div>
  );
}
