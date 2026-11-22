'use client';

import { useEffect, useRef } from 'react';
import { focusWorld } from './navigation';
import { universe, useUniverse } from './store';
import { label, type WorldInfo } from './Panels';

export type IndexText = { indexTitle: string; inner: string; outer: string; close: string };

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Every world in one list, nearest the star first: the quickest way to any of them. A native
 * dialog, so it traps focus and closes with Esc on its own.
 */
export function WorldIndex({ worlds, t }: { worlds: WorldInfo[]; t: IndexText }) {
  const open = useUniverse((s) => s.index);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const groups = [
    { title: t.inner, items: worlds.filter((w) => w.inner) },
    { title: t.outer, items: worlds.filter((w) => !w.inner) },
  ];

  return (
    <dialog
      ref={dialog}
      aria-labelledby="index-title"
      onClose={() => universe.set({ index: false })}
      onClick={(e) => {
        if (e.target === dialog.current) universe.set({ index: false });
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-starlight backdrop:bg-[rgb(2_3_8/0.6)] md:w-[min(44rem,100%)]"
    >
      <div className="h-full overflow-y-auto border-r border-starlight/10 bg-[rgb(4_5_11/0.96)] px-[var(--spacing-gutter)] py-6 md:px-10 md:py-8">
        <div className="flex items-center justify-between gap-6">
          <h2 id="index-title" className={`${label} text-starlight/55`}>
            {t.indexTitle}
          </h2>
          <button
            type="button"
            onClick={() => universe.set({ index: false })}
            aria-label={t.close}
            className="grid size-10 place-items-center rounded-full border border-starlight/15 text-starlight/80 transition-colors hover:bg-starlight/10"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {groups.map((g) => (
          <section key={g.title} className="mt-10">
            <h3 className={`${label} text-flare-soft/75`}>{g.title}</h3>
            <ol className="mt-3 border-t border-starlight/10">
              {g.items.map((w) => (
                <li key={w.slug} className="border-b border-starlight/10">
                  <button
                    type="button"
                    onClick={() => focusWorld(w.slug)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-3.5 text-left"
                  >
                    <span className={`${label} tabular-nums text-starlight/40`}>{pad(w.number)}</span>
                    <span className="font-serif text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] leading-tight transition-colors group-hover:text-flare-soft">
                      {w.name}
                    </span>
                    <span className={`${label} text-right text-starlight/45`}>
                      {w.type}
                      {w.year ? ` · ${w.year}` : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </dialog>
  );
}
