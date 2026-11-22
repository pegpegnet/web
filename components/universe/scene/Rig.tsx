'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraControls, CameraControlsImpl } from '@react-three/drei';
import * as THREE from 'three';
import { getWorld, type World } from '@/lib/universe';
import { clock, universe } from '../store';
import { positionOnOrbit } from './orbits';

const { ACTION } = CameraControlsImpl;

/** Where the camera starts: above the system's plane, looking in towards the star. */
export const OVERVIEW = { position: [-38, 52, 168] as const, target: [0, 0, 12] as const };

const UP = new THREE.Vector3(0, 1, 0);

/** The overview, pulled back on tall screens so the whole system still fits across. */
function overview(aspect: number): [number, number, number, number, number, number] {
  const k = Math.max(1, 0.9 / aspect);
  const [x, y, z] = OVERVIEW.position;
  const [tx, ty, tz] = OVERVIEW.target;
  return [tx + (x - tx) * k, ty + (y - ty) * k, tz + (z - tz) * k, tx, ty, tz];
}

/** How far to stand from a world so it, its rings and its nearest moon fill the view nicely. */
function framing(w: World, aspect: number) {
  const reach = w.radius * (w.rings ? w.rings.outer * 1.05 : 1.25);
  // Tall screens need more distance to fit the world's width.
  return reach * 3.1 * Math.max(1, 0.95 / aspect);
}

/**
 * The camera. Drag to orbit, scroll or pinch to zoom; no panning, so nobody gets lost. In the
 * overview it drifts slowly round the star when left alone. Focusing a world flies there and
 * slows the orbits to a stop; the camera then circles that world until the visitor goes back.
 */
export function Rig({ still }: { still: boolean }) {
  const controls = useRef<CameraControlsImpl>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const idle = useRef(0);
  const flight = useRef<{ world: World | null; flying: boolean; since: number }>({ world: null, flying: false, since: 0 });
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), dir: new THREE.Vector3(), side: new THREE.Vector3(), cam: new THREE.Vector3() }), []);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.mouseButtons.right = ACTION.NONE;
    c.mouseButtons.middle = ACTION.DOLLY;
    c.touches.two = ACTION.TOUCH_DOLLY;
    c.touches.three = ACTION.NONE;
    c.setLookAt(...overview(camera.aspect), false);

    const go = () => {
      const slug = universe.get().focus;
      const world = slug ? (getWorld(slug) ?? null) : null;
      if (world === flight.current.world) return;
      flight.current = { world, flying: true, since: 0 };
      if (world) {
        c.dollyToCursor = false;
        c.minDistance = world.radius * 1.35;
        c.maxDistance = Math.max(world.radius * 16, 18);
        c.smoothTime = still ? 0.15 : 0.75;
      } else {
        c.dollyToCursor = true;
        c.minDistance = 8;
        c.maxDistance = 420;
        c.smoothTime = still ? 0.15 : 0.9;
        c.setLookAt(...overview(camera.aspect), true);
      }
    };
    go();
    const unsubscribe = universe.subscribe(go);
    // A drag or zoom takes over from any flight in progress.
    const takeOver = () => {
      idle.current = 0;
      flight.current.flying = false;
      c.smoothTime = 0.4;
    };
    c.addEventListener('controlstart', takeOver);
    return () => {
      unsubscribe();
      c.removeEventListener('controlstart', takeOver);
    };
  }, [still, camera]);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    const f = flight.current;

    // Orbits slow to a stop while a world is in focus, and pick up again after.
    if (!still) clock.scale += ((f.world ? 0 : 1) - clock.scale) * Math.min(1, dt * 2.2);

    if (f.flying) {
      f.since += dt;
      if (f.world) {
        // Follow the world while it slows down: stand off its day side at three-quarters, so the
        // terminator shows, a little above its plane.
        const p = positionOnOrbit(f.world.orbit, clock.time, tmp.p);
        tmp.dir.copy(p).multiplyScalar(-1).normalize();
        tmp.side.crossVectors(UP, tmp.dir).normalize();
        tmp.cam
          .copy(tmp.dir)
          .multiplyScalar(0.5)
          .addScaledVector(tmp.side, 0.82)
          .addScaledVector(UP, 0.3)
          .normalize()
          .multiplyScalar(framing(f.world, camera.aspect))
          .add(p);
        c.setLookAt(tmp.cam.x, tmp.cam.y, tmp.cam.z, p.x, p.y, p.z, true);
      }
      if (f.since > (f.world ? 2.6 : 2.2)) {
        f.flying = false;
        c.smoothTime = 0.4;
      }
    } else if (!f.world) {
      idle.current += dt;
      if (!still && idle.current > 4) c.azimuthAngle += dt * 0.012;
    }

    // Keep the depth range tight around what's being looked at, so close-ups stay sharp.
    const near = Math.min(Math.max(c.distance * 0.004, 0.01), 1);
    if (Math.abs(near - camera.near) / camera.near > 0.1) {
      camera.near = near;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={8}
      maxDistance={420}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI - 0.12}
      smoothTime={0.4}
      draggingSmoothTime={0.14}
      dollySpeed={0.5}
      azimuthRotateSpeed={0.6}
      polarRotateSpeed={0.6}
      dollyToCursor
    />
  );
}
