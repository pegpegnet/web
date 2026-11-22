'use client';

import { openStudio } from './navigation';
import { universe, useUniverse } from './store';

/** The two interface buttons in the top bar: the index of every world, and the studio (the star). */
export function HudNav({ index, studio }: { index: string; studio: string }) {
  const studioOpen = useUniverse((s) => s.studio);
  const link = 'uppercase no-underline text-starlight/75 transition-colors hover:text-starlight aria-pressed:text-flare';
  return (
    <>
      <button type="button" className={link} onClick={() => universe.set({ index: true })} aria-haspopup="dialog">
        {index}
      </button>
      <button type="button" className={link} onClick={() => openStudio(!studioOpen)} aria-pressed={studioOpen}>
        {studio}
      </button>
    </>
  );
}
