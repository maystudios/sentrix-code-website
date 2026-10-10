import { animate } from "motion/react";
import { ease, spring } from "@/lib/motion";

// The strings behind the statement chips. Geometry is measured by the component; this
// class owns everything that moves: plucking, the damped vibration, chip lift and drag,
// light pulses and node blinks. It runs one requestAnimationFrame loop, only while
// something is actually moving and only while the section is on screen.

export type Rect = { left: number; top: number; right: number; bottom: number };

// Routed connectors of the idea-to-release path.
// "run": the string leaves A, bends onto a straight stretch from A + r1 to B + r2 and bends
// into B. ha and hb are the horizontal handles of the bend at A (out of A, into the stretch)
// and at B (out of the stretch, into B).
// "s": one smooth curve from A to B with horizontal handles of length k.
export type Route =
  | { kind: "run"; r1: [number, number]; r2: [number, number]; ha: [number, number]; hb: [number, number] }
  | { kind: "s"; k: number };

// A string runs from end A to end B in section pixels. An end on a chip node names the
// chip (and its left or right node); an end on the section edge has chip −1.
// Tone: "path" is a step from idea to release, "muted" touches a muted chip or only edges.
export type StringSpec = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  aChip: number;
  aSide: 0 | 1;
  bChip: number;
  bSide: 0 | 1;
  tone: "path" | "plain" | "muted";
  route?: Route;
  // Approximate drawn length in pixels.
  length: number;
};

export type Geometry = { width: number; height: number; chips: Rect[]; strings: StringSpec[] };

export type StringElements = {
  paths: (SVGPathElement | null)[];
  pulses: (SVGPathElement | null)[];
  lifts: (HTMLElement | null)[];
  // Index chip * 2 + side.
  blinks: (HTMLElement | null)[];
};

// A light running along a string. On arrival it blinks the node it reaches; with hops
// left it carries on along the strings on the far side of that chip. A light on the
// path (next ≥ 0) carries on along the next step of the path instead.
type Pulse = {
  start: number;
  duration: number;
  fromB: boolean;
  dash: number;
  blink: number;
  hops: number;
  strength: number;
  next: number;
};

type State = {
  t: number;
  d: number;
  v: number;
  target: number;
  grabbed: boolean;
  sign: number;
  omega: number;
  zeta: number;
  maxPull: number;
  pulse: Pulse | null;
  drawn: string;
};

type Spring = { stiffness: number; damping: number };

// Where a chip sits relative to its slot, and where it wants to go.
type ChipMotion = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hover: boolean;
  drag: { x: number; y: number } | null;
  give: { x: number; y: number };
  spring: Spring;
  transform: string;
};

const HOVER_LIFT = -3;
const SUBSTEP = 1 / 240;
// A dragged chip stays close to the pointer, ...
const FOLLOW: Spring = { stiffness: 1100, damping: 66 };
// ... returns on a lively, damped spring when let go, ...
const RETURN: Spring = { stiffness: spring.playful.stiffness, damping: spring.playful.damping };
// ... and lifts or gives way on the UI spring.
const SETTLE: Spring = { stiffness: spring.ui.stiffness, damping: spring.ui.damping };
// How far a chip can be pulled out of its slot; the pull fades out towards this.
const REACH = 60;
// How much a neighbour follows a dragged chip.
const GIVE = 0.14;
// The light that walks the path from idea to release.
const PATH_SPEED = 680;

const f = (value: number) => Math.round(value * 10) / 10;

// A straight stretch bent by d pixels at position t (0…1) along it, continuing from the
// current point (ax, ay). Two quadratic halves meet at the bend with a tangent parallel to
// the stretch, so the curve passes exactly under the pointer and stays smooth while it
// vibrates.
function bend(ax: number, ay: number, bx: number, by: number, t: number, d: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const px = ax + dx * t + nx * d;
  const py = ay + dy * t + ny * d;
  const c1x = ax + dx * t * 0.55 + nx * d;
  const c1y = ay + dy * t * 0.55 + ny * d;
  const c2x = ax + dx * (t + (1 - t) * 0.45) + nx * d;
  const c2y = ay + dy * (t + (1 - t) * 0.45) + ny * d;
  return `Q${f(c1x)} ${f(c1y)} ${f(px)} ${f(py)}Q${f(c2x)} ${f(c2y)} ${f(bx)} ${f(by)}`;
}

// The stretch of a string that bends and can be plucked, for the given ends.
function stretch(spec: StringSpec, ax: number, ay: number, bx: number, by: number): [number, number, number, number] {
  const route = spec.route;
  if (route?.kind !== "run") return [ax, ay, bx, by];
  return [ax + route.r1[0], ay + route.r1[1], bx + route.r2[0], by + route.r2[1]];
}

