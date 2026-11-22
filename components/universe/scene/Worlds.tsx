'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { worlds, type World } from '@/lib/universe';
import { clock } from '../store';
import { orbitAngle, orbitCircle, orbitPlane } from './orbits';

function Planet({ world }: { world: World }) {
  const carrier = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const plane = useMemo(() => orbitPlane(world.orbit), [world.orbit]);
  const path = useMemo(() => orbitCircle(world.orbit.radius), [world.orbit.radius]);

  useFrame((_, dt) => {
    const a = orbitAngle(world.orbit, clock.time);
    carrier.current?.position.set(Math.cos(a) * world.orbit.radius, 0, -Math.sin(a) * world.orbit.radius);
    if (body.current) body.current.rotation.y += (dt * clock.scale * Math.PI * 2) / world.day;
  });

  return (
    <group rotation={plane}>
      <Line points={path} color="#b8c4e8" transparent opacity={0.055} lineWidth={1} depthWrite={false} />
      <group ref={carrier}>
        <group rotation-z={world.tilt}>
          <mesh ref={body}>
            <sphereGeometry args={[world.radius, 64, 32]} />
            <meshStandardMaterial color={world.palette[1]} roughness={0.9} metalness={0} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function Worlds() {
  return (
    <group>
      {worlds.map((w) => (
        <Planet key={w.slug} world={w} />
      ))}
    </group>
  );
}
