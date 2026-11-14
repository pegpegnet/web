'use client';

/**
 * Yutub: visionOS windows in a room. Frosted glass windows float in a shallow arc showing the real
 * app, with the two visionOS ornaments: a tab bar beside the main window and video controls below
 * it, whose progress thumb is the big one Yutub added. Windows lift and brighten when the pointer
 * is over them, as in visionOS, and the arc turns gently to follow the pointer.
 */
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { roundedRect } from '@/components/three/shapes';
import { StudioLight } from '@/components/three/StudioLight';
import { useQuality } from '@/components/three/QualityProvider';
import { spring, stepSpring } from '@/lib/spring';

const GLASS = { color: '#ffffff', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15, transparent: true };

function Window({
  w,
  h,
  map,
  position,
  rotation = [0, 0, 0],
}: {
  w: number;
  h: number;
  map: THREE.Texture;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const [hover, setHover] = useState(false);
  const lift = useRef(spring());
  const frame = useMemo(() => roundedRect(w, h, 0.14), [w, h]);
  const inner = useMemo(() => roundedRect(w - 0.14, h - 0.14, 0.09), [w, h]);

  useFrame((_, dt) => {
    const k = stepSpring(lift.current, hover ? 1 : 0, dt, 170, 16);
    if (group.current) {
      group.current.position.z = position[2] + k * 0.28;
      group.current.scale.setScalar(1 + k * 0.035);
    }
    if (screen.current) screen.current.color.setScalar(0.86 + k * 0.14);
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh
        geometry={frame}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        <meshPhysicalMaterial {...GLASS} opacity={hover ? 0.6 : 0.42} />
      </mesh>
      <mesh geometry={inner} position={[0, 0, 0.01]}>
        <meshBasicMaterial ref={screen} map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The vertical tab bar ornament: five tabs, one selected. */
function TabBar({ position }: { position: [number, number, number] }) {
  const pill = useMemo(() => roundedRect(0.34, 1.5, 0.17), []);
  return (
    <group position={position}>
      <mesh geometry={pill}>
        <meshPhysicalMaterial {...GLASS} opacity={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.56 - i * 0.28, 0.01]}>
          <circleGeometry args={[i === 0 ? 0.1 : 0.065, 32]} />
          <meshBasicMaterial color={i === 0 ? '#ffffff' : '#c8ccd6'} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** The controls ornament: previous, play, next, and a progress bar with Yutub's oversized thumb. */
function Controls({ position, still }: { position: [number, number, number]; still: boolean }) {
  const pill = useMemo(() => roundedRect(2.2, 0.36, 0.18), []);
  const thumb = useRef<THREE.Mesh>(null);
  const played = useRef<THREE.Mesh>(null);
  const play = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.05, -0.07);
    s.lineTo(0.08, 0);
    s.lineTo(-0.05, 0.07);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);
  const BAR = 1.3;
  useFrame((state) => {
    const p = still ? 0.38 : (state.clock.elapsedTime * 0.06) % 1;
    if (thumb.current) thumb.current.position.x = -BAR / 2 + p * BAR + 0.35;
    if (played.current) {
      played.current.scale.x = Math.max(0.001, p);
      played.current.position.x = -BAR / 2 + (p * BAR) / 2 + 0.35;
    }
  });
  return (
    <group position={position}>
      <mesh geometry={pill}>
        <meshPhysicalMaterial {...GLASS} opacity={0.5} />
      </mesh>
      <mesh geometry={play} position={[-0.72, 0, 0.01]}>
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0.35, 0, 0.01]}>
        <planeGeometry args={[BAR, 0.035]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh ref={played} position={[0, 0, 0.012]}>
        <planeGeometry args={[BAR, 0.035]} />
        <meshBasicMaterial color="#ff3b2f" toneMapped={false} />
      </mesh>
      <mesh ref={thumb} position={[0, 0, 0.02]}>
        <circleGeometry args={[0.075, 32]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

export function YutubScene() {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const [main, side] = useTexture(['/work/yutub-screenshot.webp', '/work/yutub-capture.webp']);
  for (const t of [main, side]) {
    if (t) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
  }
  const arc = useRef<THREE.Group>(null);
  const yaw = useRef(spring());
  const pitch = useRef(spring());

  useFrame((state, dt) => {
    if (!arc.current) return;
    const t = state.clock.elapsedTime;
    const bob = still ? 0 : Math.sin(t * 0.7) * 0.06;
    arc.current.rotation.y = stepSpring(yaw.current, state.pointer.x * 0.22, dt, 30, 9);
    arc.current.rotation.x = stepSpring(pitch.current, -state.pointer.y * 0.08, dt, 30, 9);
    arc.current.position.y = bob;
  });

  if (!main || !side) return null;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8.2]} fov={32} />
      <StudioLight />
      <ambientLight intensity={0.6} />
      <group ref={arc}>
        <Window w={3.4} h={1.92} map={main} position={[0.15, 0.25, 0]} />
        <Window w={2} h={1.14} map={side} position={[-2.35, -0.95, -1.1]} rotation={[0, 0.45, 0]} />
        <Window w={1.5} h={0.86} map={main} position={[2.3, 1.25, -1.3]} rotation={[0, -0.45, 0]} />
        <TabBar position={[-1.85, 0.25, 0.08]} />
        <Controls position={[0.15, -1.03, 0.25]} still={still} />
      </group>
    </>
  );
}
