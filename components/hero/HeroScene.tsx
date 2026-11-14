'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Block, Peg } from './forms';
import { useHeroInput } from './useHeroInput';
import { heroProgress } from './heroProgress';
import { useQuality } from '@/components/three/QualityProvider';
import { spring, stepSpring } from '@/lib/spring';

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

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const range = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);

// Resting poses, in the turning group's space.
const BLOCK_REST = new THREE.Euler(0.35, -0.55, 0.12);
const PEG_REST_POS = new THREE.Vector3(-1.9, 0.75, 0.5);
const PEG_REST_ROT = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9, 0.2, 0.75));

export function HeroScene({ onExplored }: { onExplored?: () => void }) {
  const quality = useQuality();
  const tier = quality?.tier ?? 'low';
  const still = quality?.still ?? false;
  const { width, height } = useThree((s) => s.viewport);
  const narrow = width < height; // portrait: the forms sit above the headline

  const camera = useRef<THREE.PerspectiveCamera>(null);
  const rig = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const blockPivot = useRef<THREE.Group>(null);
  const block = useRef<THREE.Mesh>(null);
  const peg = useRef<THREE.Group>(null);
  const input = useHeroInput('hero', onExplored);
  const veil = useRef<THREE.MeshBasicMaterial>(null);

  const rotX = useRef(spring());
  const rotY = useRef(spring());
  const pegX = useRef(spring());
  const pegY = useRef(spring());
  const squash = useRef(spring(1));

  const rigPos = useMemo(
    () => (narrow ? new THREE.Vector3(0.35, height * 0.24, 0) : new THREE.Vector3(width * 0.27, 0.1, 0)),
    [narrow, width, height],
  );
  const rigScale = narrow ? 0.5 : 0.82;

  // Scratch objects reused every frame.
  const tmp = useMemo(
    () => ({
      blockQ: new THREE.Quaternion(),
      slotQ: new THREE.Quaternion(),
      pegQ: new THREE.Quaternion(),
      axis: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      upright: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2),
      restQ: new THREE.Quaternion().setFromEuler(BLOCK_REST),
      faceQ: new THREE.Quaternion(),
      camFrom: new THREE.Vector3(0, 0, 9),
      camTo: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((state, dt) => {
    const s = input.current;
    const t = state.clock.elapsedTime;
    const p = still ? 0 : heroProgress.value;

    // Story beats along the scroll:
    const align = smooth(range(p, 0.08, 0.45)); // peg turns to face the hole
    const insert = smooth(range(p, 0.42, 0.62)); // peg slides in
    const push = smooth(range(p, 0.6, 1)); // camera pushes into the blue
    const free = 1 - align; // how much the playful, pointer-driven motion still applies

    // Drag inertia (see PR 12), faded out as the story takes over.
    if (!s.dragging) {
      s.dragX += s.velX * dt;
      s.dragY += s.velY * dt;
      s.velX *= Math.pow(0.04, dt);
      s.velY *= Math.pow(0.04, dt);
      s.dragX *= Math.pow(0.2, dt);
      s.dragY *= Math.pow(0.2, dt);
    }
    const idle = still ? 0 : Math.sin(t * 0.25) * 0.18;
    if (turn.current) {
      turn.current.rotation.y = stepSpring(rotY.current, (idle + s.dragX + s.px * 0.25) * free, dt, 60, 11);
      turn.current.rotation.x = stepSpring(rotX.current, (Math.max(-0.9, Math.min(0.9, s.dragY)) - s.py * 0.15) * free, dt, 60, 11);
    }

    // Block: idle bob, squash on poke, and turning square-on to the camera for the push.
    if (blockPivot.current) {
      const bob = still ? 0 : Math.sin(t * 1.1) * 0.08 * free;
      blockPivot.current.position.y = bob;
      tmp.blockQ.copy(tmp.restQ).slerp(tmp.faceQ.identity(), push);
      blockPivot.current.quaternion.copy(tmp.blockQ);
    }
    if (s.poke) {
      squash.current.v -= 9;
      s.poke = false;
    }
    if (block.current) {
      const k = stepSpring(squash.current, 1, dt, 260, 9);
      block.current.scale.set(1 + (1 - k) * 0.6, k, 1 + (1 - k) * 0.6);
    }

    // Peg: free and springy at rest; on scroll it lines up with the hole's axis and slides in.
    if (peg.current && blockPivot.current) {
      const sx = stepSpring(pegX.current, s.px * 0.55, dt, 40, 5.5);
      const sy = stepSpring(pegY.current, s.py * 0.4, dt, 40, 5.5);
      const bob = still ? 0 : Math.sin(t * 1.6 + 1) * 0.12;
      const freePos = tmp.pos.set(PEG_REST_POS.x + sx, PEG_REST_POS.y + sy + bob, PEG_REST_POS.z);

      // Along the hole: 2.4 units out in front, down until the head sits on the face.
      const depth = 2.4 - 2.6 * insert;
      tmp.axis.set(0, 0, depth).applyQuaternion(blockPivot.current.quaternion).add(blockPivot.current.position);
      peg.current.position.copy(freePos).lerp(tmp.axis, align);

      tmp.slotQ.copy(blockPivot.current.quaternion).multiply(tmp.upright);
      tmp.pegQ.copy(PEG_REST_ROT).slerp(tmp.slotQ, align);
      peg.current.quaternion.copy(tmp.pegQ);
      peg.current.rotateZ(-pegX.current.v * 0.08 * free);
    }

    // Camera: from the wide shot, in until the block's face just overfills the frame.
    if (camera.current && rig.current) {
      const cam = camera.current;
      const span = 2.2 * rigScale; // the block's width in world units
      const fit = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const dist = Math.max(span / (fit * cam.aspect), span / fit) * 1.02; // the whole face, edge to edge
      const faceZ = (0.35 + 0.18) * rigScale;
      tmp.camTo.copy(rig.current.position).setZ(faceZ + dist);
      camera.current.position.copy(tmp.camFrom).lerp(tmp.camTo, push);
      camera.current.lookAt(tmp.camTo.x * push, tmp.camTo.y * push, 0);
    }

    // Last beat: the frame turns the exact flat volt of the next section (drawn in front of the lens).
    if (veil.current) {
      const o = range(p, 0.86, 0.98);
      veil.current.opacity = o;
      veil.current.visible = o > 0;
    }
  });

  const shadowSize = tier === 'high' ? 512 : 256;
  return (
    <>
      <PerspectiveCamera ref={camera} makeDefault position={[0, 0, 9]} fov={30}>
        <mesh position={[0, 0, -0.5]} renderOrder={10}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial ref={veil} color="#2b3bff" transparent opacity={0} depthTest={false} depthWrite={false} toneMapped={false} />
        </mesh>
      </PerspectiveCamera>
      <Studio />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[-2.5, 4, 9]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
        shadow-radius={8}
      />

      {/* The page itself: receives the forms' shadows, so they fall across the bone paper and the headline */}
      <mesh position={[0, 0, -2.2]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <shadowMaterial transparent opacity={0.09} color="#3b2a1e" />
      </mesh>

      <group ref={rig} position={rigPos} scale={rigScale}>
        <group ref={turn}>
          <group ref={blockPivot}>
            <Block ref={block} tier={tier} />
          </group>
          <group ref={peg}>
            <Peg tier={tier} />
          </group>
        </group>
      </group>
    </>
  );
}
