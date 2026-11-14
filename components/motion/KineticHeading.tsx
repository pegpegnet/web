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
  /** Kept for compatibility; letters no longer stretch. */
  stretch?: boolean;
};

/**
 * A heading whose lines fade and rise a little as it appears. Text is server-rendered as normal
 * text; SplitText adds an aria-label so screen readers hear the sentence. Reduced motion: static.
 */
export function KineticHeading({ as: Tag = 'h2', children, className = '', id, reveal = 'scroll' }: Props) {
  const el = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node || reveal === 'none') return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(node, { type: 'lines', aria: 'auto' });
        gsap.set(node, { autoAlpha: 1 });
        gsap.from(split.lines, {
          autoAlpha: 0,
          y: 18,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          delay: reveal === 'load' ? 0.1 : 0,
          scrollTrigger: reveal === 'scroll' ? { trigger: node, start: 'top 88%', once: true } : undefined,
        });
        return () => split.revert();
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
