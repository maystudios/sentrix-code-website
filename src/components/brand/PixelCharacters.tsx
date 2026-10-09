"use client";

import { motion, useAnimate, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { PixelSprite } from "./PixelSprite";
import { robot } from "./sprites/robot";
import { robotWave } from "./sprites/robotWave";
import { rocket } from "./sprites/rocket";

// Layer rules read from the ASCII preview of scripts/pixelize-sprite.py.
const ROCKET_FLAME_FROM_ROW = 33;
const ROCKET_WINDOW = { x0: 9, x1: 16, y0: 12, y1: 18 };

function rocketLayer(colour: string, x: number, y: number) {
  if (y >= ROCKET_FLAME_FROM_ROW && (colour === "amber" || colour === "orange" || colour === "white")) return "flame";
  const { x0, x1, y0, y1 } = ROCKET_WINDOW;
  if (x >= x0 && x <= x1 && y >= y0 && y <= y1 && colour !== "ink" && colour !== "o900") return "window";
  return "body";
}

function robotLayer(colour: string, x: number, y: number) {
  if (y <= 3 && (colour === "amber" || colour === "orange")) return "antenna";
  if (y >= 15 && y <= 18 && x >= 5 && x <= 15 && (colour === "o300" || colour === "o400" || colour === "grey")) return "eyes";
  return "body";
}

// The rocket with the robot sitting behind the window. `launching` makes the flame roar.
export function PixelRocket({ className, launching = false }: { className?: string; launching?: boolean }) {
  return (
    <PixelSprite
      data={rocket}
      layer={rocketLayer}
      className={className}
      layerClassName={{
        flame: `origin-top ambient ${launching ? "animate-flame-roar" : "animate-flame"}`,
        window: "opacity-0",
      }}
    >
      {/* Robot face in the window: dark visor, blinking eyes, a small smile. */}
      <rect x={10} y={12.4} width={6} height={5.6} fill="#03045e" />
      <g className="ambient animate-blink origin-center" style={{ transformBox: "fill-box" }}>
        <rect x={11} y={14} width={1.2} height={1.6} fill="#48cae4" />
        <rect x={13.8} y={14} width={1.2} height={1.6} fill="#48cae4" />
      </g>
      <rect x={11.8} y={16.6} width={2.4} height={0.6} fill="#90e0ef" />
      <rect x={10} y={12.4} width={1} height={1} fill="#caf0f8" opacity={0.7} />
    </PixelSprite>
  );
}

type PixelRobotProps = {
  className?: string;
  // Waves every few seconds when idle.
  waves?: boolean;
  // Eyes follow the pointer.
  watching?: boolean;
};

// The robot mascot: blinks, its antenna glows, it can watch the pointer and wave, and
// it hops when tapped.
export function PixelRobot({ className, waves = false, watching = false }: PixelRobotProps) {
  const [scope, animate] = useAnimate();
  const { reduced } = useMotionPolicy();
  const [waving, setWaving] = useState(false);
  const eyeX = useSpring(useMotionValue(0), { stiffness: 300, damping: 24 });
  const eyeY = useSpring(useMotionValue(0), { stiffness: 300, damping: 24 });

  useEffect(() => {
    if (!waves || reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        setWaving(true);
        timer = setTimeout(() => {
          setWaving(false);
          loop();
        }, 1400);
      }, 5200 + Math.random() * 3000);
    };
    loop();
    return () => clearTimeout(timer);
  }, [waves, reduced]);

  useEffect(() => {
    if (!watching || reduced) return;
    const onMove = (event: PointerEvent) => {
      const rect = (scope.current as HTMLElement | null)?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height * 0.4);
      const distance = Math.max(1, Math.hypot(dx, dy));
      eyeX.set((dx / distance) * 0.9);
      eyeY.set((dy / distance) * 0.6);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [watching, reduced, eyeX, eyeY, scope]);

  return (
    <motion.div
      ref={scope}
      className={className}
      whileHover={{ y: -6, transition: spring.ui }}
      onTap={() => {
        if (reduced) return;
        animate(scope.current, { y: [0, -28, 0], scaleY: [1, 1.08, 0.92, 1] }, { duration: 0.55, ease: "easeOut" });
      }}
    >
      {waving ? (
        <PixelSprite data={robotWave} layer={robotLayer} className="size-full" layerClassName={{ antenna: "ambient animate-glow" }} />
      ) : (
        <PixelSprite
          data={robot}
          layer={robotLayer}
          className="size-full"
          layerClassName={{ antenna: "ambient animate-glow" }}
          renderLayer={(name, rects) =>
            name === "eyes" ? (
              <g key={name}>
                {/* Visor behind the eyes, so moving eyes never leave holes. */}
                <rect x={5} y={15} width={11} height={4} fill="#03045e" />
                <motion.g style={{ x: eyeX, y: eyeY }}>
                  <g className="ambient animate-blink origin-center" style={{ transformBox: "fill-box" }}>
                    {rects}
                  </g>
                </motion.g>
              </g>
            ) : undefined
          }
        />
      )}
    </motion.div>
  );
}
