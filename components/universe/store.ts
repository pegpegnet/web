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
};

let state: UniverseState = { focus: null, hover: null, ready: false };
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
 * The system's clock. Orbits advance with `time`, which slows to a stop when a world is in focus
 * (so the camera can rest on it) and never moves when the visitor prefers reduced motion.
 */
export const clock = { time: 0, scale: 1 };
