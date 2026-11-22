'use client';

import { worlds } from '@/lib/universe';
import { universe } from './store';

const slugs = worlds.map((w) => w.slug);

/**
 * Go to a world (or back to the whole system with null). The address follows, so a world can be
 * shared and the browser's back button returns to the system: leaving the overview adds a history
 * entry, moving between worlds replaces it.
 */
export function focusWorld(slug: string | null) {
  const current = universe.get().focus;
  if (slug === current) return;
  universe.set({ focus: slug });
  const url = slug ? `#${slug}` : location.pathname + location.search;
  if (slug && !current) history.pushState({ world: slug }, '', url);
  else history.replaceState(slug ? { world: slug } : null, '', url);
}

/** The world `step` places along from the focused one, wrapping round; from the overview, the first or last. */
export function stepWorld(step: 1 | -1) {
  const current = universe.get().focus;
  const i = current ? slugs.indexOf(current) : step > 0 ? -1 : 0;
  focusWorld(slugs[(i + step + slugs.length) % slugs.length]!);
}

/** The world named in the address, if any. */
export function worldFromHash(): string | null {
  const slug = decodeURIComponent(location.hash.slice(1));
  return slugs.includes(slug) ? slug : null;
}
