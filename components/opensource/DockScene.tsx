'use client';

/**
 * The open-source apps as a macOS Dock: real app icons on a glass shelf. Icons swell as the pointer
 * passes, with their neighbours making room, and the active one bounces like an app launching.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrthographicCamera, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { StudioLight } from '@/components/three/StudioLight';
import { useQuality } from '@/components/three/QualityProvider';
import { spring, stepSpring, type Spring } from '@/lib/spring';
import { dock } from './dockStore';

const SIZE = 1; // icon size at rest
const GAP = 0.28;

export function DockScene({ icons, onOpen }: { icons: string[]; onOpen: (i: number) => void }) {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const textures = useTexture(icons);
  useEffect(() => {
    for (const t of textures) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
  }, [textures]);

  const n = icons.length;
  const groups = useRef<(THREE.Group | null)[]>([]);
  const scales = useMemo<Spring[]>(() => icons.map(() => spring(1)), [icons]);
  const hops = useMemo<Spring[]>(() => icons.map(() => spring(0)), [icons]);
  const lastActive = useRef(-1);
  const restWidth = n * SIZE + (n - 1) * GAP;

  useFrame((_, dt) => {
    const px = dock.pointer; // 0..1 across the dock, or null
    const active = dock.active;
    // Launch bounce when the active app changes.
    if (active !== lastActive.current && !still) {
      const h = hops[active];
      if (h) h.v = 6;
      lastActive.current = active;
    }
    // Target scale per icon: a smooth bump around the pointer, like the Dock's magnification.
    const targets = icons.map((_, i) => {
      if (px === null) return i === active ? 1.18 : 1;
      const centre = (i + 0.5) / n;
      const d = (px - centre) * n;
      return 1 + 0.75 * Math.exp(-d * d * 1.1);
    });
    const sizes = targets.map((t, i) => stepSpring(scales[i]!, t, dt, 220, 22) * SIZE);
    const width = sizes.reduce((a, b) => a + b, 0) + (n - 1) * GAP;
    let x = -width / 2;
    sizes.forEach((s, i) => {
      const g = groups.current[i];
      const hop = Math.max(0, stepSpring(hops[i]!, 0, dt, 90, 7));
      if (g) {
        g.scale.setScalar(s / SIZE);
        g.position.set(x + s / 2, s / 2 - SIZE / 2 + hop * 0.45, 0);
      }
      x += s + GAP;
    });
  });

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0.3, 10]} zoom={78} />
      <StudioLight />
      <ambientLight intensity={0.8} />
      {/* The glass shelf */}
      <RoundedBox args={[restWidth + 0.9, 0.22, 1.2]} radius={0.1} smoothness={4} position={[0, -SIZE / 2 - 0.16, -0.4]}>
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.16} roughness={0.15} clearcoat={1} />
      </RoundedBox>
      {textures.map((map, i) => (
        <group
          key={icons[i]}
          ref={(g) => void (groups.current[i] = g)}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(i);
          }}
        >
          <mesh>
            <planeGeometry args={[SIZE, SIZE]} />
            <meshBasicMaterial map={map} transparent alphaTest={0.02} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}
