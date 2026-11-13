'use client';

/**
 * Socialpreviewbot: a Telegram chat that plays itself. An Instagram link goes out, the bot types,
 * and a preview card unfolds in reply. Around the chat, a post and a story drift in space, in the
 * bot's own gradient. Click to send the link again; the pointer tilts the whole conversation.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { roundedRect } from '@/components/three/shapes';
import { textTexture } from '@/components/three/textTexture';
import { StudioLight } from '@/components/three/StudioLight';
import { useQuality } from '@/components/three/QualityProvider';
import { spring, stepSpring } from '@/lib/spring';

const LOOP = 9; // seconds per conversation
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function Card({ w, h, r, children, ...rest }: { w: number; h: number; r: number; children?: React.ReactNode } & ThreeElements['group']) {
  const geo = useMemo(() => roundedRect(w, h, r), [w, h, r]);
  return (
    <group {...rest}>
      <mesh geometry={geo}>{children}</mesh>
    </group>
  );
}

function PlayIcon({ size = 0.14, ...rest }: { size?: number } & ThreeElements['mesh']) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-size * 0.4, -size * 0.5);
    s.lineTo(size * 0.6, 0);
    s.lineTo(-size * 0.4, size * 0.5);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [size]);
  return (
    <mesh geometry={geo} {...rest}>
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </mesh>
  );
}

export function SocialPreviewScene() {
  const quality = useQuality();
  const still = quality?.still ?? false;
  const [gradient, avatar] = useTexture(['/work/bg-bot.webp', '/work/telegram-bot.webp']);
  useEffect(() => {
    for (const t of [gradient, avatar]) if (t) t.colorSpace = THREE.SRGBColorSpace;
  }, [gradient, avatar]);

  const link = useMemo(() => textTexture('instagram.com/reel/…', { color: '#ffffff', width: 1024, height: 128 }), []);
  const caption = useMemo(() => textTexture('Instagram reel', { font: '600 40px "Schibsted Grotesk Variable", sans-serif', width: 1024, height: 128 }), []);

  const root = useRef<THREE.Group>(null);
  const out = useRef<THREE.Group>(null);
  const typing = useRef<THREE.Group>(null);
  const preview = useRef<THREE.Group>(null);
  const post = useRef<THREE.Group>(null);
  const story = useRef<THREE.Group>(null);
  const start = useRef(0);
  const clock = useThree((st) => st.clock);
  const springs = useRef({ out: spring(), typing: spring(), preview: spring(), yaw: spring(), pitch: spring() });

  useFrame((state, dt) => {
    const t = still ? 6 : (state.clock.elapsedTime - start.current) % LOOP;
    const s = springs.current;
    // Beats: link sent at 0.4 s, bot typing 1.3–2.6 s, preview from 2.6 s, all cleared at 8.2 s.
    const sent = t > 0.4 && t < 8.2 ? 1 : 0;
    const isTyping = t > 1.3 && t < 2.6 ? 1 : 0;
    const shown = t > 2.6 && t < 8.2 ? 1 : 0;

    const o = stepSpring(s.out, sent, dt, 150, 14);
    if (out.current) {
      out.current.position.x = 0.75 + (1 - o) * 1.2;
      out.current.scale.setScalar(Math.max(0.001, o));
    }
    const ty = stepSpring(s.typing, isTyping, dt, 200, 16);
    if (typing.current) {
      typing.current.scale.setScalar(Math.max(0.001, ty));
      typing.current.children.slice(1).forEach((dot, i) => {
        dot.position.y = Math.max(0, Math.sin(state.clock.elapsedTime * 9 - i * 0.9)) * 0.05;
      });
    }
    const pv = stepSpring(s.preview, shown, dt, 110, 12);
    if (preview.current) {
      // Unfolds like a card turned up from the table.
      preview.current.rotation.x = (1 - clamp01(pv)) * -1.4;
      preview.current.scale.setScalar(Math.max(0.001, 0.6 + 0.4 * pv));
      preview.current.visible = pv > 0.01;
    }

    const time = state.clock.elapsedTime;
    if (post.current) {
      post.current.position.y = 0.9 + (still ? 0 : Math.sin(time * 0.8) * 0.12);
      post.current.rotation.z = -0.12 + (still ? 0 : Math.sin(time * 0.5) * 0.05);
    }
    if (story.current) {
      story.current.position.y = -0.55 + (still ? 0 : Math.sin(time * 0.7 + 2) * 0.14);
      story.current.rotation.z = 0.1 + (still ? 0 : Math.sin(time * 0.6 + 1) * 0.05);
    }
    if (root.current) {
      root.current.rotation.y = stepSpring(s.yaw, -0.18 + state.pointer.x * 0.25, dt, 30, 9);
      root.current.rotation.x = stepSpring(s.pitch, -state.pointer.y * 0.1, dt, 30, 9);
    }
  });

  if (!gradient || !avatar) return null;
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7.8]} fov={32} />
      <StudioLight warm />
      <ambientLight intensity={0.8} />
      <group
        ref={root}
        onClick={(e) => {
          // Send the link again: restart the conversation from the top.
          e.stopPropagation();
          start.current = clock.elapsedTime;
        }}
      >
        {/* The chat column */}
        <Card w={3.1} h={3.5} r={0.28} position={[0, 0.05, -0.05]}>
          <meshBasicMaterial color="#fbf8f4" transparent opacity={0.9} toneMapped={false} />
        </Card>

        {/* Outgoing: the Instagram link */}
        <group ref={out} position={[0.75, 1.15, 0.05]}>
          <Card w={1.6} h={0.36} r={0.18}>
            <meshBasicMaterial color="#c4268a" toneMapped={false} />
          </Card>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.46, 0.18]} />
            <meshBasicMaterial map={link} transparent toneMapped={false} />
          </mesh>
        </group>

        {/* The bot: avatar, typing dots, then the preview */}
        <mesh position={[-1.15, 0.45, 0.05]}>
          <circleGeometry args={[0.2, 48]} />
          <meshBasicMaterial map={avatar} toneMapped={false} />
        </mesh>
        <group ref={typing} position={[-0.6, 0.45, 0.05]}>
          <Card w={0.62} h={0.3} r={0.15}>
            <meshBasicMaterial color="#efece5" toneMapped={false} />
          </Card>
          {[-0.14, 0, 0.14].map((x) => (
            <mesh key={x} position={[x, 0, 0.01]}>
              <circleGeometry args={[0.04, 24]} />
              <meshBasicMaterial color="#8a8780" toneMapped={false} />
            </mesh>
          ))}
        </group>
        <group ref={preview} position={[-0.15, -0.45, 0.08]}>
          <Card w={2.3} h={1.75} r={0.16}>
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </Card>
          <Card w={2.18} h={1.3} r={0.11} position={[0, 0.17, 0.01]}>
            <meshBasicMaterial map={gradient} toneMapped={false} />
          </Card>
          <PlayIcon size={0.32} position={[0, 0.17, 0.02]} />
          <mesh position={[-0.1, -0.64, 0.01]}>
            <planeGeometry args={[1.9, 0.24]} />
            <meshBasicMaterial map={caption} transparent toneMapped={false} />
          </mesh>
        </group>

        {/* Floating media: a post and a story, in the bot's gradient */}
        <group ref={post} position={[2.3, 0.9, -0.7]}>
          <Card w={1.1} h={1.1} r={0.12}>
            <meshBasicMaterial map={gradient} toneMapped={false} />
          </Card>
        </group>
        <group ref={story} position={[-2.35, -0.55, -0.9]}>
          <Card w={0.9} h={1.6} r={0.12}>
            <meshBasicMaterial map={gradient} toneMapped={false} />
          </Card>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.27 + i * 0.27, 0.7, 0.01]}>
              <planeGeometry args={[0.23, 0.025]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={i === 0 ? 1 : 0.5} toneMapped={false} />
            </mesh>
          ))}
          <PlayIcon size={0.22} position={[0, 0, 0.01]} />
        </group>
      </group>
    </>
  );
}
