'use client';

import { focusWorld, stepWorld } from './navigation';
import { useUniverse } from './store';
import type { WorldName } from './WorldLabels';

export type FocusBarText = { previous: string; next: string; back: string; of: string };

const pad = (n: number) => String(n).padStart(2, '0');

/** While a world is in focus: its number and name, the worlds either side, and the way back. */
export function FocusBar({ names, t }: { names: WorldName[]; t: FocusBarText }) {
  const focus = useUniverse((s) => s.focus);
  const world = names.find((w) => w.slug === focus);
  const round = 'grid size-11 place-items-center rounded-full text-starlight/80 transition-colors hover:bg-starlight/10 hover:text-starlight';
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4 transition-[opacity,translate] duration-500 md:bottom-8 ${
        world ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
      aria-hidden={!world}
      inert={!world}
    >
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-1 rounded-full border border-starlight/12 bg-space/75 p-1.5 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] sm:w-auto sm:max-w-none">
        <button type="button" onClick={() => stepWorld(-1)} aria-label={t.previous} className={round}>
          <span aria-hidden="true">←</span>
        </button>
        <p className="min-w-0 flex-1 px-2 text-center sm:min-w-[11rem] sm:px-3" aria-live="polite">
          <span className="block font-mono text-[10px] tracking-[0.18em] text-starlight/50 uppercase">
            {world ? t.of.replace('{n}', pad(world.number)).replace('{total}', pad(names.length)) : ''}
          </span>
          <span className="block truncate font-serif text-[1.35rem] leading-tight">{world?.name ?? ''}</span>
        </p>
        <button type="button" onClick={() => stepWorld(1)} aria-label={t.next} className={round}>
          <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          onClick={() => focusWorld(null)}
          aria-label={t.back}
          className="ml-1 grid h-11 min-w-11 place-items-center rounded-full bg-starlight px-0 font-mono text-[10px] tracking-[0.16em] text-space uppercase transition-colors hover:bg-flare-soft sm:px-4"
        >
          <span aria-hidden="true" className="text-base sm:hidden">×</span>
          <span aria-hidden="true" className="max-sm:hidden">{t.back}</span>
        </button>
      </div>
    </div>
  );
}

/** Fades its contents out while a world is in focus (the headline steps aside for the world). */
export function HideOnFocus({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const focus = useUniverse((s) => s.focus);
  return (
    <div className={`transition-[opacity,translate] duration-700 ${focus ? 'pointer-events-none -translate-y-2 opacity-0' : 'opacity-100'} ${className}`}>
      {children}
    </div>
  );
}
