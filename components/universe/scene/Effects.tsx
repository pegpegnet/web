'use client';

import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import type { Tier } from '@/lib/quality';

/**
 * The lens: bloom on anything brighter than white (the star, city lights, lava), AgX tone mapping
 * for a filmic roll-off, a vignette, and a little grain so the dark gradients don't band.
 */
export function Effects({ tier }: { tier: Tier }) {
  return (
    <EffectComposer multisampling={tier === 'high' ? 4 : 0} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.9} luminanceSmoothing={0.25} radius={0.78} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette offset={0.22} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.32} />
    </EffectComposer>
  );
}
