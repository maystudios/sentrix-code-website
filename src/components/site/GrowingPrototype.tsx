"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
  type Transition,
} from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { spring } from "@/lib/motion";
import { Mosaic } from "@/components/ui/Mosaic";
import { PixelIcon } from "@/components/brand/PixelIcon";
import { PixelRobot } from "@/components/brand/PixelCharacters";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { CHECK_PIXELS, PixelBadge, PixelJet, PixelRewind, PixelUser } from "./process/art";
import { backDelay, Block, snapDelay, WIRE } from "./process/Block";
import { Confetti, Sparkle } from "./process/Bursts";
import { Pencil } from "./process/Pencil";
import { RevenueCard } from "./process/Revenue";
import {
  arriving,
  at,
  BLOCKS,
  cueOf,
  DEVICE_H,
  FRAME_PATH,
  rewound,
  roughRect,
  settleTime,
  stepped,
  TRACE,
  undo,
  undoAt,
  WIRE_CONTENT,
  type Cue,
  type Step,
  type Trans,
  type Undo,
} from "./process/choreo";

// One product grows through the four process steps (idea from the GPT-6.1 Sol review):
// 0 sketch on paper, 1 grey wireframe, 2 coloured working build, 3 live and launched.
// Every element keeps its place, only its look changes, so the eye follows one object.
// Each change is a short staged sequence (process/choreo.ts):
// - sketch → wireframe: the pixel pencil traces the outline, boxes ink in as it passes,
//   then it turns round and rubs the scribbles out;
// - wireframe → build: the robot flies in on jet boots and sweeps down the device, its beam
//   snapping the blocks into colour top to bottom; it flies back up and types <Game />, which
//   compiles into the gamepad, then beams the rows' content in and lands;
// - build → live: the button's progress fills, it flips to "live" with a check that draws
//   itself, square confetti falls with gravity, a revenue card pops out with rising bars and a
//   counting total, and the robot jumps for joy;
// - going back rebuilds in reverse: the status goes, the colour gives way to the wireframe,
//   and the sketch strokes return last.
// While the build runs, the robot keeps working: it flies from block to block and beams
// at each one, which glows and takes small knocks. Live, every user who joins brings a new
// month to the revenue card and the robot cheers. A row opens a small detail when clicked,
// the button sends one short message. Confetti belongs to the release alone.

type Labels = { live: string; build: string; thanks: string; revenue: string };

const CODE_AT = 1.25;
const GAMEPAD_AT = 2.0;
const ROWS_AT = 2.12;
const LIVE_AT = 1.0;
const RELEASE_AT = 1.12;
const CARD_AT = 1.3;

// The robot stands to the right of the device, facing it, feet on the device's baseline.
// Its raised hand (and the beam) sits `hand` units below its top.
const ROBOT = { x: 109, top: 94, w: 30, h: 42, hand: 18.6 };
const REST = -1;
// Where the beam meets a block: its right edge.
const BEAM_TO = BLOCKS[0].x + BLOCKS[0].w;

// Flight height, in % of the robot's height (0 = standing), that levels its hand with a block.
function levelOf(block: number) {
  if (block === REST) return 0;
  const spec = BLOCKS[block];
  return Math.min(0, ((spec.y + spec.h / 2 - ROBOT.hand - ROBOT.top) / ROBOT.h) * 100);
}

// The robot's flight while the build arrives: [seconds, block, ease into this point].
// It sweeps down level with each block as it snaps into colour, flies back up to type the
// code, beams the rows' content in one after the other and lands.
const BUILD_FLIGHT: [number, number, Transition["ease"]][] = [
  [0, 0, "linear"],
  [snapDelay(0), 0, "linear"],
  [snapDelay(1), 1, "linear"],
  [snapDelay(2), 2, "linear"],
  [snapDelay(3), 3, "linear"],
  [snapDelay(4), 4, "linear"],
  [snapDelay(5), REST, "linear"],
  [CODE_AT - 0.08, 1, [0.3, 0, 0.2, 1]],
  [GAMEPAD_AT, 1, "linear"],
  [ROWS_AT, 2, [0.4, 0, 0.2, 1]],
  [ROWS_AT + 0.1, 3, "linear"],
  [ROWS_AT + 0.2, 4, "linear"],
  [ROWS_AT + 0.6, REST, [0.2, 0.6, 0.3, 1]],
];
// When the beam is on during the build: the sweep, the code and the rows.
const BUILD_BEAM: [number, number][] = [
  [snapDelay(0) - 0.05, snapDelay(5) + 0.04],
  [CODE_AT, GAMEPAD_AT - 0.12],
  [ROWS_AT - 0.04, ROWS_AT + 0.34],
];
// Blocks the robot visits while the build runs on (REST: a short break on the ground).
const ROUNDS = [1, 3, 2, 4, REST];

const u = (value: number) => `${value}cqw`;

const circle = (cx: number, cy: number, r: number) => `M${cx + r} ${cy}a${r} ${r} 0 1 1 ${-2 * r} 0a${r} ${r} 0 1 1 ${2 * r} 0`;
const squiggle = (x: number, y: number, waves: number, size = 2.6) => `M${x} ${y}q${size / 2} ${-size * 0.8} ${size} 0${`t${size} 0`.repeat(waves - 1)}`;

const ROWS = [
  { icon: "#00b4d8", words: [[12, 18], [32, 9], [43, 13]] },
  { icon: "#90e0ef", words: [[12, 24], [38, 11]] },
  { icon: "#ffb703", words: [[12, 14], [28, 16], [46, 7]] },
] as const;

const SCRIBBLES = {
  header: `${circle(5, 5, 1.8)}${squiggle(10, 5, 8)}`,
  hero: `M8 34L24 16L33 26L46 10L62 32${circle(71, 11, 4.5)}M5 35.5Q43 33 81 35.5`,
  rows: [squiggle(13, 5.5, 12), squiggle(13, 5.5, 9), squiggle(13, 5.5, 13)].map((line) => `${circle(6, 5.5, 2)}${line}`),
  button: squiggle(30, 6.5, 10),
};

