'use client';

/**
 * The five services as a family of objects made from PegPeg's shapes:
 *   0 iOS            a glossy app-icon tile
 *   1 Cross-platform two interlocked rings, one per platform
 *   2 Web            a stack of frosted pages
 *   3 AI             a chat bubble
 *   4 Spatial        a peg floating inside a metal cube frame
 * The service in focus comes forward under a key light in its own colour; the others step back
 * into an arc. Every move is spring-driven, so the composition rearranges physically.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { StudioLight } from '@/components/three/StudioLight';
import { useQuality } from '@/components/three/QualityProvider';
import { spring, stepSpring, type Spring } from '@/lib/spring';
import { services } from './servicesStore';

const VOLT = '#2b3bff';
const EMBER = '#ff5b14';
const TINTS = ['#9aa3ff', '#ffb38f', '#ffffff', '#ffc79e', '#b7c0ff'];

function Tile() {
  return (
    <RoundedBox args={[1.5, 1.5, 0.42]} radius={0.36} smoothness={8}>
      <meshPhysicalMaterial color={VOLT} roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} />
    </RoundedBox>
  );
}

function Rings() {
  return (
    <group>
      <mesh rotation={[0, 0.5, 0]} position={[-0.32, 0, 0]}>
        <torusGeometry args={[0.62, 0.15, 32, 96]} />
        <meshPhysicalMaterial color="#d8d4cc" metalness={1} roughness={0.28} anisotropy={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.5, 0]} position={[0.32, 0, 0]}>
        <torusGeometry args={[0.62, 0.15, 32, 96]} />
        <meshPhysicalMaterial color={EMBER} roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Pages() {
  return (
    <group rotation={[0.5, -0.4, 0]}>
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} args={[1.6, 1.1, 0.05]} radius={0.025} smoothness={4} position={[i * 0.12, i * 0.12, i * 0.28]}>
          <meshPhysicalMaterial
            color={i === 2 ? '#ffffff' : '#e9ecf8'}
            roughness={0.2}
            transparent
            opacity={i === 2 ? 0.92 : 0.55}
            clearcoat={1}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

function Bubble() {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const w = 1.6;
    const h = 1.1;
    const r = 0.42;
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(-w / 2 + 0.55, -h / 2);
    s.lineTo(-w / 2 + 0.3, -h / 2 - 0.34); // the tail
    s.lineTo(-w / 2 + 0.85, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.1, bevelSegments: 8, curveSegments: 32 });
    g.center();
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color={EMBER} roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      {[-0.36, 0, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.04, 0.27]}>
          <sphereGeometry args={[0.09, 24, 16]} />
          <meshPhysicalMaterial color="#fff6ee" roughness={0.3} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

function Frame() {
  const edges = useMemo(() => {
    const e: { p: [number, number, number]; r: [number, number, number] }[] = [];
    const h = 0.7;
    for (const a of [-h, h])
      for (const b of [-h, h]) {
        e.push({ p: [0, a, b], r: [0, 0, Math.PI / 2] });
        e.push({ p: [a, 0, b], r: [0, 0, 0] });
        e.push({ p: [a, b, 0], r: [Math.PI / 2, 0, 0] });
      }
    return e;
  }, []);
  return (
    <group rotation={[0.5, 0.6, 0]}>
      {edges.map((e, i) => (
        <mesh key={i} position={e.p} rotation={e.r}>
          <cylinderGeometry args={[0.045, 0.045, 1.44, 16]} />
          <meshPhysicalMaterial color="#d8d4cc" metalness={1} roughness={0.3} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.3, 48, 32]} />
        <meshPhysicalMaterial color={EMBER} roughness={0.15} clearcoat={1} />
      </mesh>
    </group>
  );
}

const SHAPES = [Tile, Rings, Pages, Bubble, Frame];

export function ServiceObjects() {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const groups = useRef<(THREE.Group | null)[]>([]);
  const key = useRef<THREE.SpotLight>(null);
  const motion = useMemo(
    () => SHAPES.map(() => ({ x: spring(), y: spring(), z: spring(), s: spring(0.6) }) as Record<'x' | 'y' | 'z' | 's', Spring>),
    [],
  );
  const tint = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const active = services.active;
    const t = state.clock.elapsedTime;
    SHAPES.forEach((_, i) => {
      const g = groups.current[i];
      const m = motion[i]!;
      if (!g) return;
      // The active object front and centre; the rest on an arc behind it, in order.
      const offset = i - active;
      const angle = offset * 0.55;
      const tx = i === active ? 0 : Math.sin(angle) * 1.7;
      const tz = i === active ? 1.2 : -Math.cos(angle) * 1.6 - 0.6;
      const ty = i === active ? 0.1 : 0.55 + Math.abs(offset) * 0.12;
      g.position.set(stepSpring(m.x, tx, dt, 70, 12), stepSpring(m.y, ty, dt, 70, 12), stepSpring(m.z, tz, dt, 70, 12));
      g.scale.setScalar(stepSpring(m.s, i === active ? 0.95 : 0.45, dt, 90, 12));
      if (!still) {
        g.rotation.y = t * (i === active ? 0.45 : 0.2) + i;
        g.rotation.x = Math.sin(t * 0.6 + i) * 0.15;
      }
    });
    if (key.current) {
      tint.set(TINTS[active] ?? '#ffffff');
      key.current.color.lerp(tint, Math.min(1, dt * 4));
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.4, 8.2]} fov={34} />
      <StudioLight backdrop="#cfcac1" />
      <ambientLight intensity={0.25} />
      <spotLight ref={key} position={[0, 4, 5]} angle={0.5} penumbra={0.8} intensity={60} decay={2} />
      {SHAPES.map((Shape, i) => (
        <group key={i} ref={(g) => void (groups.current[i] = g)}>
          <Shape />
        </group>
      ))}
    </>
  );
}
