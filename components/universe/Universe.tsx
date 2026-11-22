'use client';

import { Suspense, lazy, useEffect, type ReactNode } from 'react';
import { useQuality } from '@/components/three/QualityProvider';
import { universe, useUniverse } from './store';
import { focusWorld, stepWorld, worldFromHash } from './navigation';
import { WorldLabels, type WorldName } from './WorldLabels';
import { FocusBar, type FocusBarText } from './FocusBar';

const Scene = lazy(() => import('./UniverseCanvas'));

export type UniverseText = FocusBarText & { worlds: string };

/**
 * The home page's stage: the 3D system fills the screen and the interface sits on top of it. The
 * scene fades in once its first frame is drawn; until then (and without WebGL) the dark sky and
 * the interface are already there.
 *
 * Keys: ← and → move between worlds, Esc goes back to the whole system. The address follows the
 * world in focus (/es/#abadia), so it can be shared, and the back button returns to the system.
 */
export function Universe({ names, t, children }: { names: WorldName[]; t: UniverseText; children: ReactNode }) {
  const quality = useQuality();
  const ready = useUniverse((s) => s.ready);
  const hover = useUniverse((s) => s.hover);

  useEffect(() => {
    const fromAddress = () => universe.set({ focus: worldFromHash() });
    fromAddress();
    window.addEventListener('popstate', fromAddress);
    window.addEventListener('hashchange', fromAddress);
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
      if ((e.target as Element | null)?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'Escape' && universe.get().focus) focusWorld(null);
      else if (e.key === 'ArrowRight') stepWorld(1);
      else if (e.key === 'ArrowLeft') stepWorld(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('popstate', fromAddress);
      window.removeEventListener('hashchange', fromAddress);
      window.removeEventListener('keydown', onKey);
      universe.set({ focus: null, hover: null });
    };
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden bg-space text-starlight ${hover ? 'cursor-pointer' : ''}`}>
      <div className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${ready ? 'opacity-100' : 'opacity-0'}`}>
        {quality && quality.tier !== 'off' && (
          <Suspense fallback={null}>
            <Scene quality={quality} />
          </Suspense>
        )}
      </div>
      {children}
      <WorldLabels names={names} label={t.worlds} />
      <FocusBar names={names} t={t} />
    </div>
  );
}
