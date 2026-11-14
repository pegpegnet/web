'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
 * The full list of projects as an editorial index. Hovering a row floods it with that project's
 * colours and a preview of the work follows the cursor, tilting with its speed. Filters re-flow
 * the list with GSAP Flip and announce how many projects are shown.
 */
export function ProjectIndex({ items, filters, t }: Props) {
  const [filter, setFilter] = useState<Kind | 'all'>('all');
  const [hover, setHover] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
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
      duration: 0.7,
      ease: 'expo.out',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25 }),
    });
  }, [filter]);

  // The floating preview trails the cursor and leans into its movement.
  useEffect(() => {
    const el = preview.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const r = gsap.quickTo(el, 'rotate', { duration: 0.8, ease: 'power3.out' });
    let last = 0;
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      r(Math.max(-12, Math.min(12, (e.clientX - last) * 0.6)));
      last = e.clientX;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const active = hover !== null ? shown[hover] : null;

  return (
    <div>
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => choose(f.value)}
            className="rounded-full px-5 py-2.5 text-step--1 font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line)] transition-colors hover:shadow-[inset_0_0_0_1.5px_var(--color-char)] aria-pressed:bg-char aria-pressed:text-bone aria-pressed:shadow-none"
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {t.showing.replace('{n}', String(shown.length))}
      </p>

      <ul ref={list} className="mt-12 border-t border-line" onPointerLeave={() => setHover(null)}>
        {shown.map((p, i) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              href={p.href}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              style={{ '--row-bg': p.theme.bg, '--row-fg': p.theme.fg } as CSSProperties}
              className="group relative grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 overflow-hidden px-2 py-6 no-underline md:grid-cols-[minmax(0,1fr)_16rem_5rem] md:py-7"
            >
              {/* Colour wipe in the project's own colours */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[var(--row-bg)] transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              <span className="type-poster text-[clamp(2.2rem,1rem+4vw,5.4rem)] transition-[font-stretch,color] duration-500 ease-out-expo group-hover:text-[var(--row-fg)] group-hover:[font-stretch:78%]">
                {p.name}
              </span>
              <span className="text-step--1 text-graphite group-hover:text-[var(--row-fg)] max-md:col-span-2 max-md:row-start-2">
                {p.meta}
              </span>
              <span className="text-right text-step--1 tabular-nums text-graphite group-hover:text-[var(--row-fg)] max-md:col-start-2 max-md:row-start-1">
                {p.year ?? ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating preview: decorative, the link text carries the content */}
      <div ref={preview} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-500 ease-out-expo ${
            active?.cover ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          {shown.map((p, i) =>
            p.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.slug}
                src={p.cover.src}
                width={p.cover.width}
                height={p.cover.height}
                alt=""
                loading="lazy"
                className={`absolute top-0 left-0 h-[15rem] w-[20rem] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] object-cover shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] transition-opacity duration-300 ${
                  hover === i ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
