'use client';

import type { ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useRef } from 'react';

/**
 * Wraps the sticky chapters. As each chapter is covered by the next, it sinks back: it scales
 * down a little, its content drifts up and a shade deepens over it.
 */
export function WorkStack({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]', root.current);
        chapters.forEach((chapter, i) => {
          const next = chapters[i + 1];
          if (!next) return;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              // Fully covered: its scene can stop rendering (see OwnCanvas).
              onLeave: () => (chapter.dataset.covered = 'true'),
              onEnterBack: () => delete chapter.dataset.covered,
            },
          });
          tl.to(chapter.querySelector('[data-chapter-inner]'), { scale: 0.9, yPercent: -6, ease: 'none' }, 0);
          tl.to(chapter.querySelector('[data-chapter-shade]'), { opacity: 0.55, ease: 'none' }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
