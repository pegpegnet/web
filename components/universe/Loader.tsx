'use client';

import { useEffect, useRef, useState } from 'react';
import { universe, useUniverse } from './store';

/** Longest we'll ever hold the visitor at the loader, whatever happens. */
const FAILSAFE_MS = 12000;

/**
 * The opening screen: a counter that follows the real work (the scene's code arriving, the first
 * frame, every world's surface baked), then lifts to start the opening shot. It only shows when
 * scripts run (the `js` class), and lets go after a few seconds come what may.
 */
export function Loader({ text, enabled }: { text: string; enabled: boolean }) {
  const ready = useUniverse((s) => s.ready);
  const baked = useUniverse((s) => s.baked);
  const started = useUniverse((s) => s.started);
  const [shown, setShown] = useState(0);
  const target = enabled ? 0.15 + (ready ? 0.15 : 0) + baked * 0.7 : 1;
  const value = useRef(0);

  // Ease the number towards the real progress.
  useEffect(() => {
    if (started) return;
    let frame = 0;
    const tick = () => {
      value.current += (target - value.current) * 0.12;
      if (target - value.current < 0.002) value.current = target;
      setShown(value.current);
      if (value.current < target) frame = requestAnimationFrame(tick);
      else if (target >= 1) window.setTimeout(() => universe.set({ started: true }), 350);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, started]);

  useEffect(() => {
    const t = window.setTimeout(() => universe.set({ started: true }), FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, []);

  const percent = Math.round(shown * 100);
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-40 hidden flex-col items-center justify-center bg-space transition-opacity duration-1000 [.js_&]:flex ${
        started ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <p className="font-serif text-[clamp(4rem,2rem+8vw,9rem)] leading-none tabular-nums text-starlight">
        {String(percent).padStart(3, '0')}
      </p>
      <div className="mt-6 h-px w-48 overflow-hidden bg-starlight/15">
        <div className="h-full origin-left bg-flare" style={{ transform: `scaleX(${shown})` }} />
      </div>
      <p className="mt-5 font-mono text-[10px] tracking-[0.22em] text-starlight/55 uppercase">{text}</p>
    </div>
  );
}
