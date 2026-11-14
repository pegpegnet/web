'use client';

/**
 * MixMasterTube: a two-deck video mixer you can touch. Two screens float above the console showing
 * the real decks from the 2009 site; between them, the crossfader. Drag it and the picture (and
 * the VU meters) move from one deck to the other, which is exactly what MixMasterTube did with
 * YouTube videos. The platters spin, and the knobs turn when you drag them up or down.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { PerspectiveCamera, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { roundedRect } from '@/components/three/shapes';
import { StudioLight } from '@/components/three/StudioLight';
import { useQuality } from '@/components/three/QualityProvider';
import { spring, stepSpring } from '@/lib/spring';

const AMBER = '#ffb31a';
const FADER = 1.5; // travel of the crossfader

/** A vinyl label and grooves, drawn once. */
function vinyl() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0d0f12';
  ctx.fillRect(0, 0, 256, 256);
  for (let r = 40; r < 128; r += 3) {
    ctx.strokeStyle = r % 2 ? '#191c21' : '#121418';
    ctx.beginPath();
    ctx.arc(128, 128, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = AMBER;
  ctx.beginPath();
  ctx.arc(128, 128, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0d0f12';
  ctx.fillRect(126, 100, 4, 22);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A knob that turns when dragged up or down. */
function Knob({ position, initial = 0 }: { position: [number, number, number]; initial?: number }) {
  const ref = useRef<THREE.Group>(null);
  const angle = useRef(initial);
  const drag = useRef<number | null>(null);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (drag.current === null) return;
      angle.current = THREE.MathUtils.clamp(angle.current - (e.clientY - drag.current) * 0.02, -2.4, 2.4);
      drag.current = e.clientY;
    };
    const up = () => (drag.current = null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, -angle.current, 0.25);
  });
  return (
    <group
      ref={ref}
      position={position}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        drag.current = e.nativeEvent.clientY;
        gl.domElement.style.cursor = 'ns-resize';
      }}
      onPointerUp={() => (gl.domElement.style.cursor = '')}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.14, 40]} />
        <meshPhysicalMaterial color="#2a2f36" metalness={0.6} roughness={0.35} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, 0.072, -0.09]}>
        <boxGeometry args={[0.025, 0.01, 0.07]} />
        <meshBasicMaterial color={AMBER} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** A column of LEDs, lit by level 0..1. */
