'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BELT, random } from '@/lib/universe';
import type { Tier } from '@/lib/quality';
import { clock } from '../store';

/** A lumpy rock: an icosphere pushed in and out by a few random dents. */
function rockGeometry(seed: number) {
  const g = new THREE.IcosahedronGeometry(1, 2);
  const rnd = random(seed);
  const dents = Array.from({ length: 7 }, () => ({
    dir: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
    depth: 0.12 + rnd() * 0.28,
  }));
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    let s = 1;
    for (const d of dents) s -= d.depth * Math.max(0, n.dot(d.dir)) ** 3;
    v.multiplyScalar(s * (0.85 + 0.15 * Math.sin(n.x * 9 + n.y * 7)));
    pos.setXYZ(i, v.x * 1.25, v.y * 0.8, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/**
 * The asteroid belt between the inner worlds and the earlier work: a few thousand rocks, most of
 * them small, in a thin ring that turns at the speed Kepler gives its middle.
 */
export function Belt({ tier }: { tier: Tier }) {
  const count = tier === 'high' ? 3200 : 1000;
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.InstancedMesh | null)[]>([]);
  const geometries = useMemo(() => [rockGeometry(11), rockGeometry(29), rockGeometry(53)], []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8a8076', roughness: 1, metalness: 0, flatShading: true }), []);
  useEffect(
    () => () => {
      geometries.forEach((g) => g.dispose());
      material.dispose();
    },
    [geometries, material],
  );

  useLayoutEffect(() => {
    const rnd = random(4242);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const tint = new THREE.Color();
    const per = Math.ceil(count / geometries.length);
    meshes.current.forEach((mesh) => {
      if (!mesh) return;
      for (let i = 0; i < per; i++) {
        const a = rnd() * Math.PI * 2;
        // Denser in the middle of the belt, thinning towards its edges.
        const t = (rnd() + rnd() + rnd()) / 3;
        const r = BELT.inner + (BELT.outer - BELT.inner) * t;
        p.set(Math.cos(a) * r, (rnd() - 0.5) * (rnd() - 0.5) * 3.2, -Math.sin(a) * r);
        const size = 0.025 + 0.32 * rnd() ** 6;
        s.set(size, size * (0.7 + rnd() * 0.5), size * (0.7 + rnd() * 0.5));
        q.setFromEuler(e.set(rnd() * 6.3, rnd() * 6.3, rnd() * 6.3));
        mesh.setMatrixAt(i, m.compose(p, q, s));
        const shade = 0.55 + rnd() * 0.6;
        mesh.setColorAt(i, tint.setRGB(shade, shade * (0.92 + rnd() * 0.1), shade * (0.85 + rnd() * 0.12)));
      }
      mesh.count = per;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [count, geometries]);

  const middle = (BELT.inner + BELT.outer) / 2;
  const period = 60 * (middle / 14) ** 1.5;
  useFrame(() => {
    if (group.current) group.current.rotation.y = (clock.time / period) * Math.PI * 2;
  });

  return (
    <group ref={group} rotation-x={0.012}>
      {geometries.map((g, i) => (
        <instancedMesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          args={[g, material, Math.ceil(count / geometries.length)]}
          frustumCulled={false}
        />
      ))}
    </group>
  );
}
