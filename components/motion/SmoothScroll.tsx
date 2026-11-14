'use client';

import Lenis from 'lenis';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

const LenisContext = createContext<Lenis | null>(null);

/** The smooth-scroll instance, or null when the visitor prefers reduced motion (native scrolling). */
export const useLenis = () => useContext(LenisContext);

/**
 * Inertial scrolling driven by GSAP's ticker, so Lenis and every ScrollTrigger read the same frame.
 * Anchor links (#work, #services) glide to their target, offset for the fixed header.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reduce) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: { offset: -80 },
      autoRaf: false,
    });
    const raf = (time: number) => instance.raf(time * 1000);
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reduce]);

  // A new page starts at the top, unless the URL points at a section.
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
