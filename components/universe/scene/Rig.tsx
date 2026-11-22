'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraControls, CameraControlsImpl } from '@react-three/drei';
import type * as THREE from 'three';

const { ACTION } = CameraControlsImpl;

/** Where the camera starts: above the system's plane, looking in towards the star. */
export const OVERVIEW = { position: [-38, 52, 168] as const, target: [0, 0, 12] as const };

/**
 * The camera: drag to orbit, scroll or pinch to zoom, no panning (so nobody gets lost). While no
 * one is touching it, the view drifts slowly round the star.
 */
export function Rig({ still }: { still: boolean }) {
  const controls = useRef<CameraControlsImpl>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const idle = useRef(0);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.mouseButtons.right = ACTION.NONE;
    c.mouseButtons.middle = ACTION.DOLLY;
    c.touches.two = ACTION.TOUCH_DOLLY;
    c.touches.three = ACTION.NONE;
    c.setLookAt(...OVERVIEW.position, ...OVERVIEW.target, false);
    const wake = () => (idle.current = 0);
    c.addEventListener('controlstart', wake);
    return () => c.removeEventListener('controlstart', wake);
  }, []);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    idle.current += dt;
    if (!still && idle.current > 4) c.azimuthAngle += dt * 0.012;

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
