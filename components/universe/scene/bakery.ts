import * as THREE from 'three';
import type { World } from '@/lib/universe';
import { TYPE_ID, bakeFragment, fullscreenVertex } from '../shaders/planet';

/** Textures for one world (see shaders/planet.ts for what each holds). */
export type WorldMaps = {
  surface: THREE.WebGLRenderTarget;
  relief: THREE.WebGLRenderTarget;
  clouds: THREE.WebGLRenderTarget | null;
  width: number;
  dispose: () => void;
};

/** How strongly each type's relief shows in its normals. */
const BUMP: Record<World['type'], number> = { ocean: 0.06, desert: 0.06, ice: 0.025, jungle: 0.06, gas: 0, lava: 0.08, toxic: 0.035, barren: 0.12 };

type Job = {
  world: Pick<World, 'type' | 'seed' | 'palette' | 'clouds'>;
  maps: WorldMaps;
  row: number;
  rows: number;
  done: (maps: WorldMaps) => void;
  cancelled: boolean;
};

function target(width: number, height: number, srgb: boolean, red = false) {
  const t = new THREE.WebGLRenderTarget(width, height, {
    format: red ? THREE.RedFormat : THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: false,
    depthBuffer: false,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });
  if (srgb) t.texture.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Bakes worlds' surfaces on the GPU, a little each frame. Small maps go in one step; big ones in
 * horizontal strips, so a close-up never stalls a frame. Everything shares one shader program.
 */
export class Bakery {
  private queue: Job[] = [];
  private material = new THREE.ShaderMaterial({
    vertexShader: fullscreenVertex,
    fragmentShader: bakeFragment,
    uniforms: {
      uType: { value: 0 },
      uPass: { value: 0 },
      uSeed: { value: 0 },
      uPal: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color(), new THREE.Color()] },
      uClouds: { value: 0 },
      uBump: { value: 0 },
      uSize: { value: new THREE.Vector2() },
    },
    depthTest: false,
    depthWrite: false,
  });
  private quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  constructor(private anisotropy: number) {
    this.quad.frustumCulled = false;
  }

  /** Queue a world; `done` runs once every pass is complete. Returns a cancel function. */
  bake(world: Job['world'], width: number, done: (maps: WorldMaps) => void, urgent = false): () => void {
    const height = width / 2;
    const surface = target(width, height, true);
    const relief = target(width, height, false);
    const clouds = world.clouds > 0 ? target(width, height, false, true) : null;
    for (const t of [surface, relief, clouds]) if (t) t.texture.anisotropy = this.anisotropy;
    const maps: WorldMaps = {
      surface,
      relief,
      clouds,
      width,
      dispose: () => [surface, relief, clouds].forEach((t) => t?.dispose()),
    };
    // Big maps go in strips of about 128 rows; small ones in one go.
    const job: Job = { world, maps, row: 0, rows: width > 1024 ? 128 : height, done, cancelled: false };
    if (urgent) this.queue.unshift(job);
    else this.queue.push(job);
    return () => {
      job.cancelled = true;
    };
  }

  get pending() {
    return this.queue.length;
  }

  /** Do up to `budget` texels of work. Call once per frame. */
  work(gl: THREE.WebGLRenderer, budget: number) {
    const previous = gl.getRenderTarget();
    while (budget > 0 && this.queue.length) {
      const job = this.queue[0]!;
      if (job.cancelled) {
        job.maps.dispose();
        this.queue.shift();
        continue;
      }
      const { maps, world } = job;
      const height = maps.width / 2;
      const rows = Math.min(job.rows, height - job.row);
      const last = job.row + rows >= height;
      const u = this.material.uniforms;
      u.uType!.value = TYPE_ID[world.type];
      u.uSeed!.value = world.seed;
      (u.uPal!.value as THREE.Color[]).forEach((c, i) => c.set(world.palette[i]!));
      u.uClouds!.value = world.clouds;
      u.uBump!.value = BUMP[world.type];
      u.uSize!.value.set(maps.width, height);
      const passes: [THREE.WebGLRenderTarget | null, number][] = [
        [maps.surface, 0],
        [maps.relief, 1],
        [maps.clouds, 2],
      ];
      for (const [t, pass] of passes) {
        if (!t) continue;
        u.uPass!.value = pass;
        t.scissor.set(0, job.row, maps.width, rows);
        t.scissorTest = true;
        t.viewport.set(0, 0, maps.width, height);
        // Mipmaps once, with the last strip.
        t.texture.generateMipmaps = last;
        gl.setRenderTarget(t);
        gl.render(this.quad, this.camera);
      }
      job.row += rows;
      budget -= maps.width * rows * (maps.clouds ? 3 : 2);
      if (last) {
        for (const [t] of passes) if (t) t.scissorTest = false;
        this.queue.shift();
        job.done(maps);
      }
    }
    gl.setRenderTarget(previous);
  }

  dispose() {
    for (const job of this.queue) job.maps.dispose();
    this.queue = [];
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
