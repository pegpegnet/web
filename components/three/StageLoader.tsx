'use client';

import dynamic from 'next/dynamic';

// three.js stays out of the first JavaScript the page needs; it loads right after hydration.
const Stage = dynamic(() => import('./Stage'), { ssr: false });

export function StageLoader() {
  return <Stage />;
}
