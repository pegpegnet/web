'use client';

/**
 * RetroPong: a Pong table you can actually play. A physical table in the game's phosphor green:
 * glossy plastic paddles, a glowing ball that lights the table as it passes, the classic dashed
 * net and a score. Move the pointer (or drag sideways on a phone) to control the near paddle; the
 * far one is the CPU. With nobody playing, both paddles play each other, like an arcade attract mode.
 */
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { textTexture } from '@/components/three/textTexture';
import { StudioLight } from '@/components/three/StudioLight';
import { useQuality } from '@/components/three/QualityProvider';

const W = 3.4; // table width (x)
const L = 4.6; // table length (z)
const PADDLE_W = 0.8;
const BALL_R = 0.09;
const GREEN = '#3dff6e';

/** Faint scanlines, so the table reads as an old phosphor screen laid flat. */
function scanlines() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0a130b';
  ctx.fillRect(0, 0, 4, 256);
  ctx.fillStyle = '#10200f';
  for (let y = 0; y < 256; y += 4) ctx.fillRect(0, y, 4, 2);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 6);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type Game = { x: number; z: number; vx: number; vz: number; player: number; cpu: number; you: number; them: number; serve: number };

export function RetroPongScene() {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const surface = useMemo(scanlines, []);
  const game = useRef<Game>({ x: 0, z: 0, vx: 1.1, vz: 2.2, player: 0, cpu: 0, you: 0, them: 0, serve: 0 });
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const scoreTex = useMemo(
    () => textTexture(`${score[1]}   ${score[0]}`, { font: '800 120px "Anybody Variable", sans-serif', color: GREEN, width: 512, height: 160, align: 'center' }),
    [score],
  );
  const playing = useRef(false);
  const ball = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const you = useRef<THREE.Mesh>(null);
  const cpu = useRef<THREE.Mesh>(null);
  const table = useRef<THREE.Group>(null);

  const serve = (towardPlayer: boolean) => {
    const g = game.current;
    g.x = 0;
    g.z = 0;
    g.vx = (Math.random() - 0.5) * 2.2;
    g.vz = towardPlayer ? 2.3 : -2.3;
    g.serve = 0.6; // brief pause before the ball moves
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const g = game.current;
    const limit = W / 2 - PADDLE_W / 2;

    // Paddles. The player's follows the pointer while it is over the scene; otherwise it plays itself.
    const target = playing.current ? state.pointer.x * (W / 2) * 1.15 : g.x * 0.85;
    g.player += (THREE.MathUtils.clamp(target, -limit, limit) - g.player) * Math.min(1, dt * (playing.current ? 18 : 5));
    g.cpu += (THREE.MathUtils.clamp(g.x, -limit, limit) - g.cpu) * Math.min(1, dt * 4.2);

    if (!(still && !playing.current)) {
      if (g.serve > 0) g.serve -= dt;
      else {
        g.x += g.vx * dt;
        g.z += g.vz * dt;
        // Side walls
        if (Math.abs(g.x) > W / 2 - BALL_R) {
          g.x = Math.sign(g.x) * (W / 2 - BALL_R);
          g.vx *= -1;
        }
        // Paddles: bounce with an angle set by where the ball hits, a little faster each time.
        const hit = (paddleX: number, dir: 1 | -1) => {
          const off = (g.x - paddleX) / (PADDLE_W / 2);
          if (Math.abs(off) > 1.15) return false;
          const speed = Math.min(5.5, Math.hypot(g.vx, g.vz) * 1.05);
          const angle = off * 0.9;
          g.vx = Math.sin(angle) * speed;
          g.vz = -dir * Math.cos(angle) * speed;
          return true;
        };
        const near = L / 2 - 0.25;
        if (g.vz > 0 && g.z > near - BALL_R && g.z < near + 0.2 && hit(g.player, 1)) g.z = near - BALL_R;
        if (g.vz < 0 && g.z < -near + BALL_R && g.z > -near - 0.2 && hit(g.cpu, -1)) g.z = -near + BALL_R;
        // Points
        if (g.z > L / 2 + 0.3) {
          g.them++;
          setScore([g.you, g.them]);
          serve(false);
        } else if (g.z < -L / 2 - 0.3) {
          g.you++;
          setScore([g.you, g.them]);
          serve(true);
        }
      }
    }

    ball.current?.position.set(g.x, BALL_R, g.z);
    glow.current?.position.set(g.x, 0.35, g.z);
    you.current?.position.set(g.player, 0.09, L / 2 - 0.2);
    cpu.current?.position.set(g.cpu, 0.09, -L / 2 + 0.2);
    if (table.current) table.current.rotation.y = THREE.MathUtils.lerp(table.current.rotation.y, playing.current ? 0 : state.pointer.x * 0.08, 0.05);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5.6, 6]} fov={34} onUpdate={(c) => c.lookAt(0, -0.35, 0)} />
      <StudioLight />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 6, 3]} intensity={0.8} />
      <group
        ref={table}
        onPointerEnter={() => (playing.current = true)}
        onPointerLeave={() => (playing.current = false)}
      >
        {/* Body of the table and its playfield */}
        <RoundedBox args={[W + 0.5, 0.3, L + 0.5]} radius={0.12} smoothness={4} position={[0, -0.17, 0]}>
          <meshPhysicalMaterial color="#1b2a1c" roughness={0.45} clearcoat={0.6} />
        </RoundedBox>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
          <planeGeometry args={[W, L]} />
          <meshStandardMaterial map={surface} roughness={0.6} />
        </mesh>
        {/* The dashed net */}
        {Array.from({ length: 11 }, (_, i) => (
          <mesh key={i} position={[-W / 2 + 0.16 + i * ((W - 0.32) / 10), 0.01, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.12, 0.05]} />
            <meshBasicMaterial color={GREEN} transparent opacity={0.55} toneMapped={false} />
          </mesh>
        ))}
        {/* Paddles: glossy arcade plastic */}
        <RoundedBox ref={you} args={[PADDLE_W, 0.16, 0.16]} radius={0.07} smoothness={4}>
          <meshPhysicalMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.35} roughness={0.2} clearcoat={1} />
        </RoundedBox>
        <RoundedBox ref={cpu} args={[PADDLE_W, 0.16, 0.16]} radius={0.07} smoothness={4}>
          <meshPhysicalMaterial color="#e9ffe9" emissive={GREEN} emissiveIntensity={0.12} roughness={0.25} clearcoat={1} />
        </RoundedBox>
        {/* The ball, and the light it throws on the table */}
        <mesh ref={ball}>
          <sphereGeometry args={[BALL_R, 32, 16]} />
          <meshBasicMaterial color="#eaffee" toneMapped={false} />
        </mesh>
        <pointLight ref={glow} color={GREEN} intensity={2.4} distance={1.8} decay={2} />
        {/* Score, floating above the far end: CPU on the left, you on the right */}
        <mesh position={[0, 0.75, -L / 2 - 0.2]}>
          <planeGeometry args={[1.6, 0.5]} />
          <meshBasicMaterial map={scoreTex} transparent toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
