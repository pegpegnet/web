'use client';

import { useSyncExternalStore } from 'react';

/** Which dock app is active (hovered or focused), shared by the 3D dock, the window and the list. */
let active = 0;
let pointerX: number | null = null; // pointer across the dock, 0..1, while over it
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const dock = {
  setActive(i: number) {
    if (i !== active) {
      active = i;
      emit();
    }
  },
  get active() {
    return active;
  },
  setPointer(x: number | null) {
    pointerX = x;
  },
  get pointer() {
    return pointerX;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useActiveApp() {
  return useSyncExternalStore(dock.subscribe, () => dock.active, () => 0);
}
