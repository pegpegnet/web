'use client';

/**
 * Light moving through blue glaze: the inside of the block the hero's camera flew into. A custom
 * fragment shader draws soft caustics in volt, with ripples where the pointer moves. Highlights
 * are capped at a 10% mix toward white so bone text on top keeps at least 4.6:1 contrast, and the
 * effect fades to flat volt at the top edge, where the hero's last frame hands over.
 */
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useQuality } from '@/components/three/QualityProvider';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;   // 0..1, pointer position over the panel
  uniform float uPress;    // 0..1, how recently the pointer moved
  uniform int uSteps;
  uniform vec3 uBase;

  // Iterated warping that produces caustic light lines (after the classic "tileable water caustic").
  float caustic(vec2 p, float t) {
    vec2 i = p;
    float c = 1.0;
    float inten = 0.005;
    for (int n = 0; n < 6; n++) {
      if (n >= uSteps) break;
      float tt = t * (1.0 - (3.5 / float(n + 1)));
      i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
      c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
    }
    c /= float(uSteps);
    c = 1.17 - pow(c, 1.4);
    return pow(abs(c), 8.0);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
    // Pointer ripple: rings spreading from the pointer, bending the caustics.
    vec2 d = (uv - uPointer) * aspect;
    float r = length(d);
    float ripple = sin(r * 38.0 - uTime * 6.0) * exp(-r * 6.0) * uPress;
    vec2 p = uv * aspect * 1.6 + d * ripple * 0.35;
    float light = caustic(mod(p * 6.28318, 6.28318) - 250.0, uTime * 0.35 + 23.0);
    light = clamp(light, 0.0, 1.0);
    // Fade out toward the top edge so it meets the hero's flat blue without a seam.
    float fade = smoothstep(0.98, 0.55, uv.y);
    float k = 0.10 * light * fade + 0.025 * ripple * fade;
    gl_FragColor = vec4(mix(uBase, vec3(1.0), clamp(k, 0.0, 0.10)), 1.0);
  }
`;

export function BlueCaustics() {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const size = useThree((s) => s.size);
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.3));
  const press = useRef(0);
  const last = useRef(new THREE.Vector2());
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.3) },
      uPress: { value: 0 },
      uSteps: { value: quality?.tier === 'high' ? 5 : 3 },
      uBase: { value: new THREE.Color('#2b3bff').convertLinearToSRGB() },
    }),
    [quality?.tier],
  );

  useFrame((state, dt) => {
    const m = material.current;
    if (!m) return;
    if (!still) m.uniforms.uTime!.value += dt;
    m.uniforms.uRes!.value.set(size.width, size.height);
    // Pointer in panel space; ripples strengthen while it moves and calm when it stops.
    const px = state.pointer.x * 0.5 + 0.5;
    const py = state.pointer.y * 0.5 + 0.5;
    const moved = Math.hypot(px - last.current.x, py - last.current.y);
    last.current.set(px, py);
    press.current = Math.min(1, press.current * Math.pow(0.25, dt) + moved * 8);
    pointer.current.lerp(new THREE.Vector2(px, py), Math.min(1, dt * 6));
    m.uniforms.uPointer!.value.copy(pointer.current);
    m.uniforms.uPress!.value = still ? 0 : press.current;
  });

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 1]} />
      <mesh frustumCulled={false}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} toneMapped={false} />
      </mesh>
    </>
  );
}