function Meter({ position, level }: { position: [number, number, number]; level: React.RefObject<number> }) {
  const leds = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame(() => {
    const lit = Math.round((level.current ?? 0) * 10);
    leds.current.forEach((m, i) => {
      const on = i < lit;
      m.color.set(i > 7 ? '#ff4a2a' : AMBER);
      m.opacity = on ? 1 : 0.12;
    });
  });
  return (
    <group position={position}>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0, 0.005, -i * 0.07]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.1, 0.045]} />
          <meshBasicMaterial ref={(m) => void (m && (leds.current[i] = m))} transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function MixMasterScene() {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const decks = useTexture('/work/mixmaster-top.webp');
  const record = useMemo(vinyl, []);
  // Crop each deck's video out of the 2009 screenshot.
  const [deckA, deckB] = useMemo(() => {
    const crop = (x: number) => {
      const t = decks.clone();
      t.colorSpace = THREE.SRGBColorSpace;
      t.repeat.set(284 / 960, 214 / 382);
      t.offset.set(x / 960, 1 - 334 / 382);
      t.needsUpdate = true;
      return t;
    };
    return [crop(28), crop(650)];
  }, [decks]);
  const screen = useMemo(() => roundedRect(1.5, 1.13, 0.06), []);

  const cross = useRef(-0.35); // -1 deck A, +1 deck B
  const capX = useRef(spring(-0.35 * (FADER / 2)));
  const dragging = useRef(false);
  const levelA = useRef(0);
  const levelB = useRef(0);
  const cap = useRef<THREE.Mesh>(null);
  const platterA = useRef<THREE.Mesh>(null);
  const platterB = useRef<THREE.Mesh>(null);
  const matA = useRef<THREE.MeshBasicMaterial>(null);
  const matB = useRef<THREE.MeshBasicMaterial>(null);
  const rig = useRef<THREE.Group>(null);
  const yaw = useRef(spring());
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    // Dragging the crossfader: map horizontal pointer travel to fader travel.
    let last = 0;
    const down = (e: PointerEvent) => (last = e.clientX);
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const worldPerPx = (2 * Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2)) * 6.2) / size.height;
      cross.current = THREE.MathUtils.clamp(cross.current + ((e.clientX - last) * worldPerPx * 2) / FADER, -1, 1);
      last = e.clientX;
    };
    const up = () => (dragging.current = false);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [camera, size.height]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // Left alone, the fader drifts slowly between the decks, like a set in progress.
    if (!dragging.current && !still) cross.current += (Math.sin(t * 0.35) * 0.8 - cross.current) * Math.min(1, dt * 0.5);
    const x = stepSpring(capX.current, cross.current * (FADER / 2), dt, 220, 20);
    if (cap.current) cap.current.position.x = x;

    const a = (1 - cross.current) / 2; // deck A's share
    const b = 1 - a;
    if (matA.current) matA.current.color.setScalar(0.25 + 0.75 * Math.min(1, a * 1.6));
    if (matB.current) matB.current.color.setScalar(0.25 + 0.75 * Math.min(1, b * 1.6));
    const beat = still ? 0.7 : 0.55 + 0.45 * Math.abs(Math.sin(t * 4.2)) * (0.7 + 0.3 * Math.sin(t * 1.3));
    levelA.current = Math.min(1, beat * Math.min(1, a * 1.6));
    levelB.current = Math.min(1, (still ? 0.7 : 0.55 + 0.45 * Math.abs(Math.sin(t * 4.2 + 1.1))) * Math.min(1, b * 1.6));

    if (!still) {
      if (platterA.current) platterA.current.rotation.y -= dt * 3.5 * (0.3 + a);
      if (platterB.current) platterB.current.rotation.y -= dt * 3.5 * (0.3 + b);
    }
    if (rig.current) rig.current.rotation.y = stepSpring(yaw.current, state.pointer.x * 0.12, dt, 25, 9);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3.1, 5.4]} fov={34} onUpdate={(c) => c.lookAt(0, 0.35, 0)} />
      <StudioLight warm />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 5, 3]} intensity={1.1} />
      <group ref={rig}>
        {/* Console */}
        <RoundedBox args={[4.6, 0.28, 1.9]} radius={0.1} smoothness={4} position={[0, -0.14, 0]}>
          <meshPhysicalMaterial color="#1d2229" metalness={0.75} roughness={0.38} anisotropy={0.7} clearcoat={0.4} />
        </RoundedBox>

        {/* Platters */}
        {[
          [-1.45, platterA],
          [1.45, platterB],
        ].map(([x, ref]) => (
          <group key={x as number} position={[x as number, 0.02, 0.1]}>
            <mesh>
              <cylinderGeometry args={[0.66, 0.66, 0.05, 64]} />
              <meshPhysicalMaterial color="#2a2f36" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh ref={ref as React.RefObject<THREE.Mesh>} position={[0, 0.03, 0]} rotation-x={0}>
              <cylinderGeometry args={[0.6, 0.6, 0.012, 64]} />
              <meshStandardMaterial attach="material-0" color="#0d0f12" />
              <meshStandardMaterial attach="material-1" map={record} roughness={0.35} />
              <meshStandardMaterial attach="material-2" color="#0d0f12" />
            </mesh>
          </group>
        ))}

        {/* Mixer: knobs, meters and the crossfader */}
        <Knob position={[-0.42, 0.07, -0.55]} initial={-0.6} />
        <Knob position={[0.42, 0.07, -0.55]} initial={0.9} />
        <Knob position={[-0.42, 0.07, -0.15]} initial={0.2} />
        <Knob position={[0.42, 0.07, -0.15]} initial={-1.1} />
        <Meter position={[-0.12, 0.001, -0.05]} level={levelA} />
        <Meter position={[0.12, 0.001, -0.05]} level={levelB} />
        <mesh position={[0, 0.002, 0.62]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[FADER + 0.25, 0.06]} />
          <meshBasicMaterial color="#05070a" toneMapped={false} />
        </mesh>
        {/* The whole slot is grabbable: press anywhere on it and the fader jumps there, then follows the drag */}
        <mesh
          position={[0, 0.13, 0.62]}
          rotation-x={-Math.PI / 2}
          onPointerDown={(e) => {
            e.stopPropagation();
            const local = e.eventObject.parent!.worldToLocal(e.point.clone());
            cross.current = THREE.MathUtils.clamp(local.x / (FADER / 2), -1, 1);
            dragging.current = true;
          }}
        >
          <planeGeometry args={[FADER + 0.5, 0.55]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh ref={cap} position={[0, 0.06, 0.62]}>
          <boxGeometry args={[0.24, 0.12, 0.3]} />
          <meshPhysicalMaterial color="#e8e2d6" roughness={0.3} clearcoat={1} />
        </mesh>

        {/* The two decks' videos, floating above the console like layered glass */}
        <group position={[-1.45, 1.15, -0.55]} rotation={[-0.12, 0.18, 0]}>
          <mesh geometry={screen}>
            <meshBasicMaterial ref={matA} map={deckA} toneMapped={false} />
          </mesh>
        </group>
        <group position={[1.45, 1.15, -0.55]} rotation={[-0.12, -0.18, 0]}>
          <mesh geometry={screen}>
            <meshBasicMaterial ref={matB} map={deckB} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}
