/**
 * The PegPeg system: every listed project is a world orbiting an orange star, with a blue
 * companion star far out. This file is the system's physics and look as plain data (no three.js
 * and no project text), so any component can read it without pulling either into its bundle.
 *
 * The worlds are listed from the star outwards. The look of each one is a design choice that
 * echoes the project (an ocean world for Yutub's beach, a rust-coloured lava world for Lennon,
 * written in Rust); nothing here is a claim about the project itself.
 */

export type WorldType = 'ocean' | 'desert' | 'ice' | 'jungle' | 'gas' | 'lava' | 'toxic' | 'barren';

export type Ring = {
  /** Inner and outer edge, in planet radii */
  inner: number;
  outer: number;
  colors: [string, string];
  opacity: number;
};

export type Moon = { radius: number; distance: number; period: number; phase: number; inclination: number; color: string };

export type Orbit = {
  radius: number;
  /** Tilt of the orbit against the system's plane, radians */
  inclination: number;
  /** Where the tilted orbit crosses the plane, radians */
  node: number;
  /** Starting angle, radians */
  phase: number;
  /** Seconds per revolution at normal speed */
  period: number;
};

export type World = {
  slug: string;
  /** 1-based catalogue number, from the star outwards */
  number: number;
  type: WorldType;
  radius: number;
  /** Surface colours, from low ground (or deep ocean, or dark bands) to high, plus an accent */
  palette: [string, string, string, string];
  /** Colour of the atmosphere's glow, or null for airless worlds */
  atmosphere: string | null;
  /** Cloud cover, 0 to 1 */
  clouds: number;
  rings: Ring | null;
  moons: Moon[];
  /** Axial tilt, radians */
  tilt: number;
  /** Seconds per rotation */
  day: number;
  orbit: Orbit;
  /** Drives the procedural surface, so each world is the same on every visit */
  seed: number;
};

type Spec = Pick<World, 'slug' | 'type' | 'radius' | 'palette' | 'atmosphere' | 'clouds' | 'rings'> & { moons?: number };

/** The inner system: recent work and open source. */
const inner: Spec[] = [
  { slug: 'forest', type: 'jungle', radius: 1.05, palette: ['#0b2414', '#2f5a2a', '#8a8f5a', '#1e4f6e'], atmosphere: '#7fd6c2', clouds: 0.55, rings: null },
  { slug: 'shinymac', type: 'ice', radius: 0.9, palette: ['#2a2450', '#8f86c9', '#e9e6ff', '#c7a6ff'], atmosphere: '#c9b6ff', clouds: 0.15, rings: null },
  { slug: 'abadia', type: 'desert', radius: 1.1, palette: ['#3a2416', '#9a6a3c', '#d8b682', '#5c3a22'], atmosphere: '#e0a96b', clouds: 0.05, rings: null, moons: 1 },
  { slug: 'lennon', type: 'lava', radius: 0.85, palette: ['#0c0b0a', '#2a2622', '#5b544c', '#ff5a1f'], atmosphere: '#ff7a3a', clouds: 0, rings: null },
  {
    slug: 'mktagent',
    type: 'gas',
    radius: 1.7,
    palette: ['#3a2414', '#8a5a2e', '#e8c48a', '#f0a23a'],
    atmosphere: '#f2c37a',
    clouds: 0,
    rings: { inner: 1.35, outer: 2.3, colors: ['#c9a77a', '#6b5038'], opacity: 0.8 },
    moons: 2,
  },
  { slug: 'instavision', type: 'toxic', radius: 1.0, palette: ['#2a0f2e', '#7a2a6e', '#d65a9e', '#ffb35a'], atmosphere: '#ff7ac8', clouds: 0.35, rings: null },
  { slug: 'app-visionos-yutub', type: 'ocean', radius: 1.2, palette: ['#05223f', '#1f6f8b', '#c9b98d', '#3e6b3a'], atmosphere: '#7ab8ff', clouds: 0.45, rings: null, moons: 1 },
  { slug: 'whassap', type: 'gas', radius: 0.85, palette: ['#0d3b34', '#2d8a74', '#9fe0c8', '#e9fff6'], atmosphere: '#8ff0d0', clouds: 0, rings: null },
  { slug: 'swiftui-debug-tools', type: 'barren', radius: 0.6, palette: ['#22262e', '#5a616e', '#a9b0bd', '#0a6cff'], atmosphere: null, clouds: 0, rings: null },
];

