'use client';

import { useSyncExternalStore } from 'react';

/** The service in focus: from scroll position, or from hover/focus while a pointer is on the list. */
let scrolled = 0;
let pointed: number | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const services = {
  setScrolled(i: number) {
    if (i !== scrolled) {
      scrolled = i;
      emit();
    }
  },
  setPointed(i: number | null) {
    if (i !== pointed) {
      pointed = i;
      emit();
    }
  },
  get active() {
    return pointed ?? scrolled;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useActiveService = () => useSyncExternalStore(services.subscribe, () => services.active, () => 0);
