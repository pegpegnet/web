/**
 * A damped spring, integrated per frame. Used wherever 3D objects should feel physical:
 * they overshoot a little, wobble and settle instead of easing to a stop.
 *
 *   stiffness  how hard it pulls toward the target
 *   damping    how quickly the wobble dies out (higher is calmer)
 */
export type Spring = { x: number; v: number };

export const spring = (x = 0): Spring => ({ x, v: 0 });

export function stepSpring(s: Spring, target: number, dt: number, stiffness = 120, damping = 14): number {
  // Sub-step long frames so a stutter never launches anything into space.
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const h = Math.min(dt, 0.1) / steps;
  for (let i = 0; i < steps; i++) {
    const a = stiffness * (target - s.x) - damping * s.v;
    s.v += a * h;
    s.x += s.v * h;
  }
  return s.x;
}
