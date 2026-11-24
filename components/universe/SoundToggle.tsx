'use client';

import { useEffect, useState } from 'react';
import { setSound, whoosh } from './sound';
import { universe } from './store';

const KEY = 'pegpeg-sound';

/** Turns the ambient sound on and off. Off by default; the choice is remembered on this device. */
export function SoundToggle({ text }: { text: string }) {
  const [on, setOn] = useState(false);

  // If it was on last time, start again on the first touch or click (browsers need one).
  useEffect(() => {
    let wanted = false;
    try {
      wanted = localStorage.getItem(KEY) === 'on';
    } catch {}
    if (!wanted) return;
    const start = () => {
      setSound(true);
      setOn(true);
    };
    window.addEventListener('pointerdown', start, { once: true });
    return () => window.removeEventListener('pointerdown', start);
  }, []);

  // A whoosh for every flight.
  useEffect(() => {
    let last = universe.get().focus ?? (universe.get().studio ? '@studio' : null);
    return universe.subscribe(() => {
      const s = universe.get();
      const now = s.focus ?? (s.studio ? '@studio' : null);
      if (now !== last) whoosh();
      last = now;
    });
  }, []);

  const toggle = () => {
    const next = !on;
    setSound(next);
    setOn(next);
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off');
    } catch {}
  };

  return (
    <button type="button" onClick={toggle} aria-pressed={on} className="flex items-center gap-2 uppercase text-starlight/75 transition-colors hover:text-starlight">
      <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
        {[0.5, 1, 0.7, 0.9].map((h, i) => (
          <span
            key={i}
            className={`w-[2px] origin-bottom bg-current ${on ? 'animate-[eq_1.1s_ease-in-out_infinite]' : ''}`}
            style={{ height: `${on ? h * 100 : 25}%`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      {text}
    </button>
  );
}
