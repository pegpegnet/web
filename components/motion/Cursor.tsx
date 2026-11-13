'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * A trailing ring that follows the pointer on devices with a precise mouse.
 *
 *   - Over links and buttons it tightens into a solid dot.
 *   - Over any element with data-cursor="Label" it opens into a disc that reads the label
 *     ("Drag", "View", "Play"), and that element hides the system cursor (see globals.css).
 *
 * Touch screens and reduced-motion settings never see it; the system cursor always works.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState<'idle' | 'link' | 'label'>('idle');
  const [enabled, setEnabled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(fine.matches && !reduce);
    update();
    fine.addEventListener('change', update);
    return () => fine.removeEventListener('change', update);
  }, [reduce]);

  useEffect(() => {
    const el = ring.current;
    if (!enabled || !el) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      x(e.clientX);
      y(e.clientY);
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (labelled) {
        setMode('label');
        setLabel(labelled.dataset.cursor ?? '');
      } else if (target?.closest('a, button, [role="button"], input, textarea, label')) {
        setMode('link');
      } else {
        setMode('idle');
      }
    };
    const onLeave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };
    const onDown = () => gsap.to(el, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.classList.add('has-cursor');
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = mode === 'label' ? 'h-24 w-24 bg-ember border-ember' : mode === 'link' ? 'h-3 w-3 bg-volt border-volt' : 'h-9 w-9 border-volt';
  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[200] invisible opacity-0"
    >
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] transition-[width,height,background-color,border-color] duration-500 ease-out-expo ${size}`}
      >
        <span
          className={`text-step--1 font-semibold text-char transition-opacity duration-300 ${mode === 'label' ? 'opacity-100' : 'opacity-0'}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