const FRAME_SKETCH = [roughRect(100, DEVICE_H, 41, 2.2), roughRect(100, DEVICE_H, 43, 2.2)];

const BUTTON = BLOCKS[5];

// True once `seconds` have passed in change `id` while `when` holds.
function useLater(when: boolean, seconds: number, id: number) {
  const [doneId, setDoneId] = useState(-1);
  useEffect(() => {
    if (!when) return;
    const timer = setTimeout(() => setDoneId(id), seconds * 1000);
    return () => clearTimeout(timer);
  }, [when, seconds, id]);
  return when && doneId === id;
}

export function GrowingPrototype({ step, labels, locale }: { step: number; labels: Labels; locale: string }) {
  const s = Math.max(0, Math.min(3, step)) as Step;
  const { reduced } = useMotionPolicy();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const nudge = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "0px 0px -10% 0px" });

  // The change of step that is playing right now. A change closes what was open live.
  const [shown, setShown] = useState<Step>(s);
  const [trans, setTrans] = useState<Trans | null>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [note, setNote] = useState<{ id: number; x: number } | null>(null);
  if (s !== shown) {
    setShown(s);
    setTrans({ from: shown, to: s, id: (trans?.id ?? 0) + 1 });
    setOpenRow(null);
    setNote(null);
  }
  const id = trans?.id ?? 0;
  const change = useMemo(() => cueOf(trans, reduced), [trans, reduced]);

  // Each change ends explicitly once its sequence has played: the cue rests, one-off effects
  // unmount, and ambient loops may start, only while the panel is visible.
  const [settledId, setSettledId] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setSettledId(id), settleTime(change) * 1000);
    return () => clearTimeout(timer);
  }, [change, id]);
  const settled = settledId === id;
  const cue = useMemo<Cue>(() => (settled ? { ...change, mode: "rest" } : change), [change, settled]);
  const ambient = inView && !reduced && settled;

  // The build phase runs from the moment "Build läuft" shows until the button flips to live.
  // Only then, and only on screen with full motion, does the spinner turn.
  const labelIn = useLater(arriving(cue, 2), snapDelay(5) + 0.12, id);
  const flipped = useLater(arriving(cue, 3), LIVE_AT - 0.06, id);
  const building = arriving(cue, 2) ? labelIn : arriving(cue, 3) ? !flipped : s === 2;
  const spinning = building && inView && !reduced;

  // The robot. `fly` lifts it on its jet boots (in % of its height, 0 = standing), `hop` is
  // its body for small jumps; it beams at a block, or cheers with its arm going.
  const fly = useMotionValue(0);
  const flyY = useTransform(fly, (value) => `${value}%`);
  const jets = useTransform(fly, (value) => (value < -3 ? 1 : 0));
  const stretch = useTransform(useVelocity(fly), (speed) => 1 + Math.min(0.07, Math.abs(speed) / 5000));
  const squeeze = useTransform(stretch, (value) => 2 - value);
  const hop = useRef<HTMLDivElement>(null);
  const [beaming, setBeaming] = useState(false);
  const [worked, setWorked] = useState<number | null>(null);
  const [cheering, setCheering] = useState(false);
  const cheerTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(cheerTimer.current), []);
  const cheer = useCallback(() => {
    const body = hop.current;
    if (!body) return;
    animate(body, { y: ["0%", "-24%", "0%", "-7%", "0%"], scaleY: [1, 1.05, 0.9, 1.02, 1] }, { duration: 0.72, times: [0, 0.36, 0.62, 0.8, 1], ease: "easeOut" });
    setCheering(true);
    clearTimeout(cheerTimer.current);
    cheerTimer.current = setTimeout(() => setCheering(false), 900);
  }, []);

  // Build arrives: the flight down the device and back, with the beam on in between.
  const buildArrives = arriving(cue, 2);
  useEffect(() => {
    if (!buildArrives) return;
    const end = BUILD_FLIGHT[BUILD_FLIGHT.length - 1][0];
    const flight = animate(
      fly,
      BUILD_FLIGHT.map(([, block]) => levelOf(block)),
      { duration: end, times: BUILD_FLIGHT.map(([t]) => t / end), ease: BUILD_FLIGHT.slice(1).map(([, , curve]) => curve) as never },
    );
    const typing = hop.current ? animate(hop.current, { y: ["0%", "-4%", "0%"] }, { delay: CODE_AT, duration: 0.24, repeat: 2, ease: "easeInOut" }) : undefined;
    const timers = BUILD_BEAM.flatMap(([from, to]) => [setTimeout(() => setBeaming(true), from * 1000), setTimeout(() => setBeaming(false), to * 1000)]);
    return () => {
      flight.stop();
      typing?.stop();
      timers.forEach(clearTimeout);
      setBeaming(false);
    };
  }, [buildArrives, id, fly]);

  // While the build runs on, the robot flies from block to block and works on each.
  const working = ambient && s === 2;
  useEffect(() => {
    if (!working) return;
    let stopped = false;
    let flight: AnimationPlaybackControls | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wait = (ms: number) => new Promise<void>((resolve) => (timer = setTimeout(resolve, ms)));
    (async () => {
      await wait(450);
      for (let round = 0; !stopped; round++) {
        const block = ROUNDS[round % ROUNDS.length];
        flight = animate(fly, levelOf(block), { type: "spring", duration: 0.6, bounce: 0.28 });
        await flight;
        if (stopped) return;
        if (block === REST) {
          await wait(1300);
          continue;
        }
        setBeaming(true);
        setWorked(block);
        await wait(1150);
        if (stopped) return;
        setBeaming(false);
        setWorked(null);
        await wait(180);
      }
    })();
    return () => {
      stopped = true;
      flight?.stop();
      clearTimeout(timer);
      setBeaming(false);
      setWorked(null);
    };
  }, [working, fly]);

  // Outside the build the robot stands on the ground.
  const grounded = s !== 2;
  useEffect(() => {
    if (!grounded) return;
    const landing = animate(fly, 0, { type: "spring", duration: 0.5, bounce: 0.2 });
    return () => landing.stop();
  }, [grounded, fly]);

  // Release: it jumps for joy when the button flips and again when the record bar is up.
  const releaseArrives = arriving(cue, 3);
  useEffect(() => {
    if (!releaseArrives) return;
    const timers = [setTimeout(cheer, (LIVE_AT + 0.02) * 1000), setTimeout(cheer, (CARD_AT + 0.95) * 1000)];
    return () => timers.forEach(clearTimeout);
  }, [releaseArrives, id, cheer]);

  // Live: users join now and then, each with a notification badge on a row, a new month on
  // the revenue card and a cheer from the robot.
  const [joined, setJoined] = useState(3);
  const liveLoop = ambient && s === 3;
  useEffect(() => {
    if (!liveLoop) return;
    const timer = setInterval(() => {
      setJoined((count) => count + 1);
      cheer();
    }, 2300);
    return () => clearInterval(timer);
  }, [liveLoop, cheer]);

  // A small snap of the whole stage when it gets built.
  useEffect(() => {
    const element = nudge.current;
    if (!element || !arriving(cue, 2)) return;
    const snap = animate(element, { scale: [1, 1.025, 1] }, { delay: 0.3, duration: 0.3, ease: "easeOut" });
    return () => snap.complete();
  }, [cue]);

  // The device leans towards the pointer.
  const tiltX = useSpring(0, { stiffness: 170, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 170, damping: 18 });
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
    tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Live, the product answers where it is clicked: a row opens its detail right below it,
  // the button sends one short message from the spot it was pressed.
  const live = s === 3;
  const noteId = useRef(0);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(noteTimer.current), []);
  const pressRow = (row: number) => (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setOpenRow((open) => (open === row ? null : row));
  };
  const pressButton = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const box = stage.current?.getBoundingClientRect();
    const x = box ? ((event.clientX - box.left) / box.width) * 100 : 50;
    noteId.current += 1;
    setNote({ id: noteId.current, x: Math.min(74, Math.max(26, x)) });
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(null), 1700);
  };

  // The device face: see-through on paper, half dark as a wireframe, solid once built.
  const [faceFill, faceFillBack] = rewound(cue, ["rgba(11,15,23,0)", "rgba(11,15,23,0.55)", "rgba(11,15,23,1)", "rgba(11,15,23,1)"], s, { 2: 0.12, 1: 0.06 });
  const [faceLine, faceLineBack] = rewound(cue, ["rgba(43,54,74,0)", "rgba(43,54,74,0)", "rgba(43,54,74,1)", "rgba(72,202,228,1)"], s, { 3: 0, 2: 0.12 });

  return (
    <div
      ref={root}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate aspect-square select-none overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface sm:aspect-video"
    >
      {/* Paper while sketching, grid paper for the wireframe, mosaic once it is real. */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[#f3f6fa]/[0.035]"
        initial={false}
        animate={{ opacity: s === 0 ? 1 : 0 }}
        transition={at(cue, { 1: { delay: 0.6, duration: 0.8 } }, undo(cue, 1, 0.06, 0.24))}
      />
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(144,224,239,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(144,224,239,0.08)_1px,transparent_1px)] bg-[size:24px_24px]"
        initial={false}
        animate={{ opacity: s <= 1 ? 1 : 0 }}
        transition={at(cue, { 2: { delay: 0.18, duration: 0.5, ease: stepped(4) } }, undo(cue, 2, 0.04, 0.24))}
      />
      <motion.div
        className="absolute inset-0 -z-10"
        initial={false}
        animate={{ opacity: s >= 2 ? 1 : 0 }}
        transition={at(cue, { 2: { delay: 0.18, duration: 0.6, ease: stepped(5) } }, undo(cue, 2, 0, 0.24))}
      >
        <Mosaic className="size-full" tile={28} from={0} to={3} seed={33} />
      </motion.div>

      {/* The device sits a little low, leaving headroom for the pencil on the top edge. */}
      <div className="absolute inset-0 flex items-start justify-center pt-[15%] sm:pt-[7.6%]">
        <div ref={stage} className="@container relative aspect-[100/136] w-[56%] sm:w-[33%]">
          <div ref={nudge} className="absolute inset-0">
            {/* The idea, while it is still a sketch. */}
            <motion.div
              className="absolute"
              style={{ left: u(-34), top: u(8), width: u(24) }}
              initial={false}
              animate={{ opacity: s === 0 ? 1 : 0, scale: s === 0 ? 1 : 0.4, y: s === 0 ? 0 : -24 }}
              transition={at(cue, { 1: { duration: 0.35, ease: [0.5, 0, 0.75, 0] } }, { ...spring.playful, delay: undoAt(cue, 1) + 0.12 })}
            >
              <motion.div
                animate={ambient && s === 0 ? { y: [0, -5, 0] } : { y: 0 }}
                transition={ambient && s === 0 ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
              >
                <PixelIcon name="idea" className="h-auto w-full" />
              </motion.div>
            </motion.div>

            {/* The robot builds it on jet boots, then cheers at the release. Its beam reaches over the device. */}
            <motion.div
              className="absolute z-10"
              style={{ left: u(ROBOT.x), top: u(ROBOT.top), width: u(ROBOT.w) }}
              initial={false}
              animate={s >= 2 ? { opacity: 1, x: "0%" } : { opacity: 0, x: "70%" }}
              transition={at(cue, { 2: { x: { ...spring.playful, delay: 0.05 }, opacity: { delay: 0.05, duration: 0.15 } } }, { duration: 0.25, delay: undoAt(cue, 2) + 0.05 })}
            >
              <motion.div style={{ y: flyY, scaleY: stretch, scaleX: squeeze, originY: 1 }}>
                <div ref={hop} className="relative" style={{ transformOrigin: "50% 100%" }}>
                  <Beam on={beaming} />
                  <motion.span className="absolute flex justify-between" style={{ left: u(10.8), top: u(ROBOT.h - 0.6), width: u(10.8), opacity: jets }}>
                    <PixelJet className="aspect-[3/4] w-1/3" />
                    <PixelJet className="aspect-[3/4] w-1/3" />
                  </motion.span>
                  <PixelRobot className="w-full" mirrored busy={beaming || cheering} waves={s === 3 && ambient} watching={s >= 2 && !reduced} />
                </div>
              </motion.div>
            </motion.div>

            {/* The device. A click beside the rows closes an open detail. */}
            <motion.div
              className="absolute inset-0"
              style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
              initial={false}
              animate={{ rotate: s === 0 ? -2.5 : 0, y: s === 3 ? -8 : 0, scale: s === 3 ? 1.03 : 1 }}
              transition={{
                rotate: at(cue, { 1: { ...spring.playful, delay: 0.05 } }, { ...spring.ui, delay: undoAt(cue, 1) + 0.06 }),
                y: at(cue, { 3: { ...spring.playful, delay: LIVE_AT } }, { ...spring.ui, delay: undoAt(cue, 3) }),
                scale: at(cue, { 3: { ...spring.playful, delay: LIVE_AT } }, { ...spring.ui, delay: undoAt(cue, 3) }),
              }}
              onClick={live && openRow !== null ? () => setOpenRow(null) : undefined}
            >
              {/* Hard pixel shadow that grows as it lifts off. */}
              <motion.div
                className="absolute inset-0 bg-ocean-950"
                style={{ borderRadius: u(8) }}
                initial={false}
                animate={{ opacity: s >= 2 ? 1 : 0, x: s === 3 ? "3.5%" : "0%", y: s === 3 ? "2.6%" : "0%" }}
                transition={at(
                  cue,
                  { 2: { delay: 0.3, duration: 0 }, 3: { ...spring.playful, delay: LIVE_AT } },
                  { ...undo(cue, 3), opacity: undo(cue, 2, 0.12, 0) },
                )}
              />
              <motion.div
                className="absolute inset-0 border-solid"
                style={{ borderRadius: u(8), borderWidth: u(0.9) }}
                initial={false}
                animate={{ backgroundColor: faceFill, borderColor: faceLine }}
                transition={
                  faceFillBack && faceLineBack
                    ? { backgroundColor: faceFillBack, borderColor: faceLineBack }
                    : at(cue, { 1: { delay: 0.7, duration: 0.6 }, 2: { delay: 0.3, duration: 0 }, 3: { delay: LIVE_AT, duration: 0 } })
                }
              />

              {/* Wireframe: a faint scan line passes now and then. */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: u(8) }}>
                <motion.div
                  className="absolute inset-x-0 top-0 h-full"
                  initial={false}
                  animate={ambient && s === 1 ? { y: ["-8%", "104%"], opacity: 1 } : { y: "-8%", opacity: 0 }}
                  transition={ambient && s === 1 ? { duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "linear" } : { duration: 0 }}
                >
                  <span className="absolute inset-x-0 bg-ocean-300/[0.09]" style={{ top: u(-7), height: u(7) }} />
                  <span className="absolute inset-x-0 top-0 bg-ocean-300/70" style={{ height: u(0.6) }} />
                </motion.div>
              </div>

              {BLOCKS.map((spec, index) => {
                const row = spec.id.startsWith("row") ? index - 2 : null;
                return (
                  <Block
                    key={spec.id}
                    spec={spec}
                    index={index}
                    step={s}
                    cue={cue}
                    boil={ambient && s === 0}
                    build={spec.id === "hero" ? "#023e8a" : row !== null ? "#1a2231" : "#0077b6"}
                    live={spec.id === "button" ? "#48cae4" : undefined}
                    liveAt={LIVE_AT}
                    flips={spec.id === "button"}
                    scribble={spec.id === "header" ? SCRIBBLES.header : spec.id === "hero" ? SCRIBBLES.hero : spec.id === "button" ? SCRIBBLES.button : SCRIBBLES.rows[index - 2]}
                    onPress={!live ? undefined : row !== null ? pressRow(row) : spec.id === "button" ? pressButton : undefined}
                    pressed={live && row !== null && openRow === row}
                    worked={worked === index}
                  >
                    {spec.id === "header" && <HeaderContent step={s} cue={cue} ambient={liveLoop} joined={joined} />}
                    {spec.id === "hero" && <HeroContent step={s} cue={cue} id={id} />}
                    {row !== null && <RowContent row={row} step={s} cue={cue} ambient={ambient} joined={liveLoop && joined > 3 ? joined : 0} />}
                    {spec.id === "button" && <ButtonContent step={s} cue={cue} labels={labels} spinning={spinning} id={id} />}
                  </Block>
                );
              })}

              {/* Live: the detail of the clicked row, and the button's message. */}
              <AnimatePresence>{live && openRow !== null && <RowDetail key={`detail-${openRow}`} row={openRow} />}</AnimatePresence>
              <AnimatePresence>{live && note && <Note key={`note-${note.id}`} x={note.x} text={labels.thanks} />}</AnimatePresence>

              {/* Device outline, effects and the pencil, in device units. */}
              <svg viewBox={`0 0 100 ${DEVICE_H}`} className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
                <motion.g
                  initial={false}
                  animate={{ opacity: s === 0 ? 1 : 0 }}
                  transition={at(cue, { 1: { delay: TRACE.start, duration: TRACE.duration } }, undo(cue, 1, 0.14, 0.1))}
                  fill="none"
                  stroke="#caf0f8"
                  strokeOpacity={0.75}
                  strokeWidth={0.9}
                  strokeDasharray="3.2 2.2"
                  strokeLinecap="round"
                >
                  {FRAME_SKETCH.map((d, index) => (
                    <motion.path
                      key={index}
                      d={d}
                      initial={{ opacity: index }}
                      animate={{ opacity: ambient && s === 0 ? (index ? [1, 1, 0, 0] : [0, 0, 1, 1]) : index ? 0 : 1 }}
                      transition={ambient && s === 0 ? { duration: 0.56, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" } : { duration: 0 }}
                    />
                  ))}
                </motion.g>
                <motion.path
                  d={FRAME_PATH}
                  fill="none"
                  strokeWidth={1.1}
                  initial={false}
                  animate={{ pathLength: s >= 1 ? 1 : 0, opacity: s >= 2 ? 0 : 1, stroke: arriving(cue, 1) ? ["#caf0f8", "#caf0f8", WIRE] : WIRE }}
                  transition={{
                    pathLength: at(cue, { 1: { delay: TRACE.start, duration: TRACE.duration, ease: "linear" } }, undo(cue, 1, 0.04, 0.2)),
                    opacity: at(cue, { 2: { delay: 0.3, duration: 0 } }, undo(cue, 2, 0.12, 0)),
                    stroke: arriving(cue, 1) ? { delay: TRACE.start, duration: TRACE.duration + 0.8, times: [0, 0.6, 1] } : { duration: 0 },
                  }}
                />

                {arriving(cue, 2) && <Sparkle key={`spark-${id}`} x={50} y={42} delay={GAMEPAD_AT} reach={22} />}
                {arriving(cue, 3) && <Sparkle key={`check-${id}`} x={50} y={120.5} delay={LIVE_AT + 0.12} reach={14} colour="#ffffff" />}

                <Pencil step={s} cue={cue} ambient={ambient} />
              </svg>
            </motion.div>

            {/* Live: the revenue card pops out of the device, to its left (on phones over its lower left, clear of the button's label). */}
            <AnimatePresence>
              {s === 3 && (
                <motion.div
                  key="revenue"
                  className="absolute left-[-37cqw] top-[84cqw] w-[66cqw] sm:left-[-96cqw] sm:top-[34cqw] sm:w-[90cqw]"
                  initial={arriving(cue, 3) ? { opacity: 0, x: "45%", scale: 0.5, rotate: 5 } : false}
                  animate={{ opacity: 1, x: "0%", scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.14, ease: stepped(3) } }}
                  transition={{ type: "spring", stiffness: 320, damping: 24, delay: CARD_AT, opacity: { delay: CARD_AT, duration: 0.1 } }}
                >
                  <RevenueCard month={joined} enter={arriving(cue, 3)} delay={CARD_AT} label={labels.revenue} locale={locale} reduced={reduced} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Release confetti over everything, not tilted with the device. */}
            <svg viewBox={`0 0 100 ${DEVICE_H}`} className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
              {arriving(cue, 3) && <Confetti key={`release-${id}`} x={50} y={118} seed={id * 31} count={40} delay={RELEASE_AT} />}
            </svg>
          </div>
        </div>
      </div>

      {/* Rewind sign while it rebuilds back to an earlier step. */}
      {cue.mode === "back" && (
        <motion.div
          key={`rewind-${id}`}
          className="absolute left-3 top-3 flex items-center rounded-[var(--radius-control)] border border-line-strong bg-raised px-2 py-1.5"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: [0, 1, 1, 0], x: [-6, 0, 0, 0] }}
          transition={{ duration: settleTime(cue) - 0.02, times: [0, 0.2, 0.75, 1] }}
        >
          <motion.span animate={{ x: [0, -3, 0, -3, 0] }} transition={{ duration: 0.4, ease: stepped(4) }} className="block">
            <PixelRewind className="block h-[15px] w-[27px]" />
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}

type PartProps = { step: Step; cue: Cue };

// Wireframe placeholders come in with the trace and go again when the sketch returns.
function wireIn(cue: Cue, delay: number, block: number): Transition {
  return at(cue, { 1: { delay, duration: 0.24, ease: stepped(4) } }, rewind(cue, 1, block));
}

// Going back, contents change in the undo of step `k`, together with their block.
function rewind(cue: Cue, k: Undo, block: number, extra = 0): Transition {
  return undo(cue, k, backDelay(block) + extra, 0.12);
}

function HeaderContent({ step, cue, ambient, joined }: PartProps & { ambient: boolean; joined: number }) {
  const snap = snapDelay(0);
  const users = [joined - 3, joined - 2, joined - 1];
  return (
    <>
      <motion.span
        className="absolute"
        style={{ left: u(3), top: u(3.25), width: u(3.5), height: u(3.5) }}
        initial={false}
        animate={{
          opacity: step >= 1 ? 1 : 0,
          scale: arriving(cue, 2) ? [1, 1.5, 1] : step >= 1 ? 1 : 0,
          backgroundColor: step >= 2 ? "#ffffff" : WIRE,
        }}
        transition={{
          opacity: wireIn(cue, WIRE_CONTENT, 0),
          scale: at(cue, { 1: { ...spring.playful, delay: WIRE_CONTENT }, 2: { delay: snap + 0.08, duration: 0.3 } }, rewind(cue, 1, 0)),
          backgroundColor: at(cue, { 2: { delay: snap + 0.08, duration: 0 } }, rewind(cue, 2, 0)),
        }}
      />
      <motion.span
        className="absolute origin-left"
        style={{ left: u(9), top: u(4), width: u(20), height: u(2) }}
        initial={false}
        animate={{
          scaleX: arriving(cue, 2) ? [0, 1] : step >= 1 ? 1 : 0,
          backgroundColor: step >= 2 ? "rgba(243,246,250,0.85)" : WIRE,
        }}
        transition={{
          scaleX: at(cue, { 1: { delay: WIRE_CONTENT + 0.04, duration: 0.24, ease: stepped(4) }, 2: { delay: snap + 0.12, duration: 0.3, ease: stepped(5) } }, rewind(cue, 1, 0)),
          backgroundColor: at(cue, { 2: { delay: snap + 0.1, duration: 0 } }, rewind(cue, 2, 0)),
        }}
      />

      {/* Live: an online light and the people using it. Both go first when it rewinds. */}
      <motion.span
        className="absolute"
        style={{ left: u(79), top: u(3.5), width: u(3), height: u(3) }}
        initial={false}
        animate={{ opacity: step === 3 ? 1 : 0, scale: step === 3 ? 1 : 0 }}
        transition={at(cue, { 3: { ...spring.playful, delay: RELEASE_AT + 0.2 } }, undo(cue, 3, 0, 0.1))}
      >
        <span className="absolute inset-0 bg-ocean-300" />
        <motion.span
          className="absolute inset-0 border-ocean-300"
          style={{ borderWidth: u(0.5) }}
          animate={ambient ? { scale: [1, 2.4], opacity: [0.9, 0] } : { scale: 1, opacity: 0 }}
          transition={ambient ? { duration: 1.4, repeat: Infinity, ease: "easeOut" } : { duration: 0 }}
        />
      </motion.span>
      <motion.span
        className="absolute flex justify-end"
        style={{ right: u(9.5), top: u(2), height: u(6) }}
        initial={false}
        animate={{ opacity: step === 3 ? 1 : 0 }}
        transition={at(cue, { 3: { delay: RELEASE_AT + 0.45, duration: 0.2 } }, undo(cue, 3, 0, 0.1))}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {users.map((user, index) => (
            <motion.span
              key={user}
              layout
              className="relative block bg-ocean-950"
              style={{ width: u(6), height: u(6), marginLeft: index ? u(-1.2) : 0, outline: `${u(0.5)} solid #0077b6` }}
              initial={{ scale: 0, y: "70%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0, opacity: 0 }}
              transition={spring.playful}
            >
              <PixelUser look={((user % 4) + 4) % 4} className="block size-full" />
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.span>
    </>
  );
}

function HeroContent({ step, cue, id }: PartProps & { id: number }) {
  const snap = snapDelay(1);
  // The placeholder cross belongs to the wireframe alone, so a rewind from colour shows it once.
  const [cross, crossBack] = rewound(cue, [0, 1, 0, 0], step, backDelay(1));
  return (
    <>
      {/* Wireframe image placeholder. */}
      <svg viewBox="0 0 86 40" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
        {["M3 3L83 37", "M83 3L3 37"].map((d, index) => (
          <motion.path
            key={d}
            d={d}
            stroke={WIRE}
            strokeOpacity={0.6}
            strokeWidth={0.6}
            initial={false}
            animate={{ pathLength: step >= 1 ? 1 : 0, opacity: cross }}
            transition={{
              pathLength: at(cue, { 1: { delay: WIRE_CONTENT + index * 0.1, duration: 0.3, ease: "easeOut" } }, rewind(cue, 1, 1, 0.02)),
              opacity: crossBack ?? at(cue, { 1: { duration: 0 }, 2: { delay: snap, duration: 0 } }),
            }}
          />
        ))}
      </svg>

      {/* Code is typed, then compiles into the game. */}
      {arriving(cue, 2) && <CodeLine key={id} />}

      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0 }}
        transition={at(cue, { 2: { type: "spring", stiffness: 480, damping: 17, delay: GAMEPAD_AT, opacity: { duration: 0.05, delay: GAMEPAD_AT } } }, rewind(cue, 2, 1))}
      >
        <PixelIcon name="gamepad" className="h-[78%] w-auto" />
      </motion.span>
    </>
  );
}

const CODE = "<Game />";

function CodeLine() {
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center font-mono text-ocean-100"
      style={{ fontSize: u(5.4) }}
      initial={{ opacity: 1, scaleX: 1, scaleY: 1 }}
      animate={{ opacity: [1, 1, 0], scaleX: [1, 1.08, 0.05], scaleY: [1, 1.2, 0.3] }}
      transition={{ delay: GAMEPAD_AT - 0.16, duration: 0.2, ease: "easeIn" }}
    >
      {[...CODE].map((char, index) => (
        <motion.span
          key={index}
          className="inline-block overflow-hidden whitespace-pre"
          initial={{ maxWidth: "0ch" }}
          animate={{ maxWidth: "1ch" }}
          transition={{ delay: CODE_AT + index * 0.075, duration: 0 }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="ml-[0.08em] inline-block h-[1.05em] w-[0.55em] bg-ocean-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0, 1, 1, 0, 1] }}
        transition={{ delay: CODE_AT - 0.1, duration: GAMEPAD_AT - CODE_AT, ease: stepped(8) }}
      />
    </motion.span>
  );
}

function RowContent({ row, step, cue, ambient, joined }: PartProps & { row: number; ambient: boolean; joined: number }) {
  const { icon, words } = ROWS[row];
  const blockIndex = row + 2;
  const snap = snapDelay(blockIndex);
  const typeAt = ROWS_AT + row * 0.1;
  const last = words[words.length - 1];
  const end = last[0] + last[1];
  const [bar, barBack] = rewound(cue, [1, 0.75, 0, 0], step, backDelay(blockIndex));
  return (
    <>
      <motion.span
        className="absolute"
        style={{ left: u(3.5), top: u(3), width: u(5), height: u(5) }}
        initial={false}
        animate={{
          opacity: step >= 1 ? 1 : 0,
          scale: arriving(cue, 2) ? [1, 1.4, 1] : 1,
          backgroundColor: step >= 2 ? icon : WIRE,
        }}
        transition={{
          opacity: wireIn(cue, WIRE_CONTENT + 0.1 + row * 0.06, blockIndex),
          scale: at(cue, { 2: { delay: typeAt - 0.06, duration: 0.3 } }, rewind(cue, 2, blockIndex)),
          backgroundColor: at(cue, { 2: { delay: typeAt - 0.06, duration: 0 } }, rewind(cue, 2, blockIndex)),
        }}
      />
      {/* Wireframe text bar, typed over by the real words. */}
      <motion.span
        className="absolute origin-left"
        style={{ left: u(12), top: u(4.5), width: u(end - 12), height: u(2), backgroundColor: WIRE }}
        initial={false}
        animate={{ scaleX: step >= 1 ? 1 : 0, opacity: bar }}
        transition={{
          scaleX: wireIn(cue, WIRE_CONTENT + 0.12 + row * 0.06, blockIndex),
          opacity: barBack ?? at(cue, { 2: { delay: snap + 0.02, duration: 0.15, ease: stepped(2) } }),
        }}
      />
      {words.map(([x, w], index) => (
        <motion.span
          key={x}
          className="absolute origin-left bg-fg/70"
          style={{ left: u(x), top: u(4.5), width: u(w), height: u(2) }}
          initial={false}
          animate={{ scaleX: step >= 2 ? 1 : 0 }}
          transition={at(cue, { 2: { delay: typeAt + index * 0.08, duration: 0.2, ease: stepped(3) } }, rewind(cue, 2, blockIndex))}
        />
      ))}

      {/* Build: data loads in a shimmer, the caret blinks where typing goes on. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: u(2.4) }}>
        <motion.span
          className="absolute inset-y-0 left-0 bg-ocean-100/[0.07]"
          style={{ width: u(10) }}
          initial={false}
          animate={ambient && step === 2 ? { x: ["-100%", "960%"] } : { x: "-100%" }}
          transition={ambient && step === 2 ? { duration: 1.2, repeat: Infinity, repeatDelay: 1.6, delay: row * 0.22, ease: "easeInOut" } : { duration: 0 }}
        />
      </div>
      {row === 2 && (
        <motion.span
          className="absolute bg-ocean-300"
          style={{ left: u(end + 1.2), top: u(3.5), width: u(1.2), height: u(4) }}
          initial={false}
          animate={step === 2 ? { opacity: ambient ? [1, 1, 0, 0] : 1 } : { opacity: 0 }}
          transition={step === 2 && ambient ? { duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" } : { duration: 0, delay: arriving(cue, 2) ? typeAt + 0.3 : 0 }}
        />
      )}

      {/* Live: a notification badge pops on the icon now and then. */}
      {joined > 0 && joined % 3 === row && (
        <motion.span
          key={joined}
          className="absolute"
          style={{ left: u(6.6), top: u(0.6), width: u(3.2) }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1.3, 1, 1, 0], y: ["40%", "0%", "0%", "0%", "-20%"] }}
          transition={{ duration: 1.9, times: [0, 0.12, 0.2, 0.85, 1], ease: "easeOut" }}
        >
          <PixelBadge className="block h-auto w-full" />
        </motion.span>
      )}
    </>
  );
}

function ButtonContent({ step, cue, labels, spinning, id }: PartProps & { labels: Labels; spinning: boolean; id: number }) {
  const snap = snapDelay(5);
  const [bar, barBack] = rewound(cue, [1, 0.8, 0, 0], step, backDelay(5));
  return (
    <>
      <motion.span
        className="absolute origin-left"
        style={{ left: u(30), top: u(5.3), width: u(26), height: u(2.4), backgroundColor: WIRE }}
        initial={false}
        animate={{ scaleX: step >= 1 ? 1 : 0, opacity: bar }}
        transition={{ scaleX: wireIn(cue, WIRE_CONTENT + 0.32, 5), opacity: barBack ?? at(cue, { 2: { delay: snap + 0.05, duration: 0 } }) }}
      />

      {/* The build fills up before it flips to live. */}
      {arriving(cue, 3) && (
        <motion.span
          key={id}
          className="absolute inset-y-0 left-0 w-full origin-left bg-ocean-500"
          style={{ borderRadius: u(2.4) }}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: [1, 1, 0] }}
          transition={{ scaleX: { delay: 0.06, duration: LIVE_AT - 0.2, ease: stepped(8) }, opacity: { delay: LIVE_AT - 0.1, duration: 0.1, times: [0, 0.5, 1] } }}
        />
      )}

      <motion.span
        className="absolute inset-0 flex items-center justify-center font-medium text-white"
        style={{ fontSize: u(4.4), gap: u(2) }}
        initial={false}
        animate={{ opacity: step === 2 ? 1 : 0, y: step === 2 ? "0%" : step < 2 ? "60%" : "0%" }}
        transition={at(cue, { 2: { ...spring.ui, delay: snap + 0.12 }, 3: { delay: LIVE_AT - 0.06, duration: 0 } }, undo(cue, 2, 0.06, 0.12))}
      >
        <Spinner spinning={spinning} />
        {labels.build}
      </motion.span>

      <motion.span
        className="absolute inset-0 flex items-center justify-center font-semibold text-ocean-950"
        style={{ fontSize: u(4.6), gap: u(2) }}
        initial={false}
        animate={{ opacity: step === 3 ? 1 : 0 }}
        transition={at(cue, { 3: { delay: LIVE_AT - 0.06, duration: 0 } }, undo(cue, 3, 0, 0))}
      >
        <svg viewBox="0 0 8 6" shapeRendering="crispEdges" style={{ width: u(5), height: u(3.75) }} aria-hidden="true">
          {CHECK_PIXELS.map(({ x, y }) => (
            <motion.rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1.02}
              height={1.02}
              fill="#03045e"
              initial={false}
              animate={{ opacity: step === 3 ? 1 : 0 }}
              transition={arriving(cue, 3) ? { delay: LIVE_AT + 0.1 + x * 0.045, duration: 0 } : { duration: 0 }}
            />
          ))}
        </svg>
        {labels.live}
      </motion.span>
    </>
  );
}

// Four pixels; the bright one runs round while the build is busy.
function Spinner({ spinning }: { spinning: boolean }) {
  const cells = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  return (
    <span className="relative inline-block shrink-0" style={{ width: u(3), height: u(3) }}>
      {cells.map(([x, y], index) => (
        <motion.span
          key={index}
          className="absolute bg-white"
          style={{ left: u(x * 1.6), top: u(y * 1.6), width: u(1.4), height: u(1.4) }}
          animate={spinning ? { opacity: [1, 0.3, 0.3, 0.3] } : { opacity: index === 0 ? 1 : 0.3 }}
          transition={spinning ? { duration: 0.6, repeat: Infinity, delay: index * 0.15, ease: stepped(4) } : { duration: 0 }}
        />
      ))}
    </span>
  );
}

// Live: the detail of a row unfolds right below it, over the rows beneath. It shows the
// row's item larger: its icon, two lines of text, who is on it and how far it has come.
const DETAIL_LINES = [
  { y: 3.6, w: 34, tone: "bg-fg/70" },
  { y: 7.4, w: 22, tone: "bg-fg/35" },
];

function RowDetail({ row }: { row: number }) {
  const spec = BLOCKS[row + 2];
  const { icon } = ROWS[row];
  return (
    <motion.div
      className="absolute origin-top border-solid border-ocean-300 bg-raised"
      style={{
        left: u(spec.x + 1.5),
        top: u(spec.y + spec.h + 1.4),
        width: u(spec.w - 3),
        height: u(17),
        borderWidth: u(0.5),
        borderRadius: u(2.4),
        boxShadow: `${u(1.2)} ${u(1.2)} 0 #03045e`,
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.12, ease: stepped(2) } }}
      transition={{ scaleY: spring.ui, opacity: { duration: 0.08 } }}
      onClick={(event) => event.stopPropagation()}
    >
      <motion.span
        className="absolute"
        style={{ left: u(3), top: u(3), width: u(7), height: u(7), backgroundColor: icon }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...spring.playful, delay: 0.06 }}
      />
      {DETAIL_LINES.map(({ y, w, tone }, index) => (
        <motion.span
          key={index}
          className={`absolute origin-left ${tone}`}
          style={{ left: u(13), top: u(y), width: u(w), height: u(2) }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.08 + index * 0.06, duration: 0.18, ease: stepped(3) }}
        />
      ))}
      <span className="absolute block bg-ocean-950" style={{ right: u(3), top: u(3), width: u(7), height: u(7), outline: `${u(0.5)} solid #0077b6` }}>
        <PixelUser look={row + 1} className="block size-full" />
      </span>
      <span className="absolute bg-line-strong" style={{ left: u(3), right: u(3), top: u(12.6), height: u(1.6) }}>
        <motion.span
          className="absolute inset-y-0 left-0 w-full origin-left"
          style={{ backgroundColor: icon }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0.35, 0.6, 0.85][row] }}
          transition={{ delay: 0.14, duration: 0.36, ease: stepped(6) }}
        />
      </span>
    </motion.div>
  );
}

