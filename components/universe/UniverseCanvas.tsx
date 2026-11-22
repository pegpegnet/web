'use client';

import { useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Quality } from '@/lib/quality';
import { clock, universe } from './store';
import { Sky, Stars } from './scene/Sky';
import { Companion, Star } from './scene/Star';
import { Worlds } from './scene/Worlds';
import { Belt } from './scene/Belt';
import { OVERVIEW, Rig } from './scene/Rig';
import { Effects } from './scene/Effects';

/** Advances the system's clock once per frame, before anything reads it. */
function SystemClock({ still }: { still: boolean }) {
  useFrame((_, dt) => {
    clock.spin = still ? 0 : 1;
    if (still) clock.scale = 0;
    clock.time += Math.min(dt, 0.1) * clock.scale;
  }, -1);
  return null;
}

/** Tells the page the first frame is on screen, so it can fade the universe in. */
function Ready() {
  useFrame(() => {
    if (!universe.get().ready) universe.set({ ready: true });
  });
  useEffect(() => () => universe.set({ ready: false }), []);
  return null;
}

/** The whole system in one canvas. Loaded on its own, after the page, so three.js never blocks it. */
export default function UniverseCanvas({ quality }: { quality: Quality }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality.dpr}
      flat
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      camera={{ fov: 38, near: 0.5, far: 6000, position: [...OVERVIEW.position] }}
      aria-hidden="true"
    >
      <color attach="background" args={['#020308']} />
      <SystemClock still={quality.still} />
      <Sky tier={quality.tier} />
      <Stars tier={quality.tier} />
      <Star />
      <Companion />
      <Worlds tier={quality.tier} />
      <Belt tier={quality.tier} />
      <ambientLight intensity={0.015} />
      <Rig still={quality.still} />
      <Effects tier={quality.tier} />
      <Ready />
    </Canvas>
  );
}
