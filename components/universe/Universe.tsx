'use client';

import { Suspense, lazy, type ReactNode } from 'react';
import { useQuality } from '@/components/three/QualityProvider';
import { useUniverse } from './store';

const Scene = lazy(() => import('./UniverseCanvas'));

/**
 * The home page's stage: the 3D system fills the screen and the interface sits on top of it. The
 * scene fades in once its first frame is drawn; until then (and without WebGL) the dark sky and
 * the interface are already there.
 */
export function Universe({ children }: { children: ReactNode }) {
  const quality = useQuality();
  const ready = useUniverse((s) => s.ready);
  return (
    <div className="fixed inset-0 overflow-hidden bg-space text-starlight">
      <div className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${ready ? 'opacity-100' : 'opacity-0'}`}>
        {quality && quality.tier !== 'off' && (
          <Suspense fallback={null}>
            <Scene quality={quality} />
          </Suspense>
        )}
      </div>
      {children}
    </div>
  );
}