// The robot's beam: pixels flow from its raised hand into the block, sparks fly where it hits.
const SPARKS = [
  { x: 2.2, y: -2.6, at: 0 },
  { x: 2.8, y: 2.2, at: 0.09 },
  { x: 1.2, y: -3.4, at: 0.17 },
  { x: 3.2, y: 0.4, at: 0.25 },
];

function Beam({ on }: { on: boolean }) {
  const length = ROBOT.x - BEAM_TO + 1.6;
  return (
    <AnimatePresence>
      {on && (
        <motion.svg
          viewBox={`0 0 ${length} 1.6`}
          className="pointer-events-none absolute overflow-visible"
          style={{ left: u(BEAM_TO - ROBOT.x), top: u(ROBOT.hand - 0.8), width: u(length), height: u(1.6), originX: 1 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0, transition: { duration: 0.08, ease: stepped(2) } }}
          transition={{ duration: 0.1, ease: stepped(3) }}
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          <rect x={0} y={0} width={length} height={1.6} fill="#0096c7" />
          <motion.line
            x1={0}
            y1={0.8}
            x2={length}
            y2={0.8}
            stroke="#caf0f8"
            strokeWidth={1.6}
            strokeDasharray="1.2 1.2"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 2.4 }}
            transition={{ duration: 0.18, repeat: Infinity, ease: stepped(2) }}
          />
          {SPARKS.map((spark, index) => (
            <motion.rect
              key={index}
              x={-0.5}
              y={0.3}
              width={1}
              height={1}
              fill={index % 2 ? "#ffb703" : "#ffffff"}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: [0, spark.x], y: [0, spark.y], opacity: [1, 1, 0] }}
              transition={{ duration: 0.34, delay: spark.at, repeat: Infinity, repeatDelay: 0.04, ease: "easeOut" }}
            />
          ))}
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

