'use client';

import { useRef, type ElementType } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

type Props = {
  as?: ElementType;
  children: string;
  className?: string;
  id?: string;
  /** 'load' plays as soon as the page is ready (above the fold); 'scroll' when it scrolls into view. */
  reveal?: 'load' | 'scroll' | 'none';
  /** Letters near the pointer widen along the font's width axis. */
  stretch?: boolean;
};

const NARROW = 62; // matches .type-poster
const WIDE = 128;

/**
 * Display headline with two motions:
 *   1. Each line rises out of its own mask, in a stagger.
 *   2. Letters near the pointer stretch wide and relax as it moves away (Anybody's wdth axis).
 * The text is server-rendered as normal text; SplitText adds an aria-label so screen readers
 * hear the sentence, not single letters. Reduced motion skips both.
 */
export function KineticHeading({ as: Tag = 'h2', children, className = '', id, reveal = 'scroll', stretch = false }: Props) {
  const el = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(node, {
          type: stretch ? 'lines,words,chars' : 'lines',
          mask: 'lines',
          linesClass: 'kt-line',
          aria: 'auto',
        });
        gsap.set(node, { autoAlpha: 1 });

        if (reveal !== 'none') {
          gsap.from(split.lines, {
            yPercent: 115,
            rotate: 3,
            transformOrigin: '0% 100%',
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.1,
            delay: reveal === 'load' ? 0.2 : 0,
            scrollTrigger: reveal === 'scroll' ? { trigger: node, start: 'top 85%', once: true } : undefined,
          });
        }

        if (!stretch || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => split.revert();

        const chars = split.chars as HTMLElement[];
        const setters = chars.map((c) => {
          c.style.fontStretch = `${NARROW}%`;
          const proxy = { w: NARROW };
          const to = gsap.quickTo(proxy, 'w', {
            duration: 0.7,
            ease: 'power3.out',
            onUpdate: () => {
              c.style.fontStretch = `${proxy.w}%`;
            },
          });
          return to;
        });

        let raf = 0;
        const onMove = (e: PointerEvent) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const reach = node.getBoundingClientRect().height * 0.55;
            chars.forEach((c, i) => {
              const r = c.getBoundingClientRect();
              const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
              const k = Math.max(0, 1 - d / reach);
              setters[i]!(NARROW + (WIDE - NARROW) * k * k);
            });
          });
        };
        const onLeave = () => setters.forEach((s) => s(NARROW));
        node.addEventListener('pointermove', onMove);
        node.addEventListener('pointerleave', onLeave);
        return () => {
          cancelAnimationFrame(raf);
          node.removeEventListener('pointermove', onMove);
          node.removeEventListener('pointerleave', onLeave);
          split.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: el },
  );

  return (
    <Tag ref={el} id={id} className={className} data-reveal={reveal === 'none' ? undefined : ''}>
      {children}
    </Tag>
  );
}
