'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap';

/**
 * Page-to-page transition. An internal link click raises a volt curtain carrying the peg mark,
 * the next page is fetched behind it, and the curtain lifts away once that page is in place.
 * Same-page anchors, new tabs, downloads, external links and modified clicks are left alone, and
 * with reduced motion navigation is immediate.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const a = (e.target as Element | null)?.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
      if (url.pathname === location.pathname) return; // anchors on this page scroll instead
      e.preventDefault();
      e.stopPropagation(); // keep the link's own client navigation from running first
      if (pending.current) return;
      pending.current = url.pathname + url.search + url.hash;
      const el = curtain.current;
      if (!el) return router.push(pending.current);
      gsap.killTweensOf([el, mark.current]);
      gsap.set(el, { display: 'flex', clipPath: 'inset(100% 0% 0% 0%)' });
      gsap
        .timeline({ onComplete: () => router.push(pending.current!) })
        .to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'expo.inOut' })
        .fromTo(mark.current, { scale: 0.4, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, 0.2);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // The new page has rendered under the curtain: lift it.
  useEffect(() => {
    const el = curtain.current;
    if (!pending.current || !el) return;
    pending.current = null;
    gsap
      .timeline({ delay: 0.15 })
      .to(mark.current, { scale: 0.6, duration: 0.3, ease: 'power2.in' })
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut' }, 0.1)
      .set(el, { display: 'none' });
  }, [pathname]);

  return (
    <div ref={curtain} aria-hidden="true" className="fixed inset-0 z-[150] hidden items-center justify-center bg-volt">
      <div ref={mark} className="relative h-28 w-28">
        <span className="absolute inset-0 rounded-full bg-ember" />
        <span className="absolute inset-[34%] rounded-full bg-volt" />
      </div>
    </div>
  );
}
