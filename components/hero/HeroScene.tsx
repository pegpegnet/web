'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, PerspectiveCamera } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import { Block, Peg } from './forms';
import { useHeroInput } from './useHeroInput';
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

export function HeroScene({ onExplored }: { onExplored?: () => void }) {
  const quality = useQuality();
  const tier = quality?.tier ?? 'low';
  const still = quality?.still ?? false;
  const { width, height } = useThree((s) => s.viewport);
  const narrow = width < height; // portrait: the forms sit above the headline

  const rig = useRef<Group>(null);
  const turn = useRef<Group>(null);
  const block = useRef<Mesh>(null);
  const pegArm = useRef<Group>(null);
  const input = useHeroInput('hero', onExplored);

  // Springs: the rig's drag rotation, the peg dangling after the pointer, the block's squash.
  const rotX = useRef(spring());
  const rotY = useRef(spring());
  const pegX = useRef(spring());
  const pegY = useRef(spring());
  const squash = useRef(spring(1));

  useFrame((state, dt) => {
    const s = input.current;
    const t = state.clock.elapsedTime;

    // Drag: follow the finger directly; on release, coast on the throw velocity, then spring home.
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
      turn.current.rotation.y = stepSpring(rotY.current, idle + s.dragX + s.px * 0.25, dt, 60, 11);
      turn.current.rotation.x = stepSpring(rotX.current, Math.max(-0.9, Math.min(0.9, s.dragY)) - s.py * 0.15, dt, 60, 11);
    }

    // The peg hangs on a spring and swings after the pointer, overshooting a little.
    if (pegArm.current) {
      pegArm.current.position.x = stepSpring(pegX.current, s.px * 0.55, dt, 40, 5.5);
      pegArm.current.position.y = stepSpring(pegY.current, s.py * 0.4, dt, 40, 5.5);
      pegArm.current.rotation.z = -pegX.current.v * 0.08;
    }

    // A tap on the hero squashes the block, which bounces back like rubber.
    if (s.poke) {
      squash.current.v -= 9;
      s.poke = false;
    }
    if (block.current) {
      const k = stepSpring(squash.current, 1, dt, 260, 9);
      block.current.scale.set(1 + (1 - k) * 0.6, k, 1 + (1 - k) * 0.6);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={30} />
      <Studio />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />

      <group ref={rig} position={narrow ? [0.35, height * 0.24, 0] : [width * 0.2, 0.2, 0]} scale={narrow ? 0.5 : 0.95}>
        <group ref={turn}>
          <Float enabled={!still} speed={1.1} rotationIntensity={0.35} floatIntensity={0.6}>
            <group rotation={[0.35, -0.55, 0.12]}>
              <Block ref={block} tier={tier} />
            </group>
          </Float>
          <group ref={pegArm}>
            <Float enabled={!still} speed={1.6} rotationIntensity={0.6} floatIntensity={0.9}>
              <group position={[-1.9, 0.75, 0.5]} rotation={[0.9, 0.2, 0.75]} scale={0.85}>
                <Peg tier={tier} />
              </group>
            </Float>
          </group>
        </group>
      </group>
    </>
  );
}
