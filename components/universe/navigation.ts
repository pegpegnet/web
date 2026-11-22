'use client';

import { worlds } from '@/lib/universe';
import { universe } from './store';

const slugs = worlds.map((w) => w.slug);

/** Addresses the previous site's home page used for its sections; they still arrive here. */
const STUDIO_HASHES = ['studio', 'services', 'about'];
const INDEX_HASHES = ['work', 'projects'];

/** Show `hash` in the address: leaving the overview adds a history entry, anything else replaces it. */
function address(hash: string | null) {
  const { focus, studio } = universe.get();
  const url = hash ? `#${hash}` : location.pathname + location.search;
  if (hash && !focus && !studio) history.pushState({ hash }, '', url);
  else history.replaceState(hash ? { hash } : null, '', url);
}

/**
 * Go to a world (or back to the whole system with null). The address follows, so a world can be
 * shared and the browser's back button returns to the system.
 */
export function focusWorld(slug: string | null) {
  if (slug === universe.get().focus && !universe.get().studio) return;
  address(slug);
  universe.set({ focus: slug, studio: false, index: false });
}

/** Open or close the studio: the star, and the panel about PegPeg. */
export function openStudio(open: boolean) {
  if (open === universe.get().studio) return;
  address(open ? 'studio' : null);
  universe.set({ studio: open, focus: null, index: false });
}

/** The world `step` places along from the focused one, wrapping round; from the overview, the first or last. */
export function stepWorld(step: 1 | -1) {
  const current = universe.get().focus;
  const i = current ? slugs.indexOf(current) : step > 0 ? -1 : 0;
  focusWorld(slugs[(i + step + slugs.length) % slugs.length]!);
}

/** What the address asks for: a world, the studio, the index, or the plain system. */
export function readAddress() {
  const hash = decodeURIComponent(location.hash.slice(1));
  return {
    focus: slugs.includes(hash) ? hash : null,
    studio: STUDIO_HASHES.includes(hash),
    index: INDEX_HASHES.includes(hash),
  };
}
