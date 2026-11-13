'use client';

import { View } from '@react-three/drei';
import type { ReactNode } from 'react';

/** A drei <View> filling its box; loaded lazily so drei and three stay out of the first JavaScript. */
export default function SharedView({ children }: { children: ReactNode }) {
  return <View className="absolute inset-0">{children}</View>;
}
