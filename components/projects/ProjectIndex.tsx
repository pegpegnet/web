'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { Flip } from 'gsap/Flip';
import type { Kind } from '@/content/projects';

gsap.registerPlugin(Flip);

export type IndexItem = {
  slug: string;
  href: string;
  name: string;
  summary: string;
  kinds: Kind[];
  meta: string;
  year?: number;
  cover: { src: string; width: number; height: number } | null;
  theme: { bg: string; fg: string };
};

type Props = {
  items: IndexItem[];
  filters: { value: Kind | 'all'; label: string }[];
  t: { filterLabel: string; showing: string };
};

/**
 * The full list of projects: a quiet row per project with a small cover in its own colour.
 * Filters re-flow the list with GSAP Flip and announce how many projects are shown.
 */
export function ProjectIndex({ items, filters, t }: Props) {
  const [filter, setFilter] = useState<Kind | 'all'>('all');
  const list = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const shown = items.filter((p) => filter === 'all' || p.kinds.includes(filter));

  const choose = (value: Kind | 'all') => {
    if (list.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      flipState.current = Flip.getState(list.current.querySelectorAll('li'));
    }
    setFilter(value);
  };

  // After React re-renders the filtered list, animate from the old layout to the new one.
  useEffect(() => {
    const state = flipState.current;
    if (!state || !list.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: list.current.querySelectorAll('li'),
      duration: 0.5,
      ease: 'power3.out',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.02 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25 }),
    });
  }, [filter]);

  return (
    <div>
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => choose(f.value)}
            className="h-9 rounded-full bg-chalk px-4 text-step--1 font-medium text-graphite transition-colors hover:text-char aria-pressed:bg-char aria-pressed:text-bone"
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {t.showing.replace('{n}', String(shown.length))}
      </p>

      <ul ref={list} className="mt-10 border-t border-line">
        {shown.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              href={p.href}
              className="group -mx-3 grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-5 rounded-2xl px-3 py-4 no-underline transition-colors hover:bg-chalk md:grid-cols-[7rem_minmax(0,1fr)_14rem_4rem] md:gap-x-8 md:py-5"
            >
              <span
                aria-hidden="true"
                className="block aspect-[4/3] overflow-hidden rounded-xl"
                style={{ background: p.theme.bg }}
              >
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.cover.src}
                    width={p.cover.width}
                    height={p.cover.height}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
                  />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="block text-step-2 font-semibold tracking-[-0.025em]">{p.name}</span>
                <span className="mt-1 block truncate text-step--1 text-graphite">{p.summary}</span>
              </span>
              <span className="text-step--1 text-graphite max-md:hidden">{p.meta}</span>
              <span className="text-right text-step--1 tabular-nums text-graphite">{p.year ?? ''}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
