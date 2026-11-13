'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, PerspectiveCamera } from '@react-three/drei';
import type { Group } from 'three';
import { useQuality } from './QualityProvider';

/** Temporary scene proving the stage: a blue block with an orange peg. Replaced by the hero in the next PR. */
export function LabScene() {
  const group = useRef<Group>(null);
  const quality = useQuality();
  useFrame((_, dt) => {
    if (group.current && !quality?.still) group.current.rotation.y += dt * 0.4;
  });
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer intensity={1.5} position={[-4, 0, 2]} scale={[2, 6, 1]} />
      </Environment>
      <group ref={group}>
        <mesh>
          <boxGeometry args={[1.6, 1.6, 0.8]} />
          <meshPhysicalMaterial color="#2b3bff" roughness={0.25} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.9, 48]} />
          <meshPhysicalMaterial color="#ff5b14" roughness={0.3} clearcoat={1} />
        </mesh>
      </group>
    </>
  );
}
