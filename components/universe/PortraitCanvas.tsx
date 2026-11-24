'use client';

import { useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getWorld, type World } from '@/lib/universe';
import type { Quality } from '@/lib/quality';
import { Stars } from './scene/Sky';
import { MOON, WorldBody } from './scene/Worlds';
import { Bakery, type WorldMaps } from './scene/bakery';
import { Effects } from './scene/Effects';
import { useFrame } from '@react-three/fiber';

/** Where the portrait's world sits; the star stays at the origin, off to the side, lighting it. */
const CENTRE = new THREE.Vector3(36, 0, 0);

function Sitter({ world, tier }: { world: World; tier: Quality['tier'] }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const bakery = useMemo(() => new Bakery(Math.min(8, gl.capabilities.getMaxAnisotropy())), [gl]);
  const [maps, setMaps] = useState<WorldMaps | null>(null);
  const [moonMaps, setMoonMaps] = useState<WorldMaps | null>(null);

  useEffect(() => {
    let made: WorldMaps[] = [];
    const size = tier === 'high' ? 1024 : 512;
    const cancel = [
      bakery.bake(world, size, (m) => {
        made.push(m);
        setMaps(m);
      }),
      bakery.bake(MOON, 256, (m) => {
        made.push(m);
        setMoonMaps(m);
      }),
    ];
    return () => {
      cancel.forEach((c) => c());
      made.forEach((m) => m.dispose());
      made = [];
      bakery.dispose();
    };
  }, [bakery, world, tier]);

  // A three-quarter view of the day side, far enough back to fit rings and moons.
  useEffect(() => {
    const toSun = CENTRE.clone().multiplyScalar(-1).normalize();
    const side = new THREE.Vector3(0, 1, 0).cross(toSun).normalize();
    const reach = world.radius * (world.rings ? world.rings.outer * 1.05 : 1.3) + (world.moons.length ? world.radius * 0.6 : 0);
    const dir = toSun.multiplyScalar(0.5).addScaledVector(side, 0.85).add(new THREE.Vector3(0, 0.3, 0)).normalize();
    camera.position.copy(CENTRE).addScaledVector(dir, reach * 3.2);
    camera.near = 0.05;
    camera.far = 4000;
    camera.lookAt(CENTRE);
    camera.updateProjectionMatrix();
  }, [camera, world]);

  useFrame(() => bakery.work(gl, 1024 * 1024 * 3));

  return (
    <group position={CENTRE}>
      <WorldBody world={world} maps={maps} moonMaps={moonMaps} />
    </group>
  );
}

/** A single world, turning slowly, for its project's page. */
export default function PortraitCanvas({ slug, quality, active }: { slug: string; quality: Quality; active: boolean }) {
  const world = getWorld(slug);
  if (!world) return null;
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality.dpr}
      flat
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      camera={{ fov: 30 }}
      aria-hidden="true"
    >
      <color attach="background" args={['#020308']} />
      <Stars tier="low" />
      <ambientLight intensity={0.02} />
      <pointLight color="#ffc898" intensity={2.6} decay={0} />
      <Sitter world={world} tier={quality.tier} />
      <Effects tier={quality.tier} still={quality.still} />
    </Canvas>
  );
}
