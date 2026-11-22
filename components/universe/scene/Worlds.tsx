'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { COMPANION, STAR_COLOR, worlds, type World } from '@/lib/universe';
import type { Tier } from '@/lib/quality';
import { clock, universe } from '../store';
import { orbitAngle, orbitCircle, orbitPlane, positionOnOrbit } from './orbits';
import { Bakery, type WorldMaps } from './bakery';
import { atmosphereFragment, atmosphereVertex, planetFragment, planetVertex, ringFragment, ringVertex } from '../shaders/planet';

/** Sunlight at the worlds: the star's colour, bright enough to read as daylight after tone mapping. */
const SUN = new THREE.Color(STAR_COLOR).lerp(new THREE.Color('#ffffff'), 0.45).multiplyScalar(2.3);
const COMP_DIR = new THREE.Vector3(...COMPANION.position).normalize();
const COMP_COLOR = new THREE.Color(COMPANION.color);

/** How each type glows: colour source, strength and whether only on the night side. */
const GLOW: Record<World['type'], { strength: number; night: boolean; color?: string }> = {
  ocean: { strength: 1.0, night: true, color: '#ffb46a' },
  jungle: { strength: 0, night: true },
  toxic: { strength: 1.4, night: true },
  lava: { strength: 1.5, night: false, color: '#ff3c0a' },
  ice: { strength: 0.4, night: false },
  desert: { strength: 0, night: false },
  gas: { strength: 0, night: false },
  barren: { strength: 0, night: false },
};
const SHINE: Record<World['type'], number> = { ocean: 1, jungle: 1, toxic: 0.8, ice: 0.7, lava: 0.3, desert: 0.15, gas: 0, barren: 0.1 };
const AIR: Record<World['type'], number> = { ocean: 0.9, jungle: 0.9, toxic: 0.8, ice: 0.35, desert: 0.3, gas: 0.5, lava: 0.3, barren: 0.4 };

const black = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
black.needsUpdate = true;

function planetMaterial(world: World | null) {
  const glow = world ? GLOW[world.type] : GLOW.barren;
  return new THREE.ShaderMaterial({
    vertexShader: planetVertex,
    fragmentShader: planetFragment,
    uniforms: {
      uSurface: { value: black },
      uRelief: { value: black },
      uCloudMap: { value: black },
      uCloudAmount: { value: world?.clouds ?? 0 },
      uCloudShift: { value: 0 },
      uSun: { value: SUN },
      uCompDir: { value: COMP_DIR },
      uCompColor: { value: COMP_COLOR },
      uAtmo: { value: new THREE.Color(world?.atmosphere ?? '#000000') },
      uAtmoStrength: { value: world?.atmosphere ? AIR[world.type] : 0 },
      uGlowColor: { value: new THREE.Color(glow.color ?? world?.palette[3] ?? '#000000') },
      uGlow: { value: glow.strength },
      uGlowNight: { value: glow.night ? 1 : 0 },
      uShine: { value: world ? SHINE[world.type] : 0.1 },
      uTint: { value: new THREE.Color('#ffffff') },
      uReveal: { value: 0 },
      uHasRings: { value: world?.rings ? 1 : 0 },
      uCenter: { value: new THREE.Vector3() },
      uRadius: { value: world?.radius ?? 1 },
      uRingNormal: { value: new THREE.Vector3(0, 1, 0) },
      uRingRange: { value: new THREE.Vector2(world?.rings?.inner ?? 0, world?.rings?.outer ?? 0) },
      uRingSeed: { value: world?.seed ?? 0 },
      uRingOpacity: { value: world?.rings?.opacity ?? 0 },
    },
  });
}

function useMaps(material: THREE.ShaderMaterial, maps: WorldMaps | null) {
  useEffect(() => {
    const u = material.uniforms;
    u.uSurface!.value = maps?.surface.texture ?? black;
    u.uRelief!.value = maps?.relief.texture ?? black;
    u.uCloudMap!.value = maps?.clouds?.texture ?? black;
  }, [material, maps]);
}

type Props = {
  world: World;
  maps: WorldMaps | null;
  moonMaps: WorldMaps | null;
  onPointer: (slug: string | null) => void;
  onSelect: (slug: string) => void;
};