/** Beyond the asteroid belt: the studio's earlier work. */
const outer: Spec[] = [
  {
    slug: 'telegram-bot-instagram-preview',
    type: 'gas',
    radius: 2.0,
    palette: ['#2b1a4a', '#8a3a7a', '#f2a07a', '#ffd6a0'],
    atmosphere: '#ff9ac0',
    clouds: 0,
    rings: { inner: 1.4, outer: 2.6, colors: ['#e9c2d6', '#7a4a6e'], opacity: 0.7 },
    moons: 2,
  },
  { slug: 'app-iphone-pong', type: 'barren', radius: 0.9, palette: ['#07110a', '#1c2a1f', '#4a5a4c', '#3dff6e'], atmosphere: '#3dff6e', clouds: 0, rings: null, moons: 2 },
  { slug: 'youtube-mix-videos', type: 'gas', radius: 2.5, palette: ['#4a2a14', '#b07a3e', '#efdcb6', '#c4502a'], atmosphere: '#f5d39a', clouds: 0, rings: null, moons: 3 },
  { slug: 'app-iphone-tv3', type: 'ocean', radius: 1.0, palette: ['#041a3a', '#1d4fa3', '#b9c6d6', '#5a6e4a'], atmosphere: '#6aa4ff', clouds: 0.5, rings: null },
  { slug: 'app-iphone-futbol-club-barcelona-zigazaga', type: 'gas', radius: 1.6, palette: ['#141f3d', '#2a3f7a', '#7a2438', '#e8c46a'], atmosphere: '#9aa8ff', clouds: 0, rings: null, moons: 1 },
  { slug: 'app-iphone-sumophoto', type: 'desert', radius: 0.8, palette: ['#3a1208', '#9a3a1e', '#d9825a', '#f2c29a'], atmosphere: '#e08a5a', clouds: 0.05, rings: null },
  { slug: 'app-iphone-ipad-microsite', type: 'lava', radius: 0.9, palette: ['#120606', '#3a1412', '#6a3a34', '#ff2a1a'], atmosphere: '#ff5a3a', clouds: 0, rings: null, moons: 1 },
  { slug: 'app-iphone-bac', type: 'toxic', radius: 0.8, palette: ['#0f2414', '#3f6a2a', '#c9d27a', '#e6ff7a'], atmosphere: '#b6ff9a', clouds: 0.4, rings: null },
  { slug: 'gestor-de-contenidos-administrador', type: 'barren', radius: 0.7, palette: ['#1c1f26', '#4a5260', '#9aa3b4', '#2b3bff'], atmosphere: null, clouds: 0, rings: null },
  {
    slug: 'crackovia',
    type: 'gas',
    radius: 1.3,
    palette: ['#3a0f14', '#a8323a', '#f0dccb', '#ffffff'],
    atmosphere: '#ffb0a0',
    clouds: 0,
    rings: { inner: 1.5, outer: 2.1, colors: ['#e8d2c2', '#8a3a3a'], opacity: 0.5 },
  },
  { slug: 'probrowser', type: 'ice', radius: 0.7, palette: ['#0a2a4a', '#3f7ac0', '#e6f2ff', '#9fd2ff'], atmosphere: '#9fd2ff', clouds: 0.1, rings: null },
  { slug: 'air-guitar', type: 'lava', radius: 0.75, palette: ['#140804', '#4a1f0e', '#7a4a30', '#ff6a1a'], atmosphere: null, clouds: 0, rings: null },
  { slug: 'tmb', type: 'ocean', radius: 0.9, palette: ['#012a4a', '#0078c1', '#9fe6ff', '#4a7a5a'], atmosphere: '#5ab8ff', clouds: 0.45, rings: null },
  { slug: 'cruzcampo', type: 'desert', radius: 0.8, palette: ['#4a3010', '#b5862e', '#f2d27a', '#b5121b'], atmosphere: '#f2c96a', clouds: 0.05, rings: null },
  { slug: 'mattel-pixelchix', type: 'toxic', radius: 0.7, palette: ['#3a0a24', '#b02a74', '#f6a6d2', '#ffe0f2'], atmosphere: '#ff8ad0', clouds: 0.3, rings: null },
  {
    slug: 'caravana-donettes',
    type: 'gas',
    radius: 1.1,
    palette: ['#2a160c', '#6a3a1e', '#d9a46a', '#f5ead9'],
    atmosphere: '#e8b070',
    clouds: 0,
    rings: { inner: 1.4, outer: 2.2, colors: ['#e8cfa8', '#6a4a2e'], opacity: 0.75 },
    moons: 1,
  },
];

