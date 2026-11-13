'use client';

/**
 * A pin-art pegboard: a volt board full of ember pegs. Where the pointer passes, pegs rise toward it
 * and fall back on their own springs, so a ripple follows the hand; when nobody is touching it, a
 * slow wave breathes across the board.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { StudioLight } from '@/components/three/StudioLight';
import { useQuality } from '@/components/three/QualityProvider';

export function PegBoard() {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const cols = quality?.tier === 'high' ? 30 : 18;
  const rows = quality?.tier === 'high' ? 14 : 9;
  const pitch = 0.42;
  const W = cols * pitch;
  const H = rows * pitch;

  const pegs = useRef<THREE.InstancedMesh>(null);
  const holes = useRef<THREE.InstancedMesh>(null);
  const state = useMemo(() => ({ h: new Float32Array(cols * rows), v: new Float32Array(cols * rows) }), [cols, rows]);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), p: new THREE.Vector3(), s: new THREE.Vector3(1, 1, 1), hit: new THREE.Vector3(), plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), ray: new THREE.Raycaster() }), []);
  const board = useRef<THREE.Group>(null);
  const touching = useRef(false);

  // Holes don't move: place them once.
  const placeHoles = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    let i = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        tmp.m.makeTranslation(-W / 2 + pitch / 2 + c * pitch, -H / 2 + pitch / 2 + r * pitch, 0.001);
        mesh.setMatrixAt(i++, tmp.m);
      }
    mesh.instanceMatrix.needsUpdate = true;
  };

  useFrame((s, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const mesh = pegs.current;
    const g = board.current;
    if (!mesh || !g) return;
    // Where is the pointer on the board?
    let px = 1e9;
    let py = 1e9;
    if (touching.current) {
      tmp.ray.setFromCamera(s.pointer, s.camera);
      const inv = g.matrixWorld.clone().invert();
      const local = tmp.ray.ray.clone().applyMatrix4(inv);
      if (local.intersectPlane(tmp.plane, tmp.hit)) {
        px = tmp.hit.x;
        py = tmp.hit.y;
      }
    }
    const t = s.clock.elapsedTime;
    let i = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = -W / 2 + pitch / 2 + c * pitch;
        const y = -H / 2 + pitch / 2 + r * pitch;
        const d2 = (x - px) ** 2 + (y - py) ** 2;
        const push = Math.exp(-d2 / 0.9) * 1.1;
        const wave = still ? 0.08 : 0.08 + 0.07 * Math.sin(t * 1.2 + x * 0.8 + y * 0.5);
        const target = Math.max(wave, push);
        // Each peg on its own spring: rises quickly, settles with a little bounce.
        const a = 160 * (target - state.h[i]!) - 11 * state.v[i]!;
        state.v[i]! += a * dt;
        state.h[i]! += state.v[i]! * dt;
        const h = Math.max(0.02, state.h[i]!);
        tmp.p.set(x, y, h / 2);
        tmp.s.set(1, h / 0.5, 1);
        tmp.m.compose(tmp.p, tmp.q, tmp.s);
        mesh.setMatrixAt(i++, tmp.m);
      }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const count = cols * rows;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, -3.4, 7.6]} fov={38} onUpdate={(c) => c.lookAt(0, -0.3, 0)} />
      <StudioLight backdrop="#3a3b44" />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 4, 6]} intensity={1.6} />
      <group
        ref={board}
        rotation={[-0.38, 0, 0]}
        onPointerEnter={() => (touching.current = true)}
        onPointerMove={() => (touching.current = true)}
        onPointerLeave={() => (touching.current = false)}
      >
        <RoundedBox args={[W + 0.4, H + 0.4, 0.3]} radius={0.12} smoothness={4} position={[0, 0, -0.16]}>
          <meshPhysicalMaterial color="#2b3bff" roughness={0.28} clearcoat={0.7} />
        </RoundedBox>
        <instancedMesh ref={(m) => { holes.current = m; placeHoles(m); }} args={[undefined, undefined, count]}>
          <circleGeometry args={[0.1, 20]} />
          <meshBasicMaterial color="#141a6b" toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={pegs} args={[undefined, undefined, count]}>
          <capsuleGeometry args={[0.085, 0.33, 4, 12]} />
          <meshPhysicalMaterial color="#ff5b14" roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
        </instancedMesh>
      </group>
    </>
  );
}
