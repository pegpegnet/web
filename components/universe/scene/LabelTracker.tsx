'use client';

import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STAR_RADIUS, worlds } from '@/lib/universe';
import { STAR } from '../WorldLabels';
import { clock, universe } from '../store';
import { labelElements } from '../labels';
import { positionOnOrbit } from './orbits';

/**
 * Moves each world's label next to it on screen. In the overview labels fade with distance, the
 * one under the pointer is brightest, and a label that would overlap a nearer world's steps
 * aside. With a world in focus they all do.
 */
export function LabelTracker() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const p = useMemo(() => new THREE.Vector3(), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  // Screen boxes of labels already placed this frame, to keep labels from overlapping.
  const placed = useMemo(() => [] as { x: number; y: number; w: number }[], []);
  const order = useMemo(() => worlds.map((w) => ({ w, dist: 0 })), []);
  // Label widths don't change, so measure each once rather than every frame.
  const widths = useMemo(() => new Map<string, number>(), []);

  useFrame(() => {
    const { focus, hover, ready, studio } = universe.get();
    const toPx = size.height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    // Nearer worlds (and the one under the pointer) claim their space first.
    for (const o of order) o.dist = positionOnOrbit(o.w.orbit, clock.time, p).distanceTo(camera.position) - (o.w.slug === hover ? 1e6 : 0);
    order.sort((a, b) => a.dist - b.dist);
    placed.length = 0;
    // The star's label comes first: it's the studio.
    const starEl = labelElements.get(STAR);
    if (starEl) {
      v.set(0, 0, 0).project(camera);
      const dist = camera.position.length();
      const x = (v.x * 0.5 + 0.5) * size.width + (STAR_RADIUS / dist) * toPx * 1.25 + 6;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const show = ready && !focus && !studio && v.z < 1;
      starEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateY(-50%)`;
      starEl.style.opacity = show ? '0.95' : '0';
      starEl.style.visibility = show ? 'visible' : 'hidden';
      if (show) {
        if (!widths.get(STAR)) widths.set(STAR, starEl.offsetWidth);
        placed.push({ x, y, w: widths.get(STAR) || 140 });
      }
    }
    for (const { w } of order) {
      const el = labelElements.get(w.slug);
      if (!el) continue;
      positionOnOrbit(w.orbit, clock.time, p);
      const dist = p.distanceTo(camera.position);
      v.copy(p).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width + (w.radius / dist) * toPx + 4;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      let width = widths.get(w.slug);
      if (!width) {
        width = el.offsetWidth;
        if (width) widths.set(w.slug, width);
        else width = 120;
      }
      const offscreen = v.z > 1 || x < -80 || x > size.width + 20 || y < -20 || y > size.height + 20;
      const crowded = placed.some((b) => Math.abs(b.y - y) < 16 && x < b.x + b.w + 6 && b.x < x + width + 6);
      let opacity = Math.min(0.85, Math.max(0.3, 1.15 - dist / 380));
      if (hover === w.slug) opacity = 1;
      if (focus || studio || offscreen || !ready || (crowded && hover !== w.slug)) opacity = 0;
      else placed.push({ x, y, w: width });
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateY(-50%)`;
      el.style.opacity = opacity.toFixed(2);
      el.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
    }
  });
  return null;
}