function shape(spec: StringSpec, ax: number, ay: number, bx: number, by: number, t: number, d: number) {
  const route = spec.route;
  const start = `M${f(ax)} ${f(ay)}`;
  if (!route) return start + bend(ax, ay, bx, by, t, d);
  if (route.kind === "s") {
    // Both handles move sideways, which bends the middle of the curve by d.
    const length = Math.hypot(bx - ax, by - ay) || 1;
    const nx = (-(by - ay) / length) * d * (4 / 3);
    const ny = ((bx - ax) / length) * d * (4 / 3);
    return `${start}C${f(ax + route.k + nx)} ${f(ay + ny)} ${f(bx - route.k + nx)} ${f(by + ny)} ${f(bx)} ${f(by)}`;
  }
  const [x1, y1, x2, y2] = stretch(spec, ax, ay, bx, by);
  return (
    `${start}C${f(ax + route.ha[0])} ${f(ay)} ${f(x1 + route.ha[1])} ${f(y1)} ${f(x1)} ${f(y1)}` +
    bend(x1, y1, x2, y2, t, d) +
    `C${f(x2 + route.hb[0])} ${f(y2)} ${f(bx + route.hb[1])} ${f(by)} ${f(bx)} ${f(by)}`
  );
}

export function restPath(spec: StringSpec) {
  return shape(spec, spec.ax, spec.ay, spec.bx, spec.by, 0.5, 0);
}

export class StringField {
  private geo: Geometry | null = null;
  private state: State[] = [];
  private byChip: number[][] = [];
  private neighbours: number[][] = [];
  // String indices of the path from idea to release, in order.
  private path: number[] = [];
  private chips: ChipMotion[] = [];
  private dragged = -1;
  private raf = 0;
  private last = 0;
  private visible = false;
  private prev: { x: number; y: number } | null = null;
  private ambientOn = false;
  private ambientTimer = 0;

  constructor(private readonly els: StringElements) {}

