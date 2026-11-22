import * as THREE from 'three';
import type { Orbit } from '@/lib/universe';

/** Angle along the orbit at a given system time. Orbits run anticlockwise seen from above. */
export function orbitAngle(orbit: Orbit, time: number): number {
  return orbit.phase + (time / orbit.period) * Math.PI * 2;
}

/** The orbit's own plane, as a rotation: tilted by its inclination, turned to its node. */
export function orbitPlane(orbit: Orbit): THREE.Euler {
  return new THREE.Euler(orbit.inclination, orbit.node, 0, 'YXZ');
}

const euler = new THREE.Euler();

/** Where a world is at a given system time, in world space. */
export function positionOnOrbit(orbit: Orbit, time: number, out: THREE.Vector3): THREE.Vector3 {
  const a = orbitAngle(orbit, time);
  out.set(Math.cos(a) * orbit.radius, 0, -Math.sin(a) * orbit.radius);
  euler.set(orbit.inclination, orbit.node, 0, 'YXZ');
  return out.applyEuler(euler);
}

/** Points along an orbit's circle, in the orbit's plane. */
export function orbitCircle(radius: number, segments = 256): THREE.Vector3[] {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, -Math.sin(a) * radius);
  });
}
