/**
 * How much 3D this device should get.
 *
 *   off   no WebGL: every scene shows its static fallback
 *   low   phones, small or low-memory devices, data saver: lower resolution, fewer effects
 *   high  everything
 *
 * `still` is set when the visitor prefers reduced motion: scenes still render (they carry
 * content), but nothing moves on its own; they only respond to direct input.
 */
export type Tier = 'off' | 'low' | 'high';
export type Quality = { tier: Tier; still: boolean; dpr: [number, number] };

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function detectQuality(): Quality {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hasWebGL()) return { tier: 'off', still, dpr: [1, 1] };
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const small = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  const weak = (nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4;
  const saver = nav.connection?.saveData === true;
  const tier: Tier = small || weak || saver ? 'low' : 'high';
  return { tier, still, dpr: tier === 'high' ? [1, 2] : [1, 1.5] };
}
