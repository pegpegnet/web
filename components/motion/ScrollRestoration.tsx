'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Native scrolling, with two jobs around client navigation: a new page starts at the top unless
 * the URL points at a section, and scroll-driven animations re-measure for the new layout.
 * (Smooth-scroll libraries were dropped: the page trailing the wheel read as lag.)
 */
export function ScrollRestoration() {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 });
    ScrollTrigger.refresh();
  }, [pathname]);
  return null;
}
