'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = { src: string; width: number; height: number; alt: string; className?: string; parallax?: boolean; eager?: boolean };

/**
 * An image that fades and rises gently as it scrolls into view; with `parallax`, it also drifts
 * inside its frame while the page scrolls. Reduced motion shows it plainly.
 */
export function RevealImage({ src, width, height, alt, className = '', parallax = false, eager = false }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = frame.current;
      const img = el?.querySelector('img');
      if (!el || !img) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } },
        );
        if (parallax) {
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
      });
      return () => mm.revert();
    },
    { scope: frame },
  );
  return (
    <div ref={frame} className={`overflow-hidden rounded-[1.25rem] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`block h-full w-full object-cover ${parallax ? 'scale-[1.18]' : ''}`}
      />
    </div>
  );
}
