'use client';

import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { NeutralToneMapping } from 'three';
import { useQuality } from './QualityProvider';

/**
 * The single WebGL canvas for the whole site. It covers the viewport, lets every click through,
 * and draws each section's scene inside that section's box (drei <View>), so many scenes share
 * one GPU context and only the ones on screen are rendered.
 */
export default function Stage() {
  const quality = useQuality();
  if (!quality || quality.tier === 'off') return null;
  return (
    <Canvas
      className="!fixed !inset-0 !z-[1] !pointer-events-none"
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
      dpr={quality.dpr}
      gl={{ antialias: quality.tier === 'high', alpha: true, powerPreference: 'high-performance', toneMapping: NeutralToneMapping }}
      camera={{ position: [0, 0, 6], fov: 35 }}
      aria-hidden="true"
    >
      <View.Port />
    </Canvas>
  );
}
