'use client';

import { useCallback } from 'react';
import { SceneView } from '@/components/three/SceneView';
import { HeroScene } from './HeroScene';

/** The hero's 3D box. Lives in a client component so the scene can report the first drag. */
export function HeroStage() {
  const explored = useCallback(() => window.dispatchEvent(new Event('pegpeg:explored')), []);
  return (
    <SceneView className="!absolute inset-0">
      <HeroScene onExplored={explored} />
    </SceneView>
  );
}
