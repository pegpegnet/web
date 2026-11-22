'use client';

import { Bloom, ChromaticAberration, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import type { Tier } from '@/lib/quality';

const FRINGE = new Vector2(0.0007, 0.0007);

/**
 * The lens: bloom on anything brighter than white (the star, city lights, lava), AgX tone mapping
 * for a filmic roll-off, a hint of chromatic aberration towards the corners on capable devices,
 * a vignette, and a little grain so the dark gradients don't band.
 */
export function Effects({ tier }: { tier: Tier }) {
  return (
    <EffectComposer multisampling={tier === 'high' ? 4 : 0} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.9} luminanceSmoothing={0.25} radius={0.78} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      {tier === 'high' && <ChromaticAberration offset={FRINGE} radialModulation modulationOffset={0.35} />}
      <Vignette offset={0.22} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.32} />
    </EffectComposer>
  );
}
