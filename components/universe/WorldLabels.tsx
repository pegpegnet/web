'use client';

import { focusWorld } from './navigation';
import { labelElements } from './labels';
import { universe } from './store';

export type WorldName = { slug: string; name: string; number: number };

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A label for every world: its number and name beside it in space. They're buttons, so small or
 * distant worlds are as easy to pick as big ones, and the keyboard can reach every world.
 */
export function WorldLabels({ names, label }: { names: WorldName[]; label: string }) {
  return (
    <nav aria-label={label} className="pointer-events-none absolute inset-0 overflow-hidden">
      <ul>
        {names.map((w) => (
          <li key={w.slug}>
            <button
              type="button"
              ref={(el) => {
                if (el) labelElements.set(w.slug, el);
                else labelElements.delete(w.slug);
              }}
              onClick={() => focusWorld(w.slug)}
              onPointerEnter={() => universe.set({ hover: w.slug })}
              onPointerLeave={() => universe.set({ hover: null })}
              onFocus={() => universe.set({ hover: w.slug })}
              onBlur={() => universe.set({ hover: null })}
              style={{ opacity: 0, visibility: 'hidden' }}
              className="pointer-events-auto absolute top-0 left-0 flex items-center gap-2 py-2 pr-2 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-starlight uppercase transition-[color] will-change-transform [text-shadow:0_0_6px_rgb(2_3_8),0_0_14px_rgb(2_3_8/0.9)] hover:text-flare-soft focus-visible:outline-offset-0"
            >
              <span aria-hidden="true" className="h-px w-3 bg-current opacity-50" />
              <span aria-hidden="true" className="tabular-nums opacity-50">
                {pad(w.number)}
              </span>
              <span>{w.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
