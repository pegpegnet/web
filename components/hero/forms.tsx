'use client';

/**
 * The two PegPeg forms.
 *
 *   Block: a chunky rounded tile in glossy volt-blue ceramic with a round hole through it,
 *          like a piece of pegboard (or an app icon with a way in).
 *   Peg:   an ember glass peg with a brushed-metal collar, turned on a lathe.
 *
 * The peg's shaft is slightly thinner than the hole, so in a later PR it can slide in.
 */
import { forwardRef, useMemo } from 'react';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { Tier } from '@/lib/quality';

export const HOLE_RADIUS = 0.42;
export const SHAFT_RADIUS = 0.36;
export const BLOCK_DEPTH = 0.7;

function blockGeometry() {
  const size = 2.2;
  const r = 0.55;
  const h = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h);
  shape.quadraticCurveTo(h, -h, h, -h + r);
  shape.lineTo(h, h - r);
  shape.quadraticCurveTo(h, h, h - r, h);
  shape.lineTo(-h + r, h);
  shape.quadraticCurveTo(-h, h, -h, h - r);
  shape.lineTo(-h, -h + r);
  shape.quadraticCurveTo(-h, -h, -h + r, -h);
  const hole = new THREE.Path();
  hole.absarc(0, 0, HOLE_RADIUS, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: BLOCK_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.14,
    bevelSegments: 12,
    curveSegments: 64,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function pegGeometry() {
  // Profile from the tip (bottom) to the top of the head, as [radius, height].
  const profile: [number, number][] = [
    [0, -0.95],
    [0.22, -0.93],
    [0.32, -0.88],
    [SHAFT_RADIUS, -0.78],
    [SHAFT_RADIUS, 0.42],
    [0.4, 0.48],
    [0.58, 0.54],
    [0.64, 0.62],
    [0.63, 0.72],
    [0.56, 0.84],
    [0.42, 0.93],
    [0.22, 0.98],
    [0, 0.99],
  ];
  const curve = new THREE.SplineCurve(profile.map(([x, y]) => new THREE.Vector2(x, y)));
  return new THREE.LatheGeometry(curve.getPoints(80), 96);
}

export const Block = forwardRef<THREE.Mesh, { tier: Tier }>(function Block(_props, ref) {
  const geometry = useMemo(blockGeometry, []);
  return (
    <mesh ref={ref} geometry={geometry} castShadow>
      <meshPhysicalMaterial
        color="#2b3bff"
        roughness={0.2}
        metalness={0}
        envMapIntensity={0.9}
        clearcoat={1}
        clearcoatRoughness={0.06}
      />
    </mesh>
  );
});

// What the glass "sees" through itself: the warm page colour, so the peg reads as lit orange glass, not dark amber.
const GLASS_BACKDROP = new THREE.Color('#f4e2d4');

export const Peg = forwardRef<THREE.Group, { tier: Tier }>(function Peg({ tier }, ref) {
  const geometry = useMemo(pegGeometry, []);
  return (
    <group ref={ref}>
      <mesh geometry={geometry} castShadow>
        {tier === 'high' ? (
          <MeshTransmissionMaterial
            color="#ff8a3a"
            thickness={0.9}
            roughness={0.08}
            ior={1.42}
            chromaticAberration={0.05}
            anisotropicBlur={0.2}
            distortion={0.12}
            distortionScale={0.4}
            temporalDistortion={0.05}
            samples={6}
            resolution={512}
            backside
            backsideThickness={0.4}
            background={GLASS_BACKDROP}
          />
        ) : (
          <meshPhysicalMaterial color="#ff5b14" roughness={0.12} transmission={0.55} thickness={0.8} ior={1.42} clearcoat={1} />
        )}
      </mesh>
      {/* Brushed-metal collar under the head */}
      <mesh position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.385, 0.055, 24, 96]} />
        <meshPhysicalMaterial color="#d8d4cc" metalness={1} roughness={0.32} anisotropy={0.9} anisotropyRotation={Math.PI / 2} />
      </mesh>
    </group>
  );
});
