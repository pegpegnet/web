'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { noise } from '../shaders/noise';
import { random } from '@/lib/universe';
import type { Tier } from '@/lib/quality';

const fullscreen = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/**
 * The Milky Way of this system, painted once: dark sky, a tilted galactic band with warm star
 * clouds and dust lanes, faint blue and violet nebulae. Stars are drawn separately, as points, so they stay sharp. Values are
 * linear and low, so the worlds and the star stay the brightest things on screen.
 */
const bakeSky = /* glsl */ `
varying vec2 vUv;
uniform float uSeed;
${noise}
void main() {
  float phi = (vUv.x - 0.5) * 6.2831853;
  float th = (vUv.y - 0.5) * 3.1415927;
  vec3 d = vec3(cos(th) * cos(phi), sin(th), cos(th) * sin(phi));
  vec3 p = d + uSeed;

  vec3 bandN = normalize(vec3(0.32, 0.86, -0.4));
  float b = dot(d, bandN);
  float band = exp(-b * b * 22.0);
  float core = exp(-pow(length(d - normalize(vec3(-0.6, -0.12, 0.79))), 2.0) * 3.0);

  vec3 q = vec3(fbm(p * 1.6, 5), fbm(p * 1.6 + 5.2, 5), fbm(p * 1.6 + 11.7, 5));
  float clouds = fbm(p * 2.2 + q * 1.8, 7) * 0.5 + 0.5;
  float fine = fbm(p * 8.0 + q * 1.2, 6) * 0.5 + 0.5;
  float dust = smoothstep(0.48, 0.82, fbm(p * 4.6 + q * 2.4, 6) * 0.5 + 0.5);

  vec3 col = vec3(0.0035, 0.0045, 0.011);
  float neb = pow(clouds, 3.2);
  vec3 tint = mix(vec3(0.035, 0.09, 0.2), vec3(0.2, 0.045, 0.17), smoothstep(-0.25, 0.35, q.x));
  col += tint * neb * (0.22 + band * 1.1);
  col += vec3(0.3, 0.17, 0.085) * pow(fine, 3.5) * band * (0.5 + core * 1.8);
  col += vec3(0.85, 0.8, 0.74) * pow(fine, 6.0) * band * core * 0.7;
  col *= 1.0 - dust * band * 0.88;
  col *= 0.42;

  gl_FragColor = vec4(col, 1.0);
}
`;

const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position.z = gl_Position.w; // on the far plane, behind everything
}
`;

const skyFragment = /* glsl */ `
varying vec3 vDir;
uniform sampler2D uMap;
void main() {
  vec3 d = normalize(vDir);
  vec2 uv = vec2(atan(d.z, d.x) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5);
  gl_FragColor = vec4(texture2D(uMap, uv).rgb, 1.0);
}
`;

/** Renders a full-screen shader once into a texture. */
export function bake(gl: THREE.WebGLRenderer, target: THREE.WebGLRenderTarget, fragmentShader: string, uniforms: Record<string, THREE.IUniform>) {
  const material = new THREE.ShaderMaterial({ vertexShader: fullscreen, fragmentShader, uniforms, depthTest: false, depthWrite: false });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const previous = gl.getRenderTarget();
  gl.setRenderTarget(target);
  gl.render(quad, camera);
  gl.setRenderTarget(previous);
  material.dispose();
  quad.geometry.dispose();
}

export function Sky({ tier }: { tier: Tier }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const sphere = useRef<THREE.Mesh>(null);

  const target = useMemo(() => {
    const [w, h] = tier === 'high' ? [2048, 1024] : [1024, 512];
    const t = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
      depthBuffer: false,
    });
    bake(gl, t, bakeSky, { uSeed: { value: 3.7 } });
    return t;
  }, [gl, tier]);
  useEffect(() => () => target.dispose(), [target]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        uniforms: { uMap: { value: target.texture } },
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    [target],
  );
  useEffect(() => () => material.dispose(), [material]);

  // The sky is infinitely far: it travels with the camera.
  useFrame(() => sphere.current?.position.copy(camera.position));

  return (
    <mesh ref={sphere} material={material} renderOrder={-1000} frustumCulled={false}>
      <sphereGeometry args={[100, 48, 24]} />
    </mesh>
  );
}

/** Colours of stars by spectral class, from cool red dwarfs to hot blue giants (linear RGB). */
const CLASSES: [number, [number, number, number]][] = [
  [0.38, [1.0, 0.55, 0.32]],
  [0.3, [1.0, 0.72, 0.5]],
  [0.14, [1.0, 0.88, 0.74]],
  [0.09, [0.95, 0.95, 1.0]],
  [0.06, [0.74, 0.82, 1.0]],
  [0.03, [0.58, 0.7, 1.0]],
];

const starVertex = /* glsl */ `
attribute float aSize;
attribute vec3 aColor;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vSize;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio;
  vColor = aColor;
  vSize = aSize;
}
`;

const starFragment = /* glsl */ `
varying vec3 vColor;
varying float vSize;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float core = exp(-dot(c, c) * 9.0);
  // Diffraction spikes on the brightest stars, as a telescope would draw them.
  float spikes = 0.0;
  if (vSize > 7.0) {
    spikes = exp(-abs(c.x) * 40.0) * exp(-abs(c.y) * 3.5) + exp(-abs(c.y) * 40.0) * exp(-abs(c.x) * 3.5);
  }
  float a = core + spikes * 0.55;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vColor * a, 1.0);
}
`;

/** The visible stars: real-looking colours and brightnesses, thicker along the galactic band. */
export function Stars({ tier }: { tier: Tier }) {
  const camera = useThree((s) => s.camera);
  const dpr = useThree((s) => s.viewport.dpr);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = tier === 'high' ? 12000 : 5000;
    const rnd = random(20261122);
    const bandN = new THREE.Vector3(0.32, 0.86, -0.4).normalize();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const d = new THREE.Vector3();
    for (let i = 0; i < count; ) {
      d.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
      const l = d.length();
      if (l > 1 || l < 0.01) continue;
      d.divideScalar(l);
      const b = d.dot(bandN);
      if (rnd() > 0.3 + 0.7 * Math.exp(-b * b * 10)) continue;
      pos.set([d.x * 1500, d.y * 1500, d.z * 1500], i * 3);
      let pick = rnd();
      let c = CLASSES[0]![1];
      for (const [share, rgb] of CLASSES) {
        if (pick < share) {
          c = rgb;
          break;
        }
        pick -= share;
      }
      // Most stars are faint; a few are bright; a handful are bright enough to show spikes.
      const roll = rnd();
      const k = rnd();
      const [s, intensity] = roll < 0.972 ? [1.2 + k * 1.1, 0.05 + k * k * 0.45] : roll < 0.997 ? [2.4 + k * 2.6, 0.5 + k * 1.1] : [8.5 + k * 3.5, 1.8 + k * 2.6];
      col.set([c[0] * intensity, c[1] * intensity, c[2] * intensity], i * 3);
      size[i] = s;
      i++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    return g;
  }, [tier]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starVertex,
        fragmentShader: starFragment,
        uniforms: { uPixelRatio: { value: 1 } },
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    material.uniforms.uPixelRatio!.value = dpr;
  }, [material, dpr]);

  useFrame(() => points.current?.position.copy(camera.position));

  return <points ref={points} geometry={geometry} material={material} renderOrder={-900} frustumCulled={false} />;
}
