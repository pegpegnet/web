'use client';

import { useEffect, useState } from 'react';
import { useQuality } from '@/components/three/QualityProvider';

/**
 * "Drag to explore": a quiet hint beside the forms, gone for good after the first real drag
 * (the hero dispatches 'pegpeg:explored'). Hidden when there is no 3D to explore.
 */
export function DragHint({ label }: { label: string }) {
  const quality = useQuality();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const done = () => setGone(true);
    window.addEventListener('pegpeg:explored', done);
    return () => window.removeEventListener('pegpeg:explored', done);
  }, []);
  if (!quality || quality.tier === 'off') return null;
  return (
    <p
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-10 right-[var(--spacing-gutter)] flex items-center gap-2.5 text-step--1 font-medium text-graphite transition-opacity duration-700 max-md:hidden ${
        gone ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="relative block h-6 w-6 rounded-full border border-graphite/40">
        <span className="absolute top-1/2 left-1/2 block h-1.5 w-1.5 -translate-1/2 animate-[hint_2.4s_var(--ease-in-out-quart)_infinite] rounded-full bg-ember" />
      </span>
      {label}
    </p>
  );
}
