'use client';

/**
 * Every 3D scene, loaded on demand. Each import below becomes its own chunk, so three.js and drei
 * download after the page has hydrated instead of blocking it. They render inside a canvas, where
 * React Three Fiber's own Suspense boundary waits for them.
 *
 * Exported as plain components (not the lazy objects themselves), because server components
 * reference them across the server/client boundary.
 */
import { lazy, type ComponentProps } from 'react';

const Hero = lazy(() => import('./hero/HeroScene').then((m) => ({ default: m.HeroScene })));
const Yutub = lazy(() => import('./work/scenes/YutubScene').then((m) => ({ default: m.YutubScene })));
const SocialPreview = lazy(() => import('./work/scenes/SocialPreviewScene').then((m) => ({ default: m.SocialPreviewScene })));
const RetroPong = lazy(() => import('./work/scenes/RetroPongScene').then((m) => ({ default: m.RetroPongScene })));
const MixMaster = lazy(() => import('./work/scenes/MixMasterScene').then((m) => ({ default: m.MixMasterScene })));
const Caustics = lazy(() => import('./work/BlueCaustics').then((m) => ({ default: m.BlueCaustics })));
const Dock = lazy(() => import('./opensource/DockScene').then((m) => ({ default: m.DockScene })));
const Services = lazy(() => import('./services/ServiceObjects').then((m) => ({ default: m.ServiceObjects })));
const Board = lazy(() => import('./contact/PegBoard').then((m) => ({ default: m.PegBoard })));

export function HeroScene(props: ComponentProps<typeof Hero>) {
  return <Hero {...props} />;
}
export function YutubScene() {
  return <Yutub />;
}
export function SocialPreviewScene() {
  return <SocialPreview />;
}
export function RetroPongScene() {
  return <RetroPong />;
}
export function MixMasterScene() {
  return <MixMaster />;
}
export function BlueCaustics() {
  return <Caustics />;
}
export function DockScene(props: ComponentProps<typeof Dock>) {
  return <Dock {...props} />;
}
export function ServiceObjects() {
  return <Services />;
}
export function PegBoard() {
  return <Board />;
}