function Planet({ world, maps, moonMaps, onPointer, onSelect }: Props) {
  const carrier = useRef<THREE.Group>(null);
  const axis = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const moonGroup = useRef<THREE.Group>(null);
  const plane = useMemo(() => orbitPlane(world.orbit), [world.orbit]);
  const path = useMemo(() => orbitCircle(world.orbit.radius), [world.orbit.radius]);
  const material = useMemo(() => planetMaterial(world), [world]);
  const moonMaterial = useMemo(() => planetMaterial(null), []);
  const shell = world.radius * (world.type === 'gas' ? 1.04 : 1.055);
  const atmosphere = useMemo(
    () =>
      world.atmosphere
        ? new THREE.ShaderMaterial({
            vertexShader: atmosphereVertex,
            fragmentShader: atmosphereFragment,
            uniforms: {
              uCenter: { value: new THREE.Vector3() },
              uRadius: { value: world.radius },
              uShell: { value: shell },
              uColor: { value: new THREE.Color(world.atmosphere) },
              uStrength: { value: AIR[world.type] },
              uSun: { value: SUN },
              uReveal: { value: 0 },
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
          })
        : null,
    [world, shell],
  );
  const ring = useMemo(
    () =>
      world.rings
        ? new THREE.ShaderMaterial({
            vertexShader: ringVertex,
            fragmentShader: ringFragment,
            uniforms: {
              uCenter: { value: new THREE.Vector3() },
              uRadius: { value: world.radius },
              uRange: { value: new THREE.Vector2(world.rings.inner, world.rings.outer) },
              uSeed: { value: world.seed },
              uColA: { value: new THREE.Color(world.rings.colors[0]) },
              uColB: { value: new THREE.Color(world.rings.colors[1]) },
              uOpacity: { value: world.rings.opacity },
              uSun: { value: SUN },
              uReveal: { value: 0 },
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
          })
        : null,
    [world],
  );
  useEffect(
    () => () => {
      material.dispose();
      moonMaterial.dispose();
      atmosphere?.dispose();
      ring?.dispose();
    },
    [material, moonMaterial, atmosphere, ring],
  );
  useMaps(material, maps);
  useMaps(moonMaterial, moonMaps);

  const reveal = useRef(0);
  const centre = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state, dt) => {
    const a = orbitAngle(world.orbit, clock.time);
    carrier.current?.position.set(Math.cos(a) * world.orbit.radius, 0, -Math.sin(a) * world.orbit.radius);
    if (body.current) body.current.rotation.y += (dt * clock.spin * Math.PI * 2) / world.day;

    // Fade in once baked.
    if (maps && reveal.current < 1) reveal.current = Math.min(1, reveal.current + dt * 1.2);
    const r = reveal.current;
    material.uniforms.uReveal!.value = r;
    moonMaterial.uniforms.uReveal!.value = moonMaps ? r : 0;
    material.uniforms.uCloudShift!.value = (state.clock.elapsedTime * clock.spin * 0.0016) % 1;

    if (!carrier.current || !axis.current) return;
    carrier.current.getWorldPosition(centre);
    axis.current.getWorldQuaternion(q);
    up.set(0, 1, 0).applyQuaternion(q);
    material.uniforms.uCenter!.value.copy(centre);
    material.uniforms.uRingNormal!.value.copy(up);
    if (atmosphere) {
      atmosphere.uniforms.uCenter!.value.copy(centre);
      atmosphere.uniforms.uReveal!.value = r;
    }
    if (ring) {
      ring.uniforms.uCenter!.value.copy(centre);
      ring.uniforms.uReveal!.value = r;
    }
    moonGroup.current?.children.forEach((m, i) => {
      const moon = world.moons[i]!;
      const ma = moon.phase + (state.clock.elapsedTime * clock.spin * Math.PI * 2) / moon.period;
      m.position.set(Math.cos(ma) * moon.distance, Math.sin(ma) * moon.distance * moon.inclination, -Math.sin(ma) * moon.distance);
    });
  });

  return (
    <group rotation={plane}>
      <Line points={path} color="#b8c4e8" transparent opacity={0.055} lineWidth={1} depthWrite={false} />
      <group ref={carrier}>
        <group ref={axis} rotation-z={world.tilt}>
          <mesh
            ref={body}
            material={material}
            onPointerOver={(e) => {
              e.stopPropagation();
              onPointer(world.slug);
            }}
            onPointerOut={() => onPointer(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(world.slug);
            }}
          >
            <sphereGeometry args={[world.radius, 128, 64]} />
          </mesh>
          {atmosphere && (
            <mesh material={atmosphere} renderOrder={2}>
              <sphereGeometry args={[shell, 64, 32]} />
            </mesh>
          )}
          {ring && world.rings && (
            <mesh material={ring} rotation-x={-Math.PI / 2} renderOrder={3}>
              <ringGeometry args={[world.radius * world.rings.inner, world.radius * world.rings.outer, 256, 1]} />
            </mesh>
          )}
          <group ref={moonGroup}>
            {world.moons.map((m, i) => (
              <mesh key={i} material={moonMaterial}>
                <sphereGeometry args={[m.radius, 48, 24]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

/** The grey, cratered look every moon shares. */
const MOON: Pick<World, 'type' | 'seed' | 'palette' | 'clouds'> = {
  type: 'barren',
  seed: 77,
  palette: ['#3a3836', '#6e6a64', '#a39d94', '#ffffff'],
  clouds: 0,
};

/**
 * Every world, baked at a modest size up front; the one the camera is close to gets a detailed
 * bake (in strips, over a few frames) and swaps to it when ready.
 */
export function Worlds({ tier, onSelect }: { tier: Tier; onSelect?: (slug: string) => void }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const bakery = useMemo(() => new Bakery(Math.min(8, gl.capabilities.getMaxAnisotropy())), [gl]);
  const [base, setBase] = useState<Record<string, WorldMaps>>({});
  const [moonMaps, setMoonMaps] = useState<WorldMaps | null>(null);
  const [detail, setDetail] = useState<{ slug: string; maps: WorldMaps } | null>(null);
  const detailRef = useRef<{ slug: string; cancel: () => void } | null>(null);
  const baseSize = tier === 'high' ? 512 : 256;
  const detailSize = tier === 'high' ? 2048 : 1024;

  useEffect(() => {
    const made: WorldMaps[] = [];
    let count = 0;
    const cancels = worlds.map((w) =>
      bakery.bake(w, baseSize, (maps) => {
        made.push(maps);
        count++;
        universe.set({ baked: count / worlds.length });
        setBase((b) => ({ ...b, [w.slug]: maps }));
      }),
    );
    cancels.push(
      bakery.bake(MOON, baseSize / 2, (maps) => {
        made.push(maps);
        setMoonMaps(maps);
      }),
    );
    return () => {
      cancels.forEach((c) => c());
      made.forEach((m) => m.dispose());
    };
  }, [bakery, baseSize]);

  useEffect(() => () => bakery.dispose(), [bakery]);
  useEffect(() => () => detail?.maps.dispose(), [detail]);

  const at = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    // About two big strips or a handful of small maps per frame.
    bakery.work(gl, detailSize * 128 * 3);

    // Which world, if any, is the camera close to?
    let nearest: World | null = null;
    let best = Infinity;
    for (const w of worlds) {
      const d = positionOnOrbit(w.orbit, clock.time, at).distanceTo(camera.position) / w.radius;
      if (d < best) {
        best = d;
        nearest = w;
      }
    }
    const want = nearest && best < 18 ? nearest.slug : null;
    if (want && detailRef.current?.slug !== want) {
      detailRef.current?.cancel();
      const w = nearest!;
      detailRef.current = {
        slug: want,
        cancel: bakery.bake(w, detailSize, (maps) => setDetail({ slug: want, maps }), true),
      };
    }
  });

  return (
    <group>
      {worlds.map((w) => (
        <Planet
          key={w.slug}
          world={w}
          maps={detail?.slug === w.slug ? detail.maps : (base[w.slug] ?? null)}
          moonMaps={moonMaps}
          onPointer={(slug) => universe.set({ hover: slug })}
          onSelect={(slug) => onSelect?.(slug)}
        />
      ))}
    </group>
  );
}
