'use client';

import { Environment, Lightformer } from '@react-three/drei';

/**
 * Soft studio reflections from light panels, shared by the scenes. No HDR download. `backdrop` is
 * what metals and glazes reflect between the panels: dark for dark sections, pale for light ones.
 */
export function StudioLight({ warm = false, backdrop = '#2a2b30' }: { warm?: boolean; backdrop?: string }) {
  return (
    <Environment resolution={128} frames={1}>
      <color attach="background" args={[backdrop]} />
      <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={1.6} color={warm ? '#ffe7cf' : '#eef1ff'} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[3, 8, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[3, 8, 1]} />
    </Environment>
  );
}
