'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectQuality, type Quality } from '@/lib/quality';

const QualityContext = createContext<Quality | null>(null);

/** The device's 3D quality, or null during server render and the first client paint. */
export const useQuality = () => useContext(QualityContext);

export function QualityProvider({ children }: { children: ReactNode }) {
  const [quality, setQuality] = useState<Quality | null>(null);
  useEffect(() => {
    const update = () => setQuality(detectQuality());
    update();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return <QualityContext.Provider value={quality}>{children}</QualityContext.Provider>;
}
