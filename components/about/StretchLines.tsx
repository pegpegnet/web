'use client';

import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Three statements set in Anybody. As each line crosses the screen it widens from condensed to
 * extended along the font's width axis, scrubbed by the scroll. Static at a middle width with
 * reduced motion.
 */
const WIDEST = 112; // font-stretch at the end of the scroll

export function StretchLines({ lines }: { lines: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  // Size the type so the longest line, fully stretched, exactly fits the column.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fit = () => {
      const items = [...el.querySelectorAll<HTMLElement>('[data-line]')];
      const saved = items.map((l) => l.style.fontStretch);
      items.forEach((l) => {
        l.style.fontSize = '100px';
        l.style.fontStretch = `${WIDEST}%`;
      });
      const widest = Math.max(...items.map((l) => l.scrollWidth));
      const size = Math.min(200, (el.clientWidth / widest) * 100 * 0.98);
      items.forEach((l, i) => {
        l.style.fontSize = `${size}px`;
        l.style.fontStretch = saved[i] ?? '';
      });
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-line]', root.current).forEach((line) => {
          const proxy = { w: 50 };
          gsap.to(proxy, {
            w: WIDEST,
            ease: 'none',
            onUpdate: () => {
              line.style.fontStretch = `${proxy.w}%`;
            },
            scrollTrigger: { trigger: line, start: 'top bottom', end: 'bottom 35%', scrub: 0.6 },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="overflow-hidden">
      <h2 className="sr-only">{lines.join(' ')}</h2>
      {lines.map((line, i) => (
        <p
          key={line}
          data-line
          aria-hidden="true"
          className={`w-max max-w-none font-display leading-[0.9] font-[850] tracking-[-0.02em] whitespace-nowrap [font-stretch:88%] ${
            i === 1 ? 'ml-auto text-ember-type' : ''
          } text-[clamp(2.2rem,0.3rem+7.3vw,10rem)]`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