  setGeometry(geo: Geometry | null) {
    // Running pulses belong to the old strings: drop them together with their light.
    this.hidePulses();
    this.geo = geo;
    this.prev = null;
    if (!geo) {
      this.state = [];
      this.path = [];
      return;
    }
    this.byChip = geo.chips.map(() => []);
    this.neighbours = geo.chips.map(() => []);
    this.state = geo.strings.map((spec, index) => {
      if (spec.aChip >= 0) this.byChip[spec.aChip].push(index);
      if (spec.bChip >= 0) this.byChip[spec.bChip].push(index);
      if (spec.aChip >= 0 && spec.bChip >= 0) {
        if (!this.neighbours[spec.aChip].includes(spec.bChip)) this.neighbours[spec.aChip].push(spec.bChip);
        if (!this.neighbours[spec.bChip].includes(spec.aChip)) this.neighbours[spec.bChip].push(spec.aChip);
      }
      // Longer strings ring lower and longer, like on an instrument.
      const length = Math.max(spec.length, 1);
      const hertz = Math.min(11, Math.max(4.2, 7 * Math.sqrt(320 / length)));
      return {
        t: 0.5,
        d: 0,
        v: 0,
        target: 0,
        grabbed: false,
        sign: 1,
        omega: hertz * Math.PI * 2,
        zeta: length < 120 ? 0.16 : 0.075,
        maxPull: Math.min(24, Math.max(6, length * 0.09)),
        pulse: null,
        drawn: "",
      };
    });
    this.path = geo.strings
      .map((spec, index) => ({ spec, index }))
      .filter(({ spec }) => spec.tone === "path")
      .sort((a, b) => a.spec.aChip - b.spec.aChip)
      .map(({ index }) => index);
    while (this.chips.length < geo.chips.length) {
      this.chips.push({ x: 0, y: 0, vx: 0, vy: 0, hover: false, drag: null, give: { x: 0, y: 0 }, spring: SETTLE, transform: "" });
    }
    // Draw every string once from the new state, so nothing keeps an old bend and the
    // strings of a chip that is lifted or held right now follow it at once.
    geo.strings.forEach((_, index) => this.write(index));
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!visible) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      window.clearTimeout(this.ambientTimer);
      return;
    }
    if (this.ambientOn) this.scheduleAmbient(1400);
    this.kick();
  }

  // Pointer position in section pixels. A string is caught when the pointer crosses it,
  // follows the pointer until it is pulled too far, then twangs back.
  pointer(x: number, y: number) {
    const geo = this.geo;
    if (!geo || !this.visible || this.dragged >= 0) return;
    const prev = this.prev ?? { x, y };
    this.prev = { x, y };
    let wake = false;
    geo.strings.forEach((spec, index) => {
      const s = this.state[index];
      const [ax, ay, bx, by] = stretch(spec, ...this.ends(spec));
      const dx = bx - ax;
      const dy = by - ay;
      const length = Math.hypot(dx, dy) || 1;
      const ux = dx / length;
      const uy = dy / length;
      const side = ux * (y - ay) - uy * (x - ax);
      const t = ((x - ax) * ux + (y - ay) * uy) / length;
      if (s.grabbed) {
        if (t < 0.02 || t > 0.98 || Math.sign(side) !== s.sign || Math.abs(side) > s.maxPull) {
          s.grabbed = false;
        } else {
          s.target = side;
          s.t = t;
        }
        wake = true;
        return;
      }
      if (length < 24) return;
      const prevSide = ux * (prev.y - ay) - uy * (prev.x - ax);
      if (prevSide === 0 || side === 0 || prevSide < 0 === side < 0) return;
      // Where along the string did the pointer cross it?
      const k = prevSide / (prevSide - side);
      const ix = prev.x + (x - prev.x) * k;
      const iy = prev.y + (y - prev.y) * k;
      const ti = ((ix - ax) * ux + (iy - ay) * uy) / length;
      if (ti < 0.03 || ti > 0.97 || this.insideChip(ix, iy)) return;
      s.t = ti;
      s.sign = side < 0 ? -1 : 1;
      if (Math.abs(side) >= s.maxPull) {
        // A fast swipe snaps the string straight away.
        s.d = s.sign * s.maxPull * 0.75;
        s.v = 0;
      } else {
        s.grabbed = true;
        s.target = side;
      }
      wake = true;
    });
    if (wake) this.kick();
  }

  pointerLeave() {
    this.prev = null;
    this.state.forEach((s) => (s.grabbed = false));
    this.kick();
  }

  // Hover and keyboard focus: the chip lifts, its strings tremble once and a light runs
  // out to the edges.
  hover(chip: number, on: boolean) {
    const motion = this.chips[chip];
    if (!motion || motion.hover === on) return;
    motion.hover = on;
    if (on) this.excite(chip, 70, true);
    this.kick();
  }

  // Press (pointer, Enter or Space): the chip's strings twang hard and send a light outwards.
  press(chip: number) {
    this.excite(chip, 230, true);
    this.kick();
  }

  // Dragging: the chip follows the pointer offset (dx, dy) on a short, soft leash; its
  // strings stretch with it and its neighbours give a little.
  dragStart(chip: number) {
    const motion = this.chips[chip];
    if (!motion) return;
    this.dragged = chip;
    this.prev = null;
    this.state.forEach((s) => (s.grabbed = false));
    motion.spring = FOLLOW;
    motion.drag = { x: motion.x, y: motion.y };
  }

  drag(chip: number, dx: number, dy: number) {
    const motion = this.chips[chip];
    if (!motion || this.dragged !== chip) return;
    const length = Math.hypot(dx, dy);
    const scale = length > 0 ? (REACH * Math.tanh(length / REACH)) / length : 0;
    motion.drag = { x: dx * scale, y: dy * scale };
    this.neighbours[chip]?.forEach((other) => {
      const neighbour = this.chips[other];
      if (!neighbour || neighbour.drag) return;
      neighbour.spring = SETTLE;
      neighbour.give = { x: dx * scale * GIVE, y: dy * scale * GIVE };
    });
    this.kick();
  }

  // Let go: the chip springs back and its strings ring as if plucked.
  dragEnd(chip: number) {
    const motion = this.chips[chip];
    if (!motion || this.dragged !== chip) return;
    this.dragged = -1;
    const pulled = Math.hypot(motion.x, motion.y);
    motion.drag = null;
    motion.spring = RETURN;
    this.neighbours[chip]?.forEach((other) => {
      const neighbour = this.chips[other];
      if (neighbour) neighbour.give = { x: 0, y: 0 };
    });
    this.excite(chip, Math.min(300, 80 + pulled * 3.5), false);
    this.kick();
  }

  startAmbient() {
    if (this.ambientOn) return;
    this.ambientOn = true;
    if (this.visible) this.scheduleAmbient(600);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.ambientTimer);
    this.raf = 0;
    this.ambientOn = false;
    this.hidePulses();
    this.els.lifts.forEach((el) => el && (el.style.transform = ""));
  }

  private hidePulses() {
    this.state.forEach((s) => (s.pulse = null));
    this.els.pulses.forEach((el) => {
      if (el) el.style.opacity = "0";
    });
  }

  private excite(chip: number, impulse: number, light: boolean) {
    const geo = this.geo;
    if (!geo || !this.byChip[chip]) return;
    this.byChip[chip].forEach((index, order) => {
      const spec = geo.strings[index];
      const s = this.state[index];
      const atB = spec.bChip === chip;
      if (!s.grabbed) {
        s.t = atB ? 0.82 : 0.18;
        s.v += (order % 2 === 0 ? 1 : -1) * impulse;
      }
    });
    if (light) this.sendOut(chip, -1, performance.now(), 2, 1);
  }

  // Light leaves a chip along every string on the given side (−1: both sides), always
  // running away from the chip.
  private sendOut(chip: number, side: number, start: number, hops: number, strength: number) {
    const geo = this.geo;
    if (!geo || !this.byChip[chip]) return;
    this.byChip[chip].forEach((index, order) => {
      const spec = geo.strings[index];
      const atB = spec.bChip === chip;
      if (side >= 0 && (atB ? spec.bSide : spec.aSide) !== side) return;
      const farChip = atB ? spec.aChip : spec.bChip;
      const farSide = atB ? spec.aSide : spec.bSide;
      this.startPulse(index, atB, start + order * 25, farChip >= 0 ? farChip * 2 + farSide : -1, 1500, farChip >= 0 ? hops : 0, strength);
    });
  }

  private startPulse(index: number, fromB: boolean, start: number, blink: number, speed: number, hops = 0, strength = 1, next = -1) {
    const spec = this.geo?.strings[index];
    if (!spec) return;
    const length = Math.max(spec.length, 1);
    const onPath = next !== -1;
    const pulse: Pulse = {
      start,
      duration: onPath ? Math.min(1400, Math.max(240, (length / speed) * 1000)) : Math.min(1700, Math.max(260, (length / speed) * 1000)),
      fromB,
      dash: Math.min(0.45, Math.max(onPath ? 0.03 : 0.035, (onPath ? 56 : 64) / length)),
      blink,
      hops,
      strength,
      next,
    };
    this.state[index].pulse = pulse;
    this.els.pulses[index]?.setAttribute("stroke-dasharray", `${pulse.dash} 3`);
  }

  private scheduleAmbient(delay: number) {
    window.clearTimeout(this.ambientTimer);
    this.ambientTimer = window.setTimeout(() => {
      if (this.visible && !document.hidden) this.ambient();
      this.scheduleAmbient(8500 + Math.random() * 3500);
    }, delay);
  }

  // Now and then a light walks the path from idea to release, step by step: it sparks on
  // the first chip, runs each connector and blinks every node it reaches on the way.
  private ambient() {
    const geo = this.geo;
    if (!geo || !this.path.length || this.dragged >= 0) return;
    if (this.path.some((index) => this.state[index]?.pulse)) return;
    const first = geo.strings[this.path[0]];
    this.blink(first.aChip * 2 + first.aSide);
    this.walk(0, performance.now() + 160);
    this.kick();
  }

  // Step `step` of the path. The step after the last one is −2, which ends the walk.
  private walk(step: number, start: number) {
    const index = this.path[step];
    const spec = this.geo?.strings[index];
    if (!spec) return;
    const next = step + 1 < this.path.length ? step + 1 : -2;
    this.startPulse(index, false, start, spec.bChip * 2 + spec.bSide, PATH_SPEED, 0, 1, next);
  }

  private blink(index: number) {
    const el = this.els.blinks[index];
    if (!el) return;
    animate(el, { opacity: [0, 1, 0], scale: [1, 2.2, 1] }, { duration: 0.7, ease: ease.outExpo });
  }

  private insideChip(x: number, y: number) {
    return !!this.geo?.chips.some((rect) => x > rect.left - 2 && x < rect.right + 2 && y > rect.top - 2 && y < rect.bottom + 2);
  }

  // Current ends of a string, including the offset of the chips it hangs on.
  private ends(spec: StringSpec): [number, number, number, number] {
    const a = spec.aChip >= 0 ? this.chips[spec.aChip] : undefined;
    const b = spec.bChip >= 0 ? this.chips[spec.bChip] : undefined;
    return [spec.ax + (a?.x ?? 0), spec.ay + (a?.y ?? 0), spec.bx + (b?.x ?? 0), spec.by + (b?.y ?? 0)];
  }

  private write(index: number) {
    const spec = this.geo?.strings[index];
    const s = this.state[index];
    if (!spec || !s) return;
    const d = shape(spec, ...this.ends(spec), s.t, s.d);
    if (d === s.drawn) return;
    s.drawn = d;
    this.els.paths[index]?.setAttribute("d", d);
    this.els.pulses[index]?.setAttribute("d", d);
  }

  private kick() {
    if (this.raf || !this.visible) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.step(now) && this.visible) this.raf = requestAnimationFrame(this.frame);
  };

  private step(now: number) {
    const geo = this.geo;
    if (!geo) return false;
    const dt = Math.min(0.034, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    let active = false;
    const dirty = new Set<number>();

    // Chips: lift, drag, give and return, each on its spring.
    this.chips.forEach((motion, chip) => {
      const tx = motion.drag ? motion.drag.x : motion.give.x;
      const ty = motion.drag ? motion.drag.y : motion.give.y + (motion.hover ? HOVER_LIFT : 0);
      if (motion.x === tx && motion.y === ty && motion.vx === 0 && motion.vy === 0) return;
      const { stiffness, damping } = motion.spring;
      for (let time = 0; time < dt; time += SUBSTEP) {
        const step = Math.min(SUBSTEP, dt - time);
        motion.vx += (stiffness * (tx - motion.x) - damping * motion.vx) * step;
        motion.vy += (stiffness * (ty - motion.y) - damping * motion.vy) * step;
        motion.x += motion.vx * step;
        motion.y += motion.vy * step;
      }
      if (Math.abs(tx - motion.x) < 0.02 && Math.abs(ty - motion.y) < 0.02 && Math.abs(motion.vx) < 0.05 && Math.abs(motion.vy) < 0.05) {
        motion.x = tx;
        motion.y = ty;
        motion.vx = 0;
        motion.vy = 0;
        if (!motion.drag) motion.spring = SETTLE;
      } else {
        active = true;
      }
      const transform = motion.x === 0 && motion.y === 0 ? "" : `translate3d(${motion.x.toFixed(2)}px, ${motion.y.toFixed(2)}px, 0)`;
      if (transform !== motion.transform) {
        motion.transform = transform;
        const el = this.els.lifts[chip];
        if (el) el.style.transform = transform;
      }
      this.byChip[chip]?.forEach((index) => dirty.add(index));
    });

    this.state.forEach((s, index) => {
      if (s.grabbed) {
        const before = s.d;
        s.d += (s.target - s.d) * (1 - Math.exp(-dt * 32));
        s.v = dt > 0 ? (s.d - before) / dt : 0;
        active = true;
        dirty.add(index);
      } else if (s.d !== 0 || s.v !== 0) {
        // Damped oscillation back to rest.
        const k = s.omega * s.omega;
        const c = 2 * s.zeta * s.omega;
        for (let time = 0; time < dt; time += SUBSTEP) {
          const step = Math.min(SUBSTEP, dt - time);
          s.v += (-k * s.d - c * s.v) * step;
          s.d += s.v * step;
        }
        if (Math.abs(s.d) < 0.04 && Math.abs(s.v) < 1) {
          s.d = 0;
          s.v = 0;
        } else {
          active = true;
        }
        dirty.add(index);
      }

      const pulse = s.pulse;
      if (!pulse) return;
      const el = this.els.pulses[index];
      const progress = (now - pulse.start) / pulse.duration;
      if (progress < 0) {
        active = true;
        return;
      }
      if (progress >= 1) {
        s.pulse = null;
        if (el) el.style.opacity = "0";
        if (pulse.blink >= 0) {
          this.blink(pulse.blink);
          if (pulse.next >= 0) {
            // On the path: cross the chip and walk on to the next step.
            this.walk(pulse.next, now + 90);
            active = true;
          } else if (pulse.hops > 0) {
            // Hop across the chip it reached and carry on out of its other node.
            this.sendOut(pulse.blink >> 1, 1 - (pulse.blink & 1), now + 40, pulse.hops - 1, pulse.strength * 0.8);
            active = true;
          }
        }
        return;
      }
      active = true;
      const onPath = pulse.next !== -1;
      // The light on the path glides in and out of every step; other lights shoot out.
      const eased = onPath ? 0.5 - 0.5 * Math.cos(Math.PI * progress) : 1 - Math.pow(1 - progress, 2);
      const head = pulse.fromB ? 1 - (1 + pulse.dash) * eased : -pulse.dash + (1 + pulse.dash) * eased;
      if (el) {
        el.style.strokeDashoffset = String(-head);
        el.style.opacity = String(pulse.strength * Math.min(1, progress / (onPath ? 0.08 : 0.12), (1 - progress) / (onPath ? 0.12 : 0.25)));
      }
    });

    dirty.forEach((index) => this.write(index));
    return active;
  }
}
