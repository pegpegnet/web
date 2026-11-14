'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuality } from './QualityProvider';

const OwnCanvas = dynamic(() => import('./OwnCanvas'), { ssr: false });
const SharedView = dynamic(() => import('./SharedView'), { ssr: false });

type Props = {
  /** What the scene shows when 3D is unavailable: a still, an illustration, or nothing. */
  fallback?: ReactNode;
  className?: string;
  /** Custom-cursor label when the scene is interactive, e.g. "Drag". */
  cursor?: string;
  /**
   * 'shared' draws into the site-wide canvas above the page (cheap, and the scene can overlap
   * page content). 'own' gives the scene a canvas inside its section, so later content can cover
   * it; it mounts only near the viewport.
   */
  layer?: 'shared' | 'own';
  children: ReactNode;
};

/**
 * A box in the page with a 3D scene in it. Until the device's quality is known, and on devices
 * without WebGL, the fallback is shown instead.
 */
export function SceneView({ fallback = null, className = '', cursor, layer = 'shared', children }: Props) {
  const quality = useQuality();
  const live = quality !== null && quality.tier !== 'off';
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (layer !== 'own' || !box.current) return;
    const io = new IntersectionObserver(([entry]) => setNear(!!entry?.isIntersecting), { rootMargin: '50% 0px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, [layer]);

  let content: ReactNode = fallback;
  if (live && layer === 'shared') content = <SharedView>{children}</SharedView>;
  if (live && layer === 'own')
    content = near ? (
      <OwnCanvas quality={quality} host={box}>
        {children}
      </OwnCanvas>
    ) : null;

  return (
    <div ref={box} className={`relative ${className}`} data-cursor={live ? cursor : undefined}>
      {content}
    </div>
  );
}
