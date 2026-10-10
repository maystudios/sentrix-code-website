import { animate } from "motion/react";
import { ease } from "@/lib/motion";

// The strings behind the statement chips. Geometry is measured by the component; this
// class owns everything that moves: plucking, the damped vibration, chip lift, light
// pulses and node blinks. It runs one requestAnimationFrame loop, only while something
// is actually moving and only while the section is on screen.

export type Rect = { left: number; top: number; right: number; bottom: number };

// A string runs from end A to end B in section pixels. An end on a chip node names the
// chip (and its left or right node); an end on the section edge has chip −1.
export type StringSpec = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  aChip: number;
  aSide: 0 | 1;
  bChip: number;
  bSide: 0 | 1;
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
// left it carries on along the strings on the far side of that chip.
type Pulse = { start: number; duration: number; fromB: boolean; dash: number; blink: number; hops: number; strength: number };

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
};

const HOVER_LIFT = -3;
const SUBSTEP = 1 / 240;

// A string bent by d pixels at position t (0…1) along it. Two quadratic halves meet at
// the bend with a tangent parallel to the string, so the curve passes exactly under the
// pointer and stays smooth while it vibrates.
function bentPath(ax: number, ay: number, bx: number, by: number, t: number, d: number) {
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
  const f = (value: number) => Math.round(value * 10) / 10;
  return `M${f(ax)} ${f(ay)}Q${f(c1x)} ${f(c1y)} ${f(px)} ${f(py)}Q${f(c2x)} ${f(c2y)} ${f(bx)} ${f(by)}`;
}

export function restPath(spec: StringSpec) {
  return bentPath(spec.ax, spec.ay, spec.bx, spec.by, 0.5, 0);
}

export class StringField {
  private geo: Geometry | null = null;
  private state: State[] = [];
  private byChip: number[][] = [];
  private lift: { y: number; v: number; target: number }[] = [];
  private raf = 0;
  private last = 0;
  private visible = false;
  private prev: { x: number; y: number } | null = null;
  private ambientOn = false;
  private ambientTimer = 0;

  constructor(private readonly els: StringElements) {}

