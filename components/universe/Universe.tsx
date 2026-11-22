'use client';

import { Suspense, lazy, useEffect, type ReactNode } from 'react';
import { useQuality } from '@/components/three/QualityProvider';
import { universe, useUniverse } from './store';
import { focusWorld, openStudio, readAddress, stepWorld } from './navigation';
import { WorldLabels } from './WorldLabels';
import { StudioPanel, WorldPanel, type PanelText, type StudioText, type WorldInfo } from './Panels';
import { WorldIndex, type IndexText } from './WorldIndex';

const Scene = lazy(() => import('./UniverseCanvas'));

export type UniverseText = PanelText & IndexText & { worlds: string; starHint: string };

/**
 * The home page's stage: the 3D system fills the screen and the interface sits on top of it. The
 * scene fades in once its first frame is drawn; until then (and without WebGL) the dark sky and
 * the interface are already there.
 *
 * Keys: ← and → move between worlds, Esc goes back to the whole system. The address follows what's
 * in focus (/es/#abadia, /es/#studio), so it can be shared, and the back button returns.
 */
export function Universe({ worlds, t, studio, children }: { worlds: WorldInfo[]; t: UniverseText; studio: StudioText; children: ReactNode }) {
  const quality = useQuality();
  const ready = useUniverse((s) => s.ready);
  const hover = useUniverse((s) => s.hover);

  useEffect(() => {
    const fromAddress = () => universe.set(readAddress());
    fromAddress();
    window.addEventListener('popstate', fromAddress);
    window.addEventListener('hashchange', fromAddress);
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey || universe.get().index) return;
      if ((e.target as Element | null)?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const { focus, studio } = universe.get();
      if (e.key === 'Escape' && focus) focusWorld(null);
      else if (e.key === 'Escape' && studio) openStudio(false);
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
      universe.set({ focus: null, hover: null, studio: false, index: false });
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
      <WorldLabels names={worlds} label={t.worlds} star={t.starHint} />
      <WorldPanel worlds={worlds} t={t} />
      <StudioPanel t={studio} />
      <WorldIndex worlds={worlds} t={t} />
    </div>
  );
}
