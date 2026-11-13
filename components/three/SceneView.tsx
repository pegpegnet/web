'use client';

import { View } from '@react-three/drei';
import type { ReactNode } from 'react';
import { useQuality } from './QualityProvider';

type Props = {
  /** What the scene shows when 3D is unavailable: a still, an illustration, or nothing. */
  fallback?: ReactNode;
  className?: string;
  /** Custom-cursor label when the scene is interactive, e.g. "Drag". */
  cursor?: string;
  children: ReactNode;
};

/**
 * A box in the page whose contents are drawn by the shared canvas. Until the device's quality is
 * known, and on devices without WebGL, the fallback is shown instead.
 */
export function SceneView({ fallback = null, className = '', cursor, children }: Props) {
  const quality = useQuality();
  const live = quality !== null && quality.tier !== 'off';
  return (
    <div className={`relative ${className}`} data-cursor={live ? cursor : undefined}>
      {live ? <View className="absolute inset-0">{children}</View> : fallback}
    </div>
  );
}