export const STAR_RADIUS = 5;
export const STAR_COLOR = '#ffb070';
/** The blue companion: a hot star far out, lighting the worlds' night sides faintly. */
export const COMPANION = { color: '#9cc4ff', position: [-900, 260, -1400] as const };

/** A small, fast, seedable random generator (mulberry32). */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** How far a world reaches from its centre, rings included. */
const extent = (s: Spec) => s.radius * (s.rings ? s.rings.outer : 1) + 0.6 * (s.moons ?? 0);

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/** Kepler's third law, scaled so the innermost world takes about a minute per orbit. */
const period = (radius: number) => 60 * (radius / 14) ** 1.5;

function place(specs: Spec[], start: number, gap: number, offset: number): { worlds: World[]; end: number } {
  const worlds: World[] = [];
  let edge = start;
  specs.forEach((s, i) => {
    const rnd = random(hash(s.slug));
    const radius = edge + extent(s);
    edge = radius + extent(s) + gap;
    const moons: Moon[] = Array.from({ length: s.moons ?? 0 }, (_, m) => ({
      radius: s.radius * (0.14 + rnd() * 0.12),
      distance: s.radius * (s.rings ? s.rings.outer + 0.6 : 2.2) + m * s.radius * 0.9,
      period: 12 + rnd() * 18 + m * 9,
      phase: rnd() * Math.PI * 2,
      inclination: (rnd() - 0.5) * 0.5,
      color: ['#8a8580', '#a39a8c', '#6f747c'][m % 3]!,
    }));
    worlds.push({
      ...s,
      number: offset + i + 1,
      moons,
      tilt: (rnd() - 0.5) * (s.type === 'gas' ? 0.5 : 0.9),
      day: s.type === 'gas' ? 26 + rnd() * 14 : 40 + rnd() * 50,
      orbit: {
        radius,
        inclination: (rnd() - 0.5) * 0.07,
        node: rnd() * Math.PI * 2,
        phase: (offset + i) * GOLDEN_ANGLE * 2.1 + rnd() * 0.4,
        period: period(radius),
      },
      seed: (hash(s.slug) % 1000) + 1,
    });
  });
  return { worlds, end: edge };
}

const innerSystem = place(inner, 12, 2.4, 0);
/** The asteroid belt between the inner worlds and the earlier work. */
export const BELT = { inner: innerSystem.end + 1.5, outer: innerSystem.end + 7.5 };
const outerSystem = place(outer, BELT.outer + 2.5, 2.8, inner.length);

export const worlds: World[] = [...innerSystem.worlds, ...outerSystem.worlds];
export const SYSTEM_RADIUS = outerSystem.end;

export function getWorld(slug: string): World | undefined {
  return worlds.find((w) => w.slug === slug);
}
