'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { heroProgress } from './heroProgress';

/**
 * Pins the hero while the scroll story plays: the peg slots into the block and the camera pushes
 * into the blue. The headline, lead and actions lift away first. With reduced motion nothing pins.
 */
export function HeroScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = document.getElementById('hero');
      const copy = document.getElementById('hero-copy');
      if (!hero || !copy) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            heroProgress.value = self.progress;
          },
          onLeaveBack: () => {
            heroProgress.value = 0;
          },
        },
      });
      tl.to(copy, { yPercent: -18, autoAlpha: 0, ease: 'power2.in', duration: 0.35 }, 0.05);
      tl.to({}, { duration: 0.6 }); // the rest of the timeline belongs to the 3D scene
      return () => {
        heroProgress.value = 0;
      };
    });
    return () => mm.revert();
  });
  return null;
}

export { ScrollTrigger };
