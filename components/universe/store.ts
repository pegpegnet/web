'use client';

import { useSyncExternalStore } from 'react';

/**
 * State shared by the page's interface and the 3D scene. They render with different React
 * renderers, so a module-level store (rather than context) is what both can read.
 */
export type UniverseState = {
  /** The world the camera is at, or null for the whole system */
  focus: string | null;
  /** The world under the pointer */
  hover: string | null;
  /** True once the scene has drawn its first frame */
  ready: boolean;
  /** Share of the worlds' surfaces baked so far, 0 to 1 */
  baked: number;
  /** The studio panel (the star) is open */
  studio: boolean;
  /** The index of every world is open */
  index: boolean;
};

let state: UniverseState = { focus: null, hover: null, ready: false, baked: 0, studio: false, index: false };
const listeners = new Set<() => void>();

export const universe = {
  get: () => state,
  set(patch: Partial<UniverseState>) {
    const next = { ...state, ...patch };
    if ((Object.keys(patch) as (keyof UniverseState)[]).every((k) => next[k] === state[k])) return;
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useUniverse<T>(select: (s: UniverseState) => T): T {
  return useSyncExternalStore(
    universe.subscribe,
    () => select(state),
    () => select(state),
  );
}

/**
 * The system's clocks. Orbits advance with `time` at `scale`, which slows to a stop when a world
 * is in focus so the camera can rest on it. `spin` drives everything else that moves on its own
 * (days, clouds, moons). Both are zero when the visitor prefers reduced motion.
 */
export const clock = { time: 0, scale: 1, spin: 1 };