// Live: one short message pops up from the spot where the button was pressed.
function Note({ x, text }: { x: number; text: string }) {
  return (
    <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-full" style={{ left: u(x), top: u(BUTTON.y - 1.6) }}>
      <motion.div
        className="relative flex origin-bottom items-center whitespace-nowrap bg-ocean-100 font-semibold text-ocean-950"
        style={{ fontSize: u(4.2), gap: u(1.6), padding: `${u(1.4)} ${u(2.4)} ${u(1.4)} ${u(1.6)}`, borderRadius: u(1.6) }}
        initial={{ opacity: 0, y: "40%", scale: 0.6 }}
        animate={{ opacity: 1, y: "0%", scale: 1 }}
        exit={{ opacity: 0, y: "-30%", transition: { duration: 0.16, ease: "easeIn" } }}
        transition={spring.playful}
      >
        <span className="block bg-ocean-950" style={{ width: u(5), height: u(5) }}>
          <PixelUser look={2} className="block size-full" />
        </span>
        {text}
        {/* A stepped pixel tail points down at the spot. */}
        <span className="absolute left-1/2 top-full -translate-x-1/2 bg-ocean-100" style={{ width: u(2.4), height: u(1.2) }} />
        <span className="absolute left-1/2 -translate-x-1/2 bg-ocean-100" style={{ top: `calc(100% + ${u(1.2)})`, width: u(1.2), height: u(1.2) }} />
      </motion.div>
    </div>
  );
}
