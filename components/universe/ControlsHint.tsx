'use client';

import { useQuality } from '@/components/three/QualityProvider';
import { universe, useUniverse } from './store';

const label = 'font-mono text-[11px] uppercase tracking-[0.18em]';

/**
 * How to get around: drag and zoom with a mouse or a finger. Without the 3D (no WebGL, or lost)
 * there's nothing to drag, so it becomes the way into the list of worlds instead.
 */
export function ControlsHint({ hint, hintTouch, list }: { hint: string; hintTouch: string; list: string }) {
  const quality = useQuality();
  const lost = useUniverse((s) => s.lost);
  if ((quality && quality.tier === 'off') || lost) {
    return (
      <button
        type="button"
        onClick={() => universe.set({ index: true })}
        className={`${label} pointer-events-auto shrink-0 rounded-full border border-starlight/25 px-5 py-3 text-starlight transition-colors hover:bg-starlight/10`}
      >
        {list} →
      </button>
    );
  }
  return (
    <>
      <p className={`${label} hidden shrink-0 text-starlight/50 md:block pointer-coarse:hidden`}>{hint}</p>
      <p className={`${label} hidden shrink-0 text-starlight/50 pointer-coarse:md:block`}>{hintTouch}</p>
    </>
  );
}
