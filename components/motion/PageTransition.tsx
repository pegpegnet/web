'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap';

/**
 * A short white fade between pages: the old page fades out, the new one fades in once rendered.
 * Same-page anchors, new tabs, downloads, external links and modified clicks are left alone;
 * with reduced motion navigation is immediate.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const a = (e.target as Element | null)?.closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
      if (url.pathname === location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      if (pending.current) return;
      pending.current = url.pathname + url.search + url.hash;
      const el = veil.current;
      if (!el) return router.push(pending.current);
      gsap.killTweensOf(el);
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: 'power1.out', onComplete: () => router.push(pending.current!) });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  useEffect(() => {
    const el = veil.current;
    if (!pending.current || !el) return;
    pending.current = null;
    gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.05, ease: 'power1.inOut' });
  }, [pathname]);

  return <div ref={veil} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[150] bg-bone opacity-0" />;
}
