'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, PerspectiveCamera } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import { Block, Peg } from './forms';
import { useQuality } from '@/components/three/QualityProvider';

/** Studio lighting built from soft light panels: no downloaded HDR, crisp highlights on the glaze. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#1d1e22']} />
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={2.2} color="#fff4ea" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[3, 8, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#dfe3ff" position={[5, 0, -1]} rotation-y={-Math.PI / 2} scale={[3, 8, 1]} />
      <Lightformer form="ring" intensity={3} color="#ffffff" position={[2, 2, 6]} scale={1.6} />
    </Environment>
  );
}

export function HeroScene() {
  const quality = useQuality();
  const tier = quality?.tier ?? 'low';
  const still = quality?.still ?? false;
  const { width, height } = useThree((s) => s.viewport);
  const narrow = width < height; // portrait: the forms sit above the headline
  const rig = useRef<Group>(null);
  const block = useRef<Mesh>(null);
  const peg = useRef<Group>(null);

  // Slow idle turn of the whole composition; the forms also bob independently via <Float>.
  useFrame((state) => {
    if (!rig.current || still) return;
    const t = state.clock.elapsedTime;
    rig.current.rotation.y = Math.sin(t * 0.25) * 0.18;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={30} />
      <Studio />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} castShadow />

      <group ref={rig} position={narrow ? [0.35, height * 0.24, 0] : [width * 0.2, 0.2, 0]} scale={narrow ? 0.5 : 0.95}>
        <Float enabled={!still} speed={1.1} rotationIntensity={0.35} floatIntensity={0.6}>
          <group rotation={[0.35, -0.55, 0.12]}>
            <Block ref={block} tier={tier} />
          </group>
        </Float>
        <Float enabled={!still} speed={1.6} rotationIntensity={0.6} floatIntensity={0.9}>
          <group position={[-1.9, 0.75, 0.5]} rotation={[0.9, 0.2, 0.75]} scale={0.85}>
            <Peg ref={peg} tier={tier} />
          </group>
        </Float>
      </group>
    </>
  );
}
