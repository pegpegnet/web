'use client';

import { Canvas } from '@react-three/fiber';
import { NeutralToneMapping } from 'three';
import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import type { Quality } from '@/lib/quality';

/**
 * A canvas that lives inside its section, for scenes that other page content must be able to
 * cover (stacked chapters). It renders only while on screen and not covered by the next chapter.
 */
export default function OwnCanvas({ quality, host, children }: { quality: Quality; host: RefObject<HTMLElement | null>; children: ReactNode }) {
  const [covered, setCovered] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [host]);
  useEffect(() => {
    const chapter = host.current?.closest<HTMLElement>('[data-chapter]');
    if (!chapter) return;
    const update = () => setCovered(chapter.dataset.covered === 'true');
    update();
    const mo = new MutationObserver(update);
    mo.observe(chapter, { attributes: true, attributeFilter: ['data-covered'] });
    return () => mo.disconnect();
  }, [host]);
  return (
    <Canvas
      className="!absolute !inset-0"
      frameloop={covered || !onScreen ? 'never' : 'always'}
      dpr={quality.dpr}
      gl={{ antialias: quality.tier === 'high', alpha: true, powerPreference: 'high-performance', toneMapping: NeutralToneMapping }}
      camera={{ position: [0, 0, 6], fov: 35 }}
      aria-hidden="true"
    >
      {children}
    </Canvas>
  );
}
