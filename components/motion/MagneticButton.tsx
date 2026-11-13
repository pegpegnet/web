'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'outline';
  size?: 'md' | 'xl';
  /** 'dark' when the button sits on a dark background. */
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * A pill link that leans toward the pointer as it approaches and snaps back with a little
 * overshoot when it leaves. The label travels further than the pill, which gives it depth.
 * On hover a fill rises from the edge the pointer came in from.
 */
export function MagneticButton({ href, children, variant = 'solid', size = 'md', tone = 'light', className = '' }: Props) {
  const root = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const text = label.current;
    const blob = fill.current;
    if (!el || !text || !blob) return;
    const precise = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!precise || calm) return;
    el.classList.add('is-magnetic');
    // Take over the fill's resting position from the inline style, in GSAP's own terms.
    gsap.set(blob, { y: 0, yPercent: 101 });

    const pull = size === 'xl' ? 0.28 : 0.38;
    const bx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const by = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const lx = gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power3.out' });
    const ly = gsap.quickTo(text, 'y', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      bx(dx * pull);
      by(dy * pull);
      lx(dx * pull * 0.6);
      ly(dy * pull * 0.6);
    };
    const onEnter = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const fromTop = e.clientY - r.top < r.height / 2;
      gsap.fromTo(blob, { yPercent: fromTop ? -101 : 101 }, { yPercent: 0, duration: 0.55, ease: 'expo.out' });
    };
    const onLeave = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const toTop = e.clientY < r.top + r.height / 2;
      gsap.to(blob, { yPercent: toTop ? -101 : 101, duration: 0.5, ease: 'expo.out' });
      gsap.to([el, text], { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.classList.remove('is-magnetic');
    };
  }, [size]);

  const sizing =
    size === 'xl'
      ? 'h-[clamp(7rem,16vw,13rem)] px-[clamp(2.5rem,6vw,5.5rem)] text-[clamp(2rem,5vw,4.5rem)] font-display font-[800] [font-stretch:80%]'
      : 'h-14 px-7 text-step-0 font-semibold';
  const dark = tone === 'dark';
  const look =
    variant === 'solid'
      ? dark
        ? 'bg-bone text-char hover:bg-ember [&.is-magnetic:hover]:bg-bone'
        : 'bg-char text-bone hover:bg-volt [&.is-magnetic:hover]:bg-char [&.is-magnetic:hover]:text-char'
      : dark
        ? 'text-bone shadow-[inset_0_0_0_1.5px_currentColor] hover:bg-bone hover:text-char [&.is-magnetic:hover]:bg-transparent'
        : 'text-char shadow-[inset_0_0_0_1.5px_currentColor] hover:bg-char hover:text-bone [&.is-magnetic:hover]:bg-transparent';
  const fillColor = variant === 'solid' ? 'bg-ember' : dark ? 'bg-bone' : 'bg-char';

  return (
    <Link
      ref={root}
      href={href}
      className={`relative isolate inline-flex items-center justify-center overflow-hidden rounded-full no-underline transition-[color,background-color] duration-300 ${sizing} ${look} ${className}`}
    >
      <span
        ref={fill}
        aria-hidden="true"
        style={{ transform: 'translateY(101%)' }}
        className={`absolute inset-0 -z-10 rounded-full ${fillColor}`}
      />
      <span ref={label} className="relative block leading-none">
        {children}
      </span>
    </Link>
  );
}
