'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useQuality } from '@/components/three/QualityProvider';

const Scene = lazy(() => import('./PortraitCanvas'));

/**
 * A project's world, live, for the top of its page. Loads after the page, draws only while on
 * screen, and shows nothing (just the dark frame) without WebGL.
 */
export function Portrait({ slug, className = '' }: { slug: string; className?: string }) {
  const quality = useQuality();
  const frame = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={frame} className={`relative overflow-hidden bg-space ${className}`}>
      {quality && quality.tier !== 'off' && (
        <Suspense fallback={null}>
          <Scene slug={slug} quality={quality} active={onScreen} />
        </Suspense>
      )}
    </div>
  );
}
