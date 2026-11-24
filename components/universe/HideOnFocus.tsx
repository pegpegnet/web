'use client';

import type { ReactNode } from 'react';
import { useUniverse } from './store';

/** Fades its contents out while a world or the studio is in focus: the headline steps aside. */
export function HideOnFocus({ children, className = '' }: { children: ReactNode; className?: string }) {
  const away = useUniverse((s) => !!s.focus || s.studio);
  return (
    <div className={`transition-[opacity,translate] duration-700 ${away ? 'pointer-events-none -translate-y-2 opacity-0' : 'opacity-100'} ${className}`}>
      {children}
    </div>
  );
}
