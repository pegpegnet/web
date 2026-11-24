'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { worlds } from '@/lib/universe';
import { clock } from '../store';
import { positionOnOrbit } from './orbits';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

/** A lens ghost: a soft disc with a brighter rim, tinted like coated glass. */
const fragment = /* glsl */ `
uniform vec3 uColor;
uniform float uRing;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  float r = length(vUv * 2.0 - 1.0);
  float disc = smoothstep(1.0, 0.7, r) * (1.0 - uRing);
  float ring = exp(-pow((r - 0.86) * 9.0, 2.0)) * uRing;
  gl_FragColor = vec4(uColor * (disc * 0.5 + ring) * uOpacity, 1.0);
}
`;

/** Where each ghost sits along the line from the star through the centre of the frame, its size and colour. */
const GHOSTS = [
  { t: 0.35, size: 0.05, color: '#ffb070', ring: 0 },
  { t: 0.62, size: 0.12, color: '#7fa8ff', ring: 1 },
  { t: 0.85, size: 0.03, color: '#ffd9a0', ring: 0 },
  { t: 1.25, size: 0.2, color: '#a07cff', ring: 1 },
  { t: 1.55, size: 0.07, color: '#5affc8', ring: 0 },
  { t: 1.9, size: 0.32, color: '#ff8a5a', ring: 1 },
];

/**
 * Lens ghosts from the star: faint coloured discs and rings strung along the line from the star
 * through the middle of the frame, as a camera lens makes them. They fade as the star leaves the
 * frame, and vanish when a world passes in front of it (checked against each world's sphere, which
 * is far cheaper than casting a ray into the whole scene).
 */
export function Flare() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const group = useRef<THREE.Group>(null);
  const materials = useMemo(
    () =>
      GHOSTS.map(
        (g) =>
          new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: { uColor: { value: new THREE.Color(g.color) }, uRing: { value: g.ring }, uOpacity: { value: 0 } },
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            transparent: true,
          }),
      ),
    [],
  );
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  const tmp = useMemo(() => ({ s: new THREE.Vector3(), p: new THREE.Vector3(), d: new THREE.Vector3(), q: new THREE.Vector3() }), []);
  const visible = useRef(0);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    // The star's place on screen.
    tmp.s.set(0, 0, 0).project(camera);
    const inFront = tmp.s.z < 1;
    const edge = Math.max(Math.abs(tmp.s.x), Math.abs(tmp.s.y));
    // Is a world in the way?
    let blocked = false;
    const toStar = camera.position.length();
    tmp.d.copy(camera.position).multiplyScalar(-1 / toStar);
    for (const w of worlds) {
      positionOnOrbit(w.orbit, clock.time, tmp.p).sub(camera.position);
      const along = tmp.p.dot(tmp.d);
      if (along < 0 || along > toStar) continue;
      if (tmp.q.copy(tmp.d).multiplyScalar(along).distanceTo(tmp.p) < w.radius) {
        blocked = true;
        break;
      }
    }
    // Ghosts show when the star is off-centre and still in frame, as with a real lens.
    const offCentre = THREE.MathUtils.smoothstep(Math.hypot(tmp.s.x, tmp.s.y), 0.15, 0.5);
    const goal = inFront && !blocked ? Math.max(0, 1 - Math.max(0, edge - 0.6) / 0.6) * offCentre : 0;
    visible.current += (goal - visible.current) * Math.min(1, dt * 8);

    // Lay the ghosts out on a plane just in front of the camera.
    const depth = 2;
    const halfH = depth * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const halfW = halfH * camera.aspect;
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    g.children.forEach((child, i) => {
      const ghost = GHOSTS[i]!;
      const k = 1 - 2 * ghost.t;
      child.position.set(tmp.s.x * k * halfW, tmp.s.y * k * halfH, -depth);
      child.scale.setScalar(ghost.size * 0.35 * halfH);
      materials[i]!.uniforms.uOpacity!.value = visible.current * 0.07;
    });
    g.visible = visible.current > 0.01;
  });

  return (
    <group ref={group} renderOrder={50}>
      {materials.map((m, i) => (
        <mesh key={i} material={m} frustumCulled={false} renderOrder={50}>
          <planeGeometry args={[2, 2]} />
        </mesh>
      ))}
    </group>
  );
}
