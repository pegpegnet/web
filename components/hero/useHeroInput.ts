'use client';

import { useEffect, useRef } from 'react';

export type HeroInput = {
  /** Pointer position over the window, -1..1 on each axis (y up). */
  px: number;
  py: number;
  /** Accumulated drag rotation in radians, and its release velocity. */
  dragX: number;
  dragY: number;
  dragging: boolean;
  velX: number;
  velY: number;
  /** Set to true by a press on the hero; the scene consumes it to squash the block. */
  poke: boolean;
  /** True once the visitor has dragged at least once (the hint can go). */
  explored: boolean;
};

/**
 * Pointer state for the hero, read every frame by the scene without React re-renders.
 * Dragging is horizontal-first on touch screens (touch-action: pan-y), so vertical swipes
 * still scroll the page.
 */
export function useHeroInput(targetId: string, onExplored?: () => void) {
  const input = useRef<HeroInput>({ px: 0, py: 0, dragX: 0, dragY: 0, dragging: false, velX: 0, velY: 0, poke: false, explored: false });

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const s = input.current;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let moved = 0;

    const onMove = (e: PointerEvent) => {
      s.px = (e.clientX / window.innerWidth) * 2 - 1;
      s.py = -((e.clientY / window.innerHeight) * 2 - 1);
      if (!s.dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(1, now - lastT) / 1000;
      s.dragX += dx * 0.008;
      s.dragY += dy * 0.006;
      s.velX = (dx * 0.008) / dt;
      s.velY = (dy * 0.006) / dt;
      moved += Math.abs(dx) + Math.abs(dy);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      if (moved > 30 && !s.explored) {
        s.explored = true;
        onExplored?.();
      }
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest('a, button')) return;
      s.dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
      s.velX = s.velY = 0;
      el.setPointerCapture?.(e.pointerId);
    };
    const onUp = () => {
      if (s.dragging && moved < 6) s.poke = true;
      s.dragging = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [targetId, onExplored]);

  return input;
}