  setGeometry(geo: Geometry | null) {
    this.geo = geo;
    this.prev = null;
    if (!geo) return;
    this.byChip = geo.chips.map(() => []);
    this.state = geo.strings.map((spec, index) => {
      if (spec.aChip >= 0) this.byChip[spec.aChip].push(index);
      if (spec.bChip >= 0) this.byChip[spec.bChip].push(index);
      const length = Math.hypot(spec.bx - spec.ax, spec.by - spec.ay);
      // Longer strings ring lower and longer, like on an instrument.
      const hertz = Math.min(11, Math.max(4.2, 7 * Math.sqrt(320 / Math.max(length, 1))));
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
      };
    });
    while (this.lift.length < geo.chips.length) this.lift.push({ y: 0, v: 0, target: 0 });
    // Strings of a chip that is lifted right now must follow it at once.
    this.lift.forEach((lift, chip) => {
      if (lift.y !== 0 && this.byChip[chip]) this.byChip[chip].forEach((index) => this.write(index));
    });
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
    if (!geo || !this.visible) return;
    const prev = this.prev ?? { x, y };
    this.prev = { x, y };
    let wake = false;
    geo.strings.forEach((spec, index) => {
      const s = this.state[index];
      const [ax, ay, bx, by] = this.ends(spec);
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

  // Hover: the chip lifts, its strings tremble once and a light runs out to the edges.
  hover(chip: number, on: boolean) {
    if (!this.lift[chip]) return;
    this.lift[chip].target = on ? HOVER_LIFT : 0;
    if (on) this.excite(chip, 70);
    this.kick();
  }

  // Press: the chip's strings twang hard and send a light outwards.
  press(chip: number) {
    this.excite(chip, 230);
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
  }

  private excite(chip: number, impulse: number) {
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
    this.sendOut(chip, -1, performance.now(), 2, 1);
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

  private startPulse(index: number, fromB: boolean, start: number, blink: number, speed: number, hops = 0, strength = 1) {
    const spec = this.geo?.strings[index];
    if (!spec) return;
    const length = Math.hypot(spec.bx - spec.ax, spec.by - spec.ay) || 1;
    this.state[index].pulse = {
      start,
      duration: Math.min(1700, Math.max(260, (length / speed) * 1000)),
      fromB,
      dash: Math.min(0.45, Math.max(0.035, 64 / length)),
      blink,
      hops,
      strength,
    };
    const el = this.els.pulses[index];
    el?.setAttribute("stroke-dasharray", `${this.state[index].pulse!.dash} 3`);
  }

  private scheduleAmbient(delay: number) {
    window.clearTimeout(this.ambientTimer);
    this.ambientTimer = window.setTimeout(() => {
      if (this.visible && !document.hidden) this.ambient();
      this.scheduleAmbient(2600 + Math.random() * 2800);
    }, delay);
  }

  // A small light travels along one random edge string into its chip; the node blinks.
  private ambient() {
    const geo = this.geo;
    if (!geo) return;
    const candidates = geo.strings
      .map((spec, index) => ({ spec, index }))
      .filter(({ spec, index }) => spec.aChip < 0 && !this.state[index].pulse);
    if (!candidates.length) return;
    const { spec, index } = candidates[Math.floor(Math.random() * candidates.length)];
    this.startPulse(index, false, performance.now(), spec.bChip * 2 + spec.bSide, 820);
    this.kick();
  }

  private blink(index: number) {
    const el = this.els.blinks[index];
    if (!el) return;
    animate(el, { opacity: [0, 1, 0], scale: [1, 2.2, 1] }, { duration: 0.7, ease: ease.outExpo });
  }

  private insideChip(x: number, y: number) {
    return !!this.geo?.chips.some((rect) => x > rect.left - 2 && x < rect.right + 2 && y > rect.top - 2 && y < rect.bottom + 2);
  }

  // Current ends of a string, including the lift of the chips it hangs on.
  private ends(spec: StringSpec): [number, number, number, number] {
    const liftA = spec.aChip >= 0 ? (this.lift[spec.aChip]?.y ?? 0) : 0;
    const liftB = spec.bChip >= 0 ? (this.lift[spec.bChip]?.y ?? 0) : 0;
    return [spec.ax, spec.ay + liftA, spec.bx, spec.by + liftB];
  }

  private write(index: number) {
    const spec = this.geo?.strings[index];
    if (!spec) return;
    const s = this.state[index];
    const [ax, ay, bx, by] = this.ends(spec);
    const d = bentPath(ax, ay, bx, by, s.t, s.d);
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

    // Chip lift: spring-ui (stiffness 400, damping 30).
    this.lift.forEach((lift, chip) => {
      if (lift.y === lift.target && lift.v === 0) return;
      for (let time = 0; time < dt; time += SUBSTEP) {
        const step = Math.min(SUBSTEP, dt - time);
        lift.v += (400 * (lift.target - lift.y) - 30 * lift.v) * step;
        lift.y += lift.v * step;
      }
      if (Math.abs(lift.target - lift.y) < 0.02 && Math.abs(lift.v) < 0.05) {
        lift.y = lift.target;
        lift.v = 0;
      } else {
        active = true;
      }
      const el = this.els.lifts[chip];
      if (el) el.style.transform = lift.y === 0 ? "" : `translate3d(0, ${lift.y.toFixed(2)}px, 0)`;
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
          // Hop across the chip it reached and carry on out of its other node.
          if (pulse.hops > 0) this.sendOut(pulse.blink >> 1, 1 - (pulse.blink & 1), now + 40, pulse.hops - 1, pulse.strength * 0.8);
        }
        return;
      }
      active = true;
      const eased = 1 - Math.pow(1 - progress, 2);
      const head = pulse.fromB ? 1 - (1 + pulse.dash) * eased : -pulse.dash + (1 + pulse.dash) * eased;
      if (el) {
        el.style.strokeDashoffset = String(-head);
        el.style.opacity = String(pulse.strength * Math.min(1, progress / 0.12, (1 - progress) / 0.25));
      }
    });

    dirty.forEach((index) => this.write(index));
    return active;
  }
}
