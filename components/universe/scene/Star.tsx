'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { noise } from '../shaders/noise';
import { COMPANION, STAR_RADIUS } from '@/lib/universe';
import { universe } from '../store';

const surfaceVertex = /* glsl */ `
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vObj = normalize(position);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

/**
 * An orange (K-type) star: boiling granulation, slow larger cells, a few cooler patches, and limb
 * darkening that reddens and dims the edge. Output is HDR so the bloom picks it up.
 */
const surfaceFragment = /* glsl */ `
uniform float uTime;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
${noise}
void main() {
  vec3 n = normalize(vNormalW);
  vec3 v = normalize(cameraPosition - vPosW);
  float mu = clamp(dot(n, v), 0.0, 1.0);
  vec3 p = vObj * 2.4;
  float t = uTime * 0.025;
  // Granulation: bright cells of rising gas with dark lanes between them, on two scales.
  float granules = ridged(p * 9.0 + vec3(t, -t * 0.7, t * 0.4), 4);
  float fine = ridged(p * 26.0 + vec3(-t, t, 0.0), 3);
  float cells = fbm(p * 1.4 + vec3(0.0, t * 0.4, t * 0.2), 4) * 0.5 + 0.5;
  // A few small, dark spots.
  float spots = smoothstep(0.74, 0.8, fbm(p * 1.6 + 3.1, 4) * 0.5 + 0.5);
  float heat = clamp(0.3 + 0.45 * granules + 0.15 * fine + 0.25 * cells - 0.75 * spots, 0.0, 1.2);
  float limb = 0.25 + 0.75 * pow(mu, 0.5);
  vec3 hot = vec3(1.0, 0.56, 0.25);
  vec3 cool = vec3(0.85, 0.16, 0.03);
  vec3 col = mix(cool, hot, clamp(heat * limb, 0.0, 1.0)) * (0.5 + 1.55 * heat) * limb;
  gl_FragColor = vec4(col, 1.0);
}
`;

const quadVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** The corona: a glow hugging the limb, with slow streamers, and a wide faint halo. */
const coronaFragment = /* glsl */ `
uniform float uTime;
uniform float uRatio;
varying vec2 vUv;
${noise}
void main() {
  vec2 c = vUv * 2.0 - 1.0;
  float r = length(c) / uRatio;
  float a = atan(c.y, c.x);
  float streamers = fbm(vec3(cos(a) * 2.2, sin(a) * 2.2, r * 0.5 - uTime * 0.012), 5) * 0.5 + 0.5;
  float rays = fbm(vec3(cos(a) * 9.0, sin(a) * 9.0, uTime * 0.01), 3) * 0.5 + 0.5;
  float d = max(r - 1.0, 0.0);
  float glow = exp(-d * 3.4) * (0.45 + 1.1 * pow(streamers, 2.2)) + exp(-d * 1.2) * pow(rays, 4.0) * 0.5;
  float halo = exp(-d * 0.75) * 0.16;
  float edge = smoothstep(1.0, 0.7, length(c));
  vec3 col = vec3(1.0, 0.46, 0.17) * (glow + halo) * edge * 1.5;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** A distant star seen as a point: a tight hot core, a soft glow and four diffraction spikes. */
const pointStarFragment = /* glsl */ `
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  vec2 c = vUv * 2.0 - 1.0;
  float r = length(c);
  float core = exp(-r * r * 900.0) * 30.0;
  float glow = exp(-r * 9.0) * 0.9 + exp(-r * 3.0) * 0.12;
  float spikes = exp(-abs(c.x) * 160.0) * exp(-abs(c.y) * 2.6) + exp(-abs(c.y) * 160.0) * exp(-abs(c.x) * 2.6);
  float edge = smoothstep(1.0, 0.6, r);
  gl_FragColor = vec4(uColor * (core + glow + spikes * 1.6) * edge, 1.0);
}
`;

const additive = { blending: THREE.AdditiveBlending, depthWrite: false, transparent: true } as const;

export function Star({ onSelect }: { onSelect?: () => void }) {
  const camera = useThree((s) => s.camera);
  const corona = useRef<THREE.Mesh>(null);
  const surface = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: surfaceVertex, fragmentShader: surfaceFragment, uniforms: { uTime: { value: 0 } } }),
    [],
  );
  const coronaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertex,
        fragmentShader: coronaFragment,
        uniforms: { uTime: { value: 0 }, uRatio: { value: 1 / 4 } },
        ...additive,
      }),
    [],
  );
  useEffect(
    () => () => {
      surface.dispose();
      coronaMaterial.dispose();
    },
    [surface, coronaMaterial],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    surface.uniforms.uTime!.value = t;
    coronaMaterial.uniforms.uTime!.value = t;
    corona.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <group>
      <mesh
        material={surface}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          universe.set({ hover: '@star' });
        }}
        onPointerOut={() => universe.set({ hover: null })}
      >
        <sphereGeometry args={[STAR_RADIUS, 96, 48]} />
      </mesh>
      {/* The quad spans four star radii each side; uRatio is the star's share of that. */}
      <mesh ref={corona} material={coronaMaterial} renderOrder={10}>
        <planeGeometry args={[STAR_RADIUS * 8, STAR_RADIUS * 8]} />
      </mesh>
      {/* Lights for the few standard materials in the scene (asteroids, moons). */}
      <pointLight color="#ffc898" intensity={2.6} decay={0} distance={0} />
    </group>
  );
}

/** The blue companion, far beyond the worlds, and the faint cold light it casts. */
export function Companion() {
  const camera = useThree((s) => s.camera);
  const sprite = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertex,
        fragmentShader: pointStarFragment,
        uniforms: { uColor: { value: new THREE.Color(COMPANION.color) } },
        ...additive,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  const position = useMemo(() => new THREE.Vector3(...COMPANION.position), []);

  useFrame(() => {
    if (!sprite.current) return;
    sprite.current.quaternion.copy(camera.quaternion);
    // Keep its apparent size about constant, like any star: scale with distance.
    sprite.current.scale.setScalar(camera.position.distanceTo(position) * 0.11);
  });

  return (
    <group>
      <mesh ref={sprite} position={position} material={material} renderOrder={-800} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <directionalLight color={COMPANION.color} intensity={0.35} position={position} />
    </group>
  );
}
