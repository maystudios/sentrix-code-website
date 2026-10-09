"use client";

import { motion } from "motion/react";
import { asset } from "@/lib/asset";
import { spring } from "@/lib/motion";
import { Mosaic } from "@/components/ui/Mosaic";

// One product grows through the four process steps (idea from the GPT-6.1 Sol review):
// 0 sketch on paper, 1 grey wireframe, 2 coloured working build, 3 live and launched.
// Every element keeps its place, only its look changes, so the eye follows one object.

type Step = 0 | 1 | 2 | 3;

const SKETCH = "border-dashed border-[#90e0ef]/60 bg-transparent";
const WIRE = "border-solid border-[#8691a6]/60 bg-[#8691a6]/10";

function Box({ step, className, live, children }: { step: Step; className: string; live: string; children?: React.ReactNode }) {
  return (
    <motion.div
      layout
      transition={spring.ui}
      className={`relative overflow-hidden rounded-[6px] border-2 transition-colors duration-500 ${step === 0 ? SKETCH : step === 1 ? WIRE : live} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GrowingPrototype({ step, labels }: { step: number; labels: { live: string; build: string } }) {
  const s = Math.max(0, Math.min(3, step)) as Step;
  const done = s >= 2;
  return (
    <div className={`relative isolate flex aspect-video items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-line ${s === 0 ? "bg-[#f3f6fa]/[0.03]" : "bg-surface"}`}>
      {/* Paper grid while sketching, mosaic once it is real. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(144,224,239,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(144,224,239,0.08)_1px,transparent_1px)] bg-[size:24px_24px]"
        animate={{ opacity: s <= 1 ? 1 : 0 }}
      />
      <motion.div aria-hidden="true" className="absolute inset-0 -z-10" animate={{ opacity: s >= 2 ? 0.55 : 0 }} transition={{ duration: 0.8 }}>
        <Mosaic className="size-full" columns={16} rows={9} from={1} to={4} seed={33} />
      </motion.div>

      {/* The product: an app screen in a device frame. */}
      <motion.div
        layout
        animate={{ rotate: s === 0 ? -2.5 : 0, scale: s === 3 ? 1.04 : 1, y: s === 3 ? -6 : 0 }}
        transition={spring.playful}
        className={`relative flex h-[82%] w-[38%] min-w-[150px] flex-col gap-[5%] rounded-[var(--radius-device)] border-2 p-[4%] transition-colors duration-500 ${
          s === 0 ? "border-dashed border-[#caf0f8]/70" : s === 1 ? "border-[#8691a6]/70 bg-base/60" : "border-base bg-base"
        } ${s === 3 ? "shadow-[0_0_0_3px_rgba(72,202,228,0.55),0_30px_60px_-20px_rgba(0,180,216,0.6)]" : ""}`}
      >
        <Box step={s} className="h-[9%] shrink-0" live="border-transparent bg-ocean-700">
          {done && <span className="absolute left-[6%] top-1/2 size-2 -translate-y-1/2 bg-white" />}
        </Box>
        <Box step={s} className="h-[30%] shrink-0" live="border-transparent bg-ocean-900">
          {s === 1 && (
            <svg className="absolute inset-0 size-full text-[#8691a6]/50" preserveAspectRatio="none" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M0 0L10 10M10 0L0 10" stroke="currentColor" strokeWidth="0.2" />
            </svg>
          )}
          {done && <img src={asset("/images/sprites/gamepad.webp")} alt="" className="absolute left-1/2 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2 object-contain" />}
        </Box>
        {[0, 1, 2].map((row) => (
          <Box key={row} step={s} className="flex h-[10%] shrink-0 items-center gap-[6%] px-[4%]" live="border-transparent bg-raised">
            {done && (
              <>
                <span className={`size-3 shrink-0 ${["bg-ocean-500", "bg-ocean-300", "bg-ocean-700"][row]}`} />
                <span className="h-1.5 w-3/5 bg-fg/60" />
              </>
            )}
          </Box>
        ))}
        <Box step={s} className="mt-auto flex h-[11%] shrink-0 items-center justify-center" live="border-transparent bg-ocean-700">
          {done && <span className="text-[10px] font-medium text-white md:text-xs">{s === 3 ? `✓ ${labels.live}` : labels.build}</span>}
        </Box>

        {/* Sketch scribbles and a pencil while still on paper. */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 100 160"
          className="pointer-events-none absolute inset-0 size-full text-[#caf0f8]/70"
          animate={{ opacity: s === 0 ? 1 : 0 }}
        >
          <path d="M14 70c10-6 20 6 30 0s20-6 30 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M14 92c14-4 28 4 42 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </motion.svg>
      </motion.div>

      {/* Little helpers per step. */}
      <motion.img
        src={asset("/images/icons/idea.webp")}
        alt=""
        aria-hidden="true"
        className="absolute left-[14%] top-[18%] w-[9%]"
        animate={{ opacity: s === 0 ? 1 : 0, y: s === 0 ? 0 : -20, rotate: s === 0 ? -8 : 0 }}
        transition={spring.playful}
      />
      <motion.img
        src={asset("/images/sprites/robot-coder.webp")}
        alt=""
        aria-hidden="true"
        className="absolute bottom-[6%] right-[8%] w-[16%]"
        animate={{ opacity: s === 2 ? 1 : 0, x: s === 2 ? 0 : 30 }}
        transition={spring.playful}
      />
      <motion.img
        src={asset("/images/sprites/rocket.webp")}
        alt=""
        aria-hidden="true"
        className="absolute bottom-[10%] right-[12%] w-[8%]"
        initial={false}
        animate={s === 3 ? { opacity: [0, 1, 1, 0], y: [20, 0, -180, -260] } : { opacity: 0, y: 20 }}
        transition={s === 3 ? { duration: 2.4, times: [0, 0.2, 0.8, 1], ease: "easeIn" } : { duration: 0.2 }}
      />
      {s === 3 &&
        [0, 1, 2, 3, 4, 5].map((index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            className="absolute size-2"
            style={{ left: `${30 + index * 8}%`, top: "20%", background: ["#ffb703", "#48cae4", "#caf0f8"][index % 3] }}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], y: [0, -30 - index * 6, 10], scale: [0, 1, 0.6], rotate: index * 40 }}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.05 }}
          />
        ))}
    </div>
  );
}
