"use client";

import { motion, type Transition } from "motion/react";
import { spring } from "@/lib/motion";
import { PencilArt } from "./art";
import { arriving, at, crumbSpots, pencilTrace, PENCIL_POSE, undoAt, type Cue, type Step } from "./choreo";

const TRACE = pencilTrace();
const CRUMBS = crumbSpots(9);
const SCALE = 1.6;

// The pixel pencil lives in the device's own coordinates (SVG units), so it can trace the
// outline exactly. It idles beside the sketch, traces it into a wireframe, rubs out the
// scribbles with its eraser, then parks until the robot takes over.
export function Pencil({ step, cue, ambient }: { step: Step; cue: Cue; ambient: boolean }) {
  const tracing = arriving(cue, 1) && cue.trans?.from === 0;
  const pose = step === 0 ? PENCIL_POSE.idle : step === 1 ? PENCIL_POSE.parked : PENCIL_POSE.gone;

  let target: { x: number | number[]; y: number | number[]; opacity: number };
  let move: Transition;
  if (tracing) {
    target = { x: TRACE.x, y: TRACE.y, opacity: 1 };
    move = { duration: TRACE.duration, times: TRACE.times, ease: TRACE.ease };
  } else {
    target = { x: pose.x, y: pose.y, opacity: step <= 1 ? 1 : 0 };
    if (cue.mode === "rest") move = { duration: 0 };
    else if (step <= 1) {
      // Going back it returns with the sketch (step 0) or parks with the wireframe (step 1).
      const delay = cue.mode === "back" ? undoAt(cue, step === 0 ? 1 : 2) + 0.06 : 0;
      move = { ...spring.playful, delay, opacity: { duration: 0.15, delay } };
    }
    else move = { duration: 0.45, ease: [0.5, 0, 0.75, 0], opacity: { duration: 0.2, delay: 0.25 } };
  }

  return (
    <>
      <motion.g initial={false} animate={target} transition={move}>
        {/* Cancels the sketch's crooked angle, so the pixels stay square. */}
        <motion.g
          style={{ originX: 0, originY: 1 }}
          initial={false}
          animate={{ rotate: step === 0 ? 2.5 : 0 }}
          transition={at(cue, { 1: { ...spring.playful, delay: 0.05 } }, { ...spring.ui, delay: undoAt(cue, 1) + 0.06 })}
        >
          {/* Idle: it hovers and doodles little loops in the air, ready to draw. Translation
              only, so the pixels stay square. */}
          <motion.g
            animate={ambient && step === 0 ? { x: [0, 1.6, 0.4, -1.4, -0.6, 0], y: [0, -1.2, -2.6, -1.8, 0.4, 0] } : { x: 0, y: 0 }}
            transition={ambient && step === 0 ? { duration: 2.4, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" } : spring.ui}
          >
            {/* Turns round to use the eraser. */}
            <motion.g
              initial={false}
              animate={{ rotate: tracing ? TRACE.flip : 0 }}
              transition={tracing ? { duration: TRACE.duration, times: TRACE.times, ease: "easeInOut" } : { duration: 0 }}
            >
              <PencilArt scale={SCALE} />
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.g>

      {/* Eraser crumbs fall away behind it. */}
      {tracing &&
        CRUMBS.map((crumb, index) => (
          <g key={`${cue.trans?.id}-${index}`} transform={`translate(${crumb.x} ${crumb.y})`}>
            <motion.rect
              width={1.3}
              height={1.3}
              fill={index % 2 ? "#caf0f8" : "#48cae4"}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0], x: [0, (index % 3) - 1, ((index % 3) - 1) * 2.5], y: [0, 4, 13] }}
              transition={{ delay: crumb.t, duration: 0.55, ease: "easeIn" }}
            />
          </g>
        ))}
    </>
  );
}
