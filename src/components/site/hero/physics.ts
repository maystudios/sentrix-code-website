// Small, exact motion helpers for the hero's blocks. Falling uses real gravity; tipping
// over is a rotation about a pivot with angular acceleration that hands over to a
// ballistic flight (gravity plus spin) the moment the body leaves the edge. The paths are
// sampled into keyframes, so Motion plays them with linear easing between dense points.

export type Vec = { x: number; y: number };

// Gravity for the hero in CSS pixels per second² (screen y points down).
export const GRAVITY_PX = 3000;

// Quadratic ease-in: a body falling from rest covers distance ∝ t².
export const fallEase = (t: number) => t * t;

export function fallSeconds(distancePx: number, gravity = GRAVITY_PX) {
  return Math.sqrt((2 * Math.abs(distancePx)) / gravity);
}

export type TumblePlan = {
  // Rest centre of the body and the pivot it tips over, same frame, pixels, y down.
  centre: Vec;
  pivot: Vec;
  // Seconds before tipping starts.
  start: number;
  // Angular acceleration while on the pivot (rad/s², positive = clockwise on screen).
  alpha: number;
  // Angle (rad) at which the body leaves the pivot and flies.
  release: number;
  // Extra spin (rad/s) and extra velocity (px/s) once free, so pieces drift apart.
  spin?: number;
  kick?: Vec;
};

function rotate(v: Vec, angle: number): Vec {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

// Keyframes (offsets from the rest position, degrees) for a body that tips over its pivot
// and then falls freely.
export function tumble(plan: TumblePlan, duration: number, gravity = GRAVITY_PX, fps = 45) {
  const r = { x: plan.centre.x - plan.pivot.x, y: plan.centre.y - plan.pivot.y };
  const releaseTime = Math.sqrt((2 * plan.release) / plan.alpha);
  const omega = plan.alpha * releaseTime;
  const atRelease = rotate(r, plan.release);
  const free = {
    x: plan.pivot.x + atRelease.x,
    y: plan.pivot.y + atRelease.y,
  };
  // Velocity of the centre at release: ω × r (tangential), plus any kick.
  const velocity = {
    x: -omega * atRelease.y + (plan.kick?.x ?? 0),
    y: omega * atRelease.x + (plan.kick?.y ?? 0),
  };
  const spin = omega + (plan.spin ?? 0);
  const frames = Math.max(2, Math.ceil(duration * fps));
  const x: number[] = [];
  const y: number[] = [];
  const angle: number[] = [];
  const times: number[] = [];
  for (let index = 0; index <= frames; index++) {
    const t = (index / frames) * duration;
    const tau = t - plan.start;
    let centre = plan.centre;
    let theta = 0;
    if (tau > 0 && tau < releaseTime) {
      theta = 0.5 * plan.alpha * tau * tau;
      const turned = rotate(r, theta);
      centre = { x: plan.pivot.x + turned.x, y: plan.pivot.y + turned.y };
    } else if (tau >= releaseTime) {
      const s = tau - releaseTime;
      theta = plan.release + spin * s;
      centre = { x: free.x + velocity.x * s, y: free.y + velocity.y * s + 0.5 * gravity * s * s };
    }
    x.push(centre.x - plan.centre.x);
    y.push(centre.y - plan.centre.y);
    angle.push((theta * 180) / Math.PI);
    times.push(index / frames);
  }
  return { x, y, rotate: angle, times, duration };
}
