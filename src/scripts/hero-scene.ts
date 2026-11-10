/**
 * Home hero: real PegPeg work on floating devices — a visionOS window (Yutub), two iPhones
 * (TV3, SumoPhoto) and a visionOS-style round app icon (Socialpreviewbot).
 *
 * Motion, in order of importance:
 *  1. Intro: devices settle into place one after another.
 *  2. Scroll: as the hero leaves the viewport the camera pulls back, the devices separate in depth
 *     and turn slightly, and the scene fades out.
 *  3. Pointer: the whole group turns slightly toward the cursor.
 *  4. Idle: each device floats on its own slow cycle.
 * With prefers-reduced-motion only a single still frame is rendered.
 */
import {
  ACESFilmicToneMapping,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  WebGLRenderer,
  type BufferGeometry,
  type Object3D,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface SceneTextures {
  yutub: string;
  tv3: string;
  sumo: string;
  bot: string;
}

/** Pixel rectangle of a screen inside its source image. */
interface Crop {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Source image size */
  W: number;
  H: number;
}

const CROPS = {
  yutubWindow: { x: 163, y: 88, w: 586, h: 324, W: 900, H: 491 },
  yutubOrnament: { x: 127, y: 199, w: 26, h: 100, W: 900, H: 491 },
  tv3: { x: 22, y: 88, w: 212, h: 322, W: 600, H: 491 },
  sumo: { x: 135, y: 34, w: 497, h: 328, W: 766, H: 391 },
} satisfies Record<string, Crop>;

const CAMERA_Z = 9;
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

function roundedRect(w: number, h: number, r: number): Shape {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Flat rounded rectangle whose UVs span 0..1 across its bounds. */
function screenGeometry(w: number, h: number, r: number): BufferGeometry {
  const g = new ShapeGeometry(roundedRect(w, h, r), 16);
  const pos = g.attributes.position!;
  const uv = g.attributes.uv!;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  uv.needsUpdate = true;
  return g;
}

function cropTexture(source: Texture, c: Crop): Texture {
  const t = source.clone();
  t.repeat.set(c.w / c.W, c.h / c.H);
  t.offset.set(c.x / c.W, 1 - (c.y + c.h) / c.H);
  t.needsUpdate = true;
  return t;
}

export function mountHeroScene(container: HTMLElement, urls: SceneTextures): () => void {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const key = new DirectionalLight(0xffffff, 1.4);
  key.position.set(-3, 4, 5);
  scene.add(key);

  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, CAMERA_Z);

  const loader = new TextureLoader();
  const load = (url: string) =>
    loader.loadAsync(url).then((t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return t;
    });

  // Materials shared by the devices
  const body = new MeshPhysicalMaterial({
    color: 0x1c1c1e,
    metalness: 0.65,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
  });
  const glass = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const frosted = new MeshPhysicalMaterial({
    color: 0xf2f2f2,
    metalness: 0,
    roughness: 0.55,
    transmission: 0.9,
    thickness: 0.15,
    ior: 1.3,
    transparent: true,
    opacity: 0.85,
  });
  const disposables: { dispose(): void }[] = [renderer, body, glass, frosted];

  function phone(tex: Texture, crop: Crop, screenW: number): Group {
    const screenH = screenW * (crop.h / crop.w);
    const bezel = 0.055;
    const w = screenW + bezel * 2;
    const h = screenH + bezel * 2;
    const r = Math.min(w, h) * 0.14;
    const depth = 0.05;
    const bodyGeo = new ExtrudeGeometry(roundedRect(w, h, r), {
      depth,
      bevelEnabled: true,
      bevelSize: 0.022,
      bevelThickness: 0.022,
      bevelSegments: 6,
      curveSegments: 24,
    });
    bodyGeo.translate(0, 0, -depth / 2);
    const screenGeo = screenGeometry(screenW, screenH, r - bezel);
    const screenMat = new MeshBasicMaterial({ map: cropTexture(tex, crop), toneMapped: false });
    const g = new Group();
    const bodyMesh = new Mesh(bodyGeo, body);
    const screen = new Mesh(screenGeo, screenMat);
    screen.position.z = depth / 2 + 0.023;
    const sheen = new Mesh(screenGeo, glass);
    sheen.position.z = screen.position.z + 0.002;
    g.add(bodyMesh, screen, sheen);
    disposables.push(bodyGeo, screenGeo, screenMat, screenMat.map!);
    return g;
  }

  function visionWindow(tex: Texture): Group {
    const c = CROPS.yutubWindow;
    const w = 3.3;
    const h = w * (c.h / c.w);
    const g = new Group();

    // Frosted glass slab behind the content, a little larger than it
    const slabGeo = new ExtrudeGeometry(roundedRect(w + 0.04, h + 0.04, 0.17), {
      depth: 0.02,
      bevelEnabled: true,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      bevelSegments: 4,
      curveSegments: 24,
    });
    slabGeo.translate(0, 0, -0.04);
    const slab = new Mesh(slabGeo, frosted);

    const contentGeo = screenGeometry(w, h, 0.16);
    const contentMat = new MeshBasicMaterial({ map: cropTexture(tex, c), toneMapped: false });
    const content = new Mesh(contentGeo, contentMat);
    content.position.z = 0.002;

    // visionOS window bar: the small pill under every window
    const barGeo = new ShapeGeometry(roundedRect(0.36, 0.045, 0.0225), 8);
    const barMat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, toneMapped: false });
    const bar = new Mesh(barGeo, barMat);
    bar.position.set(0, -h / 2 - 0.14, 0.02);

    // Tab bar ornament, floating in front of the window's left edge
    const o = CROPS.yutubOrnament;
    const ow = 0.15;
    const oh = ow * (o.h / o.w);
    const ornGeo = screenGeometry(ow, oh, ow / 2);
    const ornMat = new MeshBasicMaterial({ map: cropTexture(tex, o), toneMapped: false });
    const ornament = new Mesh(ornGeo, ornMat);
    ornament.position.set(-w / 2 - 0.12, -0.02, 0.22);

    g.add(slab, content, bar, ornament);
    disposables.push(slabGeo, contentGeo, contentMat, contentMat.map!, barGeo, barMat, ornGeo, ornMat, ornMat.map!);
    return g;
  }

  function appIcon(tex: Texture): Group {
    const radius = 0.3;
    const g = new Group();
    const baseGeo = new CylinderGeometry(radius, radius, 0.06, 64);
    baseGeo.rotateX(Math.PI / 2);
    const base = new Mesh(baseGeo, frosted);
    const faceGeo = new CircleGeometry(radius * 0.98, 64);
    const faceMat = new MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false });
    const face = new Mesh(faceGeo, faceMat);
    face.position.z = 0.034;
    g.add(base, face);
    disposables.push(baseGeo, faceGeo, faceMat, tex);
    return g;
  }

  interface Actor {
    object: Object3D;
    rest: { x: number; y: number; z: number; rx: number; ry: number; rz: number };
    /** Offset reached when the hero has scrolled away. Devices separate in depth, never leave the frame. */
    away: { x: number; y: number; z: number; ry: number };
    phase: number;
    delay: number;
  }
  const actors: Actor[] = [];
  const rig = new Group();
  scene.add(rig);

  let disposed = false;
  let introStart = 0;
  let started = false;

  Promise.all([load(urls.yutub), load(urls.tv3), load(urls.sumo), load(urls.bot)])
    .then(([yutub, tv3, sumo, bot]) => {
      if (disposed) return;
      const add = (object: Object3D, a: Omit<Actor, 'object'>) => {
        actors.push({ object, ...a });
        rig.add(object);
      };
      add(visionWindow(yutub), {
        rest: { x: 0.15, y: 0.5, z: -0.7, rx: 0.02, ry: -0.2, rz: 0 },
        away: { x: 0, y: 0.25, z: -1.4, ry: -0.12 },
        phase: 0,
        delay: 0,
      });
      add(phone(tv3, CROPS.tv3, 0.86), {
        rest: { x: -1.3, y: -0.82, z: 0.7, rx: 0.04, ry: 0.38, rz: 0.06 },
        away: { x: -0.3, y: 0.15, z: 0.7, ry: 0.3 },
        phase: 1.7,
        delay: 0.12,
      });
      add(phone(sumo, CROPS.sumo, 1.45), {
        rest: { x: 1.3, y: -1.12, z: 1.0, rx: -0.05, ry: -0.42, rz: -0.04 },
        away: { x: 0.3, y: 0.25, z: 0.9, ry: -0.3 },
        phase: 3.1,
        delay: 0.22,
      });
      add(appIcon(bot), {
        rest: { x: 1.62, y: 1.52, z: 0.45, rx: 0.1, ry: -0.35, rz: 0 },
        away: { x: 0.15, y: 0.2, z: 1.2, ry: -0.7 },
        phase: 4.4,
        delay: 0.32,
      });
      // Each screen renders its own cropped clone, so the uncropped originals can go
      for (const t of [yutub, tv3, sumo]) t.dispose();
      resize();
      introStart = performance.now();
      started = true;
      container.dataset.ready = '';
      if (reduced) render(introStart);
      else loop();
    })
    .catch(() => container.remove());

  // Input
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / innerHeight) * 2 - 1;
  };
  let scrollProgress = 0;
  const onScroll = () => {
    const rect = container.getBoundingClientRect();
    scrollProgress = MathUtils.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
  };
  addEventListener('pointermove', onPointer, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Sizing: fit the composition into whatever box the layout gives the canvas
  let fit = 1;
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // With perspective and rotation the composition spans about 5.4 x 5 units; fit it to the box.
    const visibleH = 2 * CAMERA_Z * Math.tan(MathUtils.degToRad(camera.fov / 2));
    const visibleW = visibleH * camera.aspect;
    fit = Math.min(visibleW / 5.4, visibleH / 5, 1.2);
    rig.scale.setScalar(fit);
    if (reduced && started) render(performance.now());
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Only animate while the hero is on screen and the tab is visible
  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry!.isIntersecting;
    if (visible && !reduced) loop();
  });
  io.observe(container);

  function render(now: number) {
    const t = now / 1000;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    const s = reduced ? 0 : smoothstep(scrollProgress);

    for (const a of actors) {
      const k = reduced ? 1 : easeOutExpo(MathUtils.clamp((now - introStart) / 1600 - a.delay, 0, 1));
      const float = reduced ? 0 : Math.sin(t * 0.7 + a.phase) * 0.045;
      const o = a.object;
      o.position.set(
        a.rest.x + a.away.x * s,
        a.rest.y + a.away.y * s + float - (1 - k) * 0.9,
        a.rest.z + a.away.z * s - (1 - k) * 1.2,
      );
      o.rotation.set(
        a.rest.rx + (reduced ? 0 : Math.cos(t * 0.5 + a.phase) * 0.025) + (1 - k) * 0.5,
        a.rest.ry + a.away.ry * s + (1 - k) * 0.4,
        a.rest.rz,
      );
      o.scale.setScalar(0.88 + 0.12 * k);
    }

    rig.rotation.y = pointer.x * 0.22;
    rig.rotation.x = pointer.y * 0.12;
    // Scrolling away: the camera pulls back and the scene fades, so nothing is cut at the canvas edge
    rig.rotation.y += s * 0.25;
    camera.position.set(0, s * 0.35, CAMERA_Z + s * 3);
    camera.lookAt(0, 0, 0);
    canvas.style.opacity = String(1 - s * 0.9);
    renderer.render(scene, camera);
  }

  let frame = 0;
  function loop() {
    if (frame || disposed || !started) return;
    const tick = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      render(now);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }
  const onVisibility = () => !document.hidden && !reduced && loop();
  document.addEventListener('visibilitychange', onVisibility);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    container.remove();
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    ro.disconnect();
    io.disconnect();
    removeEventListener('pointermove', onPointer);
    removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    for (const d of disposables) d.dispose();
    scene.environment?.dispose();
  };
}
