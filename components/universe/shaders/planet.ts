/**
 * The worlds' shaders.
 *
 * Surfaces are procedural, but too costly to evaluate every frame, so each world is baked once
 * into textures that match three's SphereGeometry UVs:
 *
 *   surface  rgb albedo (stored as sRGB), a shininess (oceans, ice)
 *   relief   rgb object-space normal, a glow (lava, city lights, bioluminescence)
 *   clouds   r cloud cover
 *
 * The render shader then only reads textures and lights them.
 */
import { noise } from './noise';

/** World type ids, as the bake shader knows them. */
export const TYPE_ID = { ocean: 0, desert: 1, ice: 2, jungle: 3, gas: 4, lava: 5, toxic: 6, barren: 7 } as const;

/** Density of a ring at a distance (in planet radii) from the centre: shared by the ring and the shadow it casts. */
const ringDensity = /* glsl */ `
float ringDensity(float rr, vec2 range, float seed) {
  float t = (rr - range.x) / (range.y - range.x);
  if (t < 0.0 || t > 1.0) return 0.0;
  float broad = fbm(vec3(t * 14.0, seed, 0.5), 5) * 0.5 + 0.5;
  float fine = snoise(vec3(t * 120.0, seed * 2.0, 1.5)) * 0.5 + 0.5;
  float gap = 1.0 - smoothstep(0.012, 0.0, abs(t - 0.64)) * 0.92;
  float edges = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.9, t);
  return clamp((0.25 + 0.75 * broad) * (0.7 + 0.3 * fine) * gap * edges, 0.0, 1.0);
}
`;

export const fullscreenVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const bakeFragment = /* glsl */ `
varying vec2 vUv;
uniform int uType;
uniform int uPass;
uniform float uSeed;
uniform vec3 uPal[4];
uniform float uClouds;
uniform float uBump;
uniform vec2 uSize;
${noise}

vec3 seedOffset() { return vec3(uSeed * 0.137, uSeed * 0.271, uSeed * 0.419); }

// Matches SphereGeometry: u runs round the equator, v from the south pole to the north.
vec3 dirAt(vec2 uv) {
  float phi = uv.x * 6.2831853;
  float theta = (1.0 - uv.y) * 3.1415927;
  return vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
}

// Impact craters: some cells of a jittered grid hold a crater, a bowl with a raised rim. Every
// neighbouring cell's crater is added in, so craters near a cell edge don't get cut off.
float craters(vec3 p, float density) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  float h = 0.0;
  for (int x = -1; x <= 1; x++)
  for (int y = -1; y <= 1; y++)
  for (int z = -1; z <= 1; z++) {
    vec3 g = vec3(float(x), float(y), float(z));
    float id = hash13(i + g + 91.3);
    if (id > density) continue;
    vec3 o = vec3(hash13(i + g), hash13(i + g + 17.1), hash13(i + g + 41.7));
    float size = 0.16 + 0.3 * fract(id * 13.7);
    float r = length(g + o - f) / size;
    if (r > 1.8) continue;
    float bowl = r < 1.0 ? (r * r - 1.0) * 0.55 : 0.0;
    float rim = exp(-pow((r - 1.0) * 3.5, 2.0)) * 0.3;
    h += (bowl + rim) * smoothstep(1.8, 1.4, r);
  }
  return h;
}

struct Surface { float h; vec3 col; float shine; float glow; };

Surface terra(vec3 d, float sea, bool jungle) {
  vec3 p = d * 1.05 + seedOffset();
  vec3 w = vec3(fbm(p * 1.2, 4), fbm(p * 1.2 + 7.3, 4), fbm(p * 1.2 + 3.1, 4));
  float c = fbm(p + w * 0.45, 7) * 0.5 + 0.5 + (fbm(p * 7.0 + w, 4)) * 0.025;
  float m = ridged(p * 3.1 + w, 6);
  float lat = abs(d.y);
  float land = smoothstep(sea - 0.003, sea + 0.003, c);
  float elev = max(c - sea, 0.0);
  float river = 0.0;
  if (jungle) river = (1.0 - smoothstep(0.0, 0.012, abs(fbm(p * 2.4 + w * 1.4, 5)))) * smoothstep(sea + 0.01, sea + 0.05, c) * (1.0 - smoothstep(0.12, 0.2, elev));
  float depth = clamp((sea - c) * 6.0, 0.0, 1.0);
  vec3 water = jungle ? mix(uPal[3], uPal[3] * 0.35 + uPal[0] * 0.3, pow(depth, 0.55)) : mix(uPal[1], uPal[0], pow(depth, 0.55));
  float moist = fbm(p * 2.7 + 11.0, 5) * 0.5 + 0.5;
  float aridity = jungle ? smoothstep(0.62, 0.85, moist) * 0.5 : smoothstep(0.4, 0.72, moist * 0.8 + (0.35 - abs(lat - 0.28)) * 0.6);
  vec3 veg = uPal[3] * (0.75 + 0.5 * (fbm(p * 9.0, 4) * 0.5 + 0.5));
  if (jungle) veg = mix(uPal[1], uPal[2] * 0.6, fbm(p * 6.0 + w, 5) * 0.5 + 0.5) * (0.8 + 0.4 * (fbm(p * 18.0, 3) * 0.5 + 0.5));
  vec3 ground = mix(veg, uPal[2], aridity);
  vec3 rock = mix(vec3(0.07, 0.06, 0.055), vec3(0.2, 0.18, 0.16), m);
  ground = mix(ground, rock, smoothstep(0.1, 0.24, elev + m * 0.08));
  float snowLine = 0.86 - elev * 1.4 + fbm(p * 6.0, 3) * 0.04;
  float snow = clamp(smoothstep(snowLine, snowLine + 0.03, lat) + smoothstep(0.3, 0.36, elev + m * 0.12), 0.0, 1.0);
  ground = mix(ground, vec3(0.82, 0.85, 0.9), snow);
  ground = mix(ground, water, river * 0.85);
  float seaIce = smoothstep(0.9, 0.93, lat + fbm(p * 5.0, 3) * 0.03) * (1.0 - land);
  Surface s;
  s.col = mix(water, ground, land);
  s.col = mix(s.col, vec3(0.8, 0.84, 0.9), seaIce);
  s.shine = max((1.0 - land) * (1.0 - seaIce), river * 0.6);
  s.h = land * (0.12 + elev * 2.4 + m * 0.3 * smoothstep(sea, sea + 0.08, c)) - river * 0.05;
  // Night lights: towns along coasts and rivers, in clusters, away from the poles and peaks.
  float coast = 1.0 - smoothstep(0.0, 0.06, abs(c - sea));
  float cluster = smoothstep(0.6, 0.82, fbm(p * 13.0, 4) * 0.5 + 0.5);
  float speck = step(0.78, hash13(floor(d * uSize.x * 0.5)));
  s.glow = jungle ? 0.0 : land * (1.0 - snow) * cluster * (0.35 + coast) * (0.25 + 0.75 * speck) * smoothstep(0.82, 0.5, lat);
  return s;
}

Surface desert(vec3 d) {
  vec3 p = d * 1.3 + seedOffset();
  vec3 w = vec3(fbm(p * 1.2, 4), fbm(p * 1.2 + 4.0, 4), fbm(p * 1.2 + 8.0, 4));
  float base = fbm(p + w * 0.6, 7) * 0.5 + 0.5;
  float mount = ridged(p * 2.6 + w, 6);
  float canyon = 1.0 - smoothstep(0.0, 0.07, abs(fbm(p * 1.3 + w * 1.1, 5)));
  float lowland = smoothstep(0.55, 0.36, base);
  float dunes = sin(dot(d, normalize(vec3(0.3, 0.1, 0.9))) * 150.0 + fbm(p * 4.0, 3) * 8.0) * 0.5 + 0.5;
  float h = base * 0.55 + mount * 0.3 * smoothstep(0.45, 0.65, base);
  vec3 col = mix(uPal[1], uPal[2], smoothstep(0.35, 0.72, h + fbm(p * 8.0, 4) * 0.08));
  col = mix(col, uPal[0], canyon * canyon * 0.5);
  float strata = sin(h * 24.0 + fbm(p * 3.0, 3) * 4.0) * 0.5 + 0.5;
  col *= 0.95 + 0.05 * strata;
  col = mix(col, uPal[3], lowland * 0.35);
  col = mix(col, uPal[2] * 1.05, dunes * lowland * 0.22);
  float cr = craters(p * 5.0, 0.18);
  float polar = smoothstep(0.9, 0.95, abs(d.y) + fbm(p * 5.0, 3) * 0.03);
  col = mix(col, vec3(0.8, 0.77, 0.72), polar);
  Surface s;
  s.col = col;
  s.h = h + cr * 0.12 + dunes * lowland * 0.012;
  s.shine = polar * 0.3;
  s.glow = 0.0;
  return s;
}

Surface ice(vec3 d) {
  vec3 p = d * 1.4 + seedOffset();
  vec3 w = vec3(fbm(p * 1.5, 4), fbm(p * 1.5 + 2.0, 4), fbm(p * 1.5 + 4.0, 4));
  float base = fbm(p * 2.0 + w, 6) * 0.5 + 0.5;
  float l1 = 1.0 - smoothstep(0.0, 0.028, abs(fbm(p * 1.8 + w * 1.3, 5)));
  float l2 = 1.0 - smoothstep(0.0, 0.026, abs(fbm(p * 3.4 + w * 2.0, 5)));
  float lines = max(l1, l2 * 0.4);
  vec3 col = mix(uPal[1], uPal[2], smoothstep(0.3, 0.75, base));
  col = mix(col, uPal[3], smoothstep(0.6, 0.9, fbm(p * 0.8 + 1.0, 4) * 0.5 + 0.5) * 0.45);
  col = mix(col, uPal[0], lines * 0.85);
  Surface s;
  s.col = col;
  s.h = base * 0.3;
  s.shine = 0.6 * (1.0 - lines);
  s.glow = lines * 0.35;
  return s;
}

Surface gas(vec3 d) {
  vec3 p = d + seedOffset();
  vec3 sheared = p * vec3(2.0, 9.0, 2.0);
  float y = d.y + fbm(sheared, 5) * 0.035 + fbm(p * vec3(6.0, 26.0, 6.0), 5) * 0.012;
  // A great storm, an oval swirling in one band.
  float lon = uSeed * 2.399;
  vec3 c = normalize(vec3(cos(lon), -0.32 + fract(uSeed * 0.37) * 0.2, sin(lon)));
  vec3 east = normalize(cross(vec3(0.0, 1.0, 0.0), c));
  vec3 north = cross(c, east);
  vec2 local = vec2(dot(d - c, east), dot(d - c, north)) / vec2(0.2, 0.11);
  float r = length(local);
  float swirl = (1.0 - smoothstep(0.0, 1.6, r)) * 2.6;
  vec2 rot = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * local;
  y += (rot.y - local.y) * 0.11 * smoothstep(1.6, 0.4, r);
  float bands = fbm(vec3(y * 9.0, uSeed * 0.1, 0.0), 6) * 0.5 + 0.5;
  float fine = fbm(vec3(y * 42.0, uSeed, 0.0) + vec3(fbm(sheared * 2.0, 3) * 0.4), 4) * 0.5 + 0.5;
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.22, 0.52, bands));
  col = mix(col, uPal[2], smoothstep(0.52, 0.8, bands));
  col *= 0.82 + 0.36 * fine;
  float storm = 1.0 - smoothstep(0.35, 1.0, r);
  float ring = smoothstep(0.75, 1.0, r) * (1.0 - smoothstep(1.0, 1.35, r));
  col = mix(col, uPal[3], storm * 0.85);
  col = mix(col, uPal[2], ring * 0.35);
  // Darker, slightly bluish polar regions.
  col = mix(col, col * vec3(0.7, 0.76, 0.85), smoothstep(0.7, 0.95, abs(d.y)));
  Surface s;
  s.col = col;
  s.h = 0.0;
  s.shine = 0.0;
  s.glow = 0.0;
  return s;
}

Surface lava(vec3 d) {
  vec3 p = d * 1.6 + seedOffset();
  vec3 w = vec3(fbm(p * 1.3, 4), fbm(p * 1.3 + 3.3, 4), fbm(p * 1.3 + 6.6, 4));
  float crust = ridged(p * 2.4 + w, 7);
  float cracks = 1.0 - smoothstep(0.0, 0.03, abs(fbm(p * 2.2 + w * 0.9, 6)));
  float fine = 1.0 - smoothstep(0.0, 0.018, abs(fbm(p * 5.5 + w * 1.5, 5)));
  float seas = smoothstep(0.35, 0.27, fbm(p * 0.9, 5) * 0.5 + 0.5);
  float molten = max(max(cracks, fine * 0.35), seas);
  vec3 rock = mix(uPal[0], uPal[2], crust);
  rock = mix(rock, uPal[1], (fbm(p * 7.0, 4) * 0.5 + 0.5) * 0.5);
  Surface s;
  s.col = mix(rock, uPal[3] * 0.12, molten * 0.75);
  s.h = crust * 0.6 * (1.0 - molten);
  s.shine = 0.05 + molten * 0.25;
  float crustOnSea = smoothstep(0.1, 0.5, fbm(p * 6.0 + w, 4) * 0.5 + 0.5);
  s.glow = max(max(cracks, fine * 0.35), seas * (1.0 - crustOnSea) * 0.6) * (0.55 + 0.45 * (fbm(p * 9.0, 3) * 0.5 + 0.5));
  return s;
}

Surface toxic(vec3 d) {
  vec3 p = d * 1.5 + seedOffset();
  vec3 w = vec3(fbm(p, 4), fbm(p + 5.0, 4), fbm(p + 9.0, 4));
  float c = fbm(p + w * 0.7, 7) * 0.5 + 0.5;
  float sea = 0.47;
  float land = smoothstep(sea - 0.003, sea + 0.003, c);
  float pattern = sin(fbm(p * 3.0 + w, 5) * 8.0) * 0.5 + 0.5;
  vec3 growth = mix(uPal[1], uPal[2], pattern) * (0.8 + 0.4 * (fbm(p * 14.0, 3) * 0.5 + 0.5));
  vec3 liquid = mix(uPal[0], uPal[1] * 0.5, clamp((c - sea + 0.12) * 6.0, 0.0, 1.0));
  Surface s;
  s.col = mix(liquid, growth, land);
  s.shine = (1.0 - land) * 0.85;
  s.h = land * (0.1 + (c - sea) * 2.0 + pattern * 0.05);
  s.glow = land * pow(pattern, 6.0) * 0.85;
  return s;
}

Surface barren(vec3 d) {
  vec3 p = d * 1.2 + seedOffset();
  float maria = smoothstep(0.52, 0.42, fbm(p * 0.9, 5) * 0.5 + 0.5);
  float base = fbm(p * 2.5, 6) * 0.5 + 0.5;
  float c1 = craters(p * 3.0, 0.5);
  float c2 = craters(p * 7.0 + 5.0, 0.55);
  float c3 = craters(p * 16.0 + 11.0, 0.6);
  Surface s;
  s.h = base * 0.3 + c1 * 0.5 + c2 * 0.3 + c3 * 0.15 - maria * 0.08;
  vec3 col = mix(uPal[1], uPal[2], base);
  col = mix(col, uPal[0], maria * 0.7);
  col *= 0.85 + 0.3 * clamp(c2 * 1.2 + c3 + 0.5, 0.0, 1.0);
  s.col = col;
  s.shine = 0.02;
  s.glow = 0.0;
  return s;
}

Surface world(vec3 d) {
  if (uType == 0) return terra(d, 0.555, false);
  if (uType == 1) return desert(d);
  if (uType == 2) return ice(d);
  if (uType == 3) return terra(d, 0.44, true);
  if (uType == 4) return gas(d);
  if (uType == 5) return lava(d);
  if (uType == 6) return toxic(d);
  return barren(d);
}

float clouds(vec3 d) {
  vec3 p = d * 2.2 + seedOffset() * 1.7;
  vec3 q = vec3(fbm(p * 1.1, 4), fbm(p * 1.1 + 4.1, 4), fbm(p * 1.1 + 8.2, 4));
  float n = fbm(p * vec3(1.0, 2.8, 1.0) + q * 1.8, 8) * 0.5 + 0.5;
  float detail = fbm(p * vec3(6.0, 14.0, 6.0) + q * 3.0, 5) * 0.5 + 0.5;
  n -= (1.0 - detail) * 0.2;
  float belts = 0.5 + 0.5 * cos(d.y * 9.0);
  float threshold = 1.0 - uClouds * 0.85;
  return smoothstep(threshold, threshold + 0.2, n * (0.88 + 0.2 * belts));
}

void main() {
  vec3 d = dirAt(vUv);
  if (uPass == 2) {
    gl_FragColor = vec4(clouds(d), 0.0, 0.0, 1.0);
    return;
  }
  Surface s = world(d);
  if (uPass == 0) {
    gl_FragColor = vec4(s.col, s.shine);
    return;
  }
  // Relief: the surface normal, from the height a step east and a step north.
  vec3 n = d;
  if (uBump > 0.0) {
    float e = 3.1415927 / uSize.y;
    vec3 t = normalize(cross(abs(d.y) < 0.999 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0), d));
    vec3 b = cross(d, t);
    float he = world(normalize(d + t * e)).h;
    float hn = world(normalize(d + b * e)).h;
    n = normalize(d - uBump * ((he - s.h) * t + (hn - s.h) * b) / e);
  }
  gl_FragColor = vec4(n * 0.5 + 0.5, s.glow);
}
`;

export const planetVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vMx;
varying vec3 vMy;
varying vec3 vMz;
void main() {
  vUv = uv;
  mat3 m = mat3(modelMatrix);
  vMx = normalize(m[0]);
  vMy = normalize(m[1]);
  vMz = normalize(m[2]);
  vNormalW = normalize(m * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const planetFragment = /* glsl */ `
uniform sampler2D uSurface;
uniform sampler2D uRelief;
uniform sampler2D uCloudMap;
uniform float uCloudAmount;
uniform float uCloudShift;
uniform vec3 uSun;
uniform vec3 uCompDir;
uniform vec3 uCompColor;
uniform vec3 uAtmo;
uniform float uAtmoStrength;
uniform vec3 uGlowColor;
uniform float uGlow;
uniform float uGlowNight;
uniform float uShine;
uniform vec3 uTint;
uniform float uReveal;
uniform float uHasRings;
uniform vec3 uCenter;
uniform float uRadius;
uniform vec3 uRingNormal;
uniform vec2 uRingRange;
uniform float uRingSeed;
uniform float uRingOpacity;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vMx;
varying vec3 vMy;
varying vec3 vMz;
${noise}
${ringDensity}

void main() {
  vec3 ng = normalize(vNormalW);
  vec3 v = normalize(cameraPosition - vPosW);
  vec3 l = normalize(-vPosW);
  vec4 surf = texture2D(uSurface, vUv);
  vec4 rel = texture2D(uRelief, vUv);
  vec3 no = rel.xyz * 2.0 - 1.0;
  vec3 n = normalize(vMx * no.x + vMy * no.y + vMz * no.z);
  float sunG = dot(ng, l);
  float lit = max(dot(n, l), 0.0) * smoothstep(-0.08, 0.12, sunG);

  float cloud = 0.0;
  float cloudShade = 0.0;
  if (uCloudAmount > 0.0) {
    cloud = texture2D(uCloudMap, vUv + vec2(uCloudShift, 0.0)).r;
    cloudShade = texture2D(uCloudMap, vUv + vec2(uCloudShift + 0.006, -0.003)).r;
  }

  float ringShade = 1.0;
  if (uHasRings > 0.5) {
    float denom = dot(l, uRingNormal);
    if (abs(denom) > 1e-4) {
      float t = dot(uCenter - vPosW, uRingNormal) / denom;
      if (t > 0.0) {
        float rr = length(vPosW + l * t - uCenter) / uRadius;
        ringShade = 1.0 - ringDensity(rr, uRingRange, uRingSeed) * uRingOpacity * 0.85;
      }
    }
  }

  vec3 albedo = surf.rgb * uTint;
  vec3 col = albedo * uSun * lit * (1.0 - cloudShade * 0.5) * ringShade;

  // Sunglint on oceans and ice: a sharp highlight and a broad sheen, stronger at grazing angles.
  vec3 h = normalize(l + v);
  float fres = 0.04 + 0.96 * pow(1.0 - max(dot(ng, v), 0.0), 5.0);
  float glint = pow(max(dot(n, h), 0.0), 160.0) * 5.0 + pow(max(dot(n, h), 0.0), 16.0) * 0.08;
  col += uSun * surf.a * uShine * glint * (0.3 + fres) * smoothstep(0.0, 0.15, sunG) * (1.0 - cloud) * ringShade;

  // The companion star's cold light, faintly.
  col += albedo * uCompColor * max(dot(n, uCompDir), 0.0) * 0.05;

  float cloudLight = smoothstep(-0.12, 0.3, sunG) * (0.3 + 0.7 * max(sunG, 0.0));
  vec3 cloudCol = vec3(0.86, 0.86, 0.85) * uSun * cloudLight * ringShade + uCompColor * 0.02;
  col = mix(col, cloudCol, cloud * 0.88);

  float night = uGlowNight > 0.5 ? smoothstep(0.1, -0.18, sunG) : 1.0;
  col += uGlowColor * rel.a * uGlow * night * (1.0 - cloud * 0.8);

  // Air seen edge-on: a haze at the limb on the day side.
  float limb = pow(1.0 - max(dot(ng, v), 0.0), 3.0);
  col += uAtmo * uSun * uAtmoStrength * limb * smoothstep(-0.25, 0.4, sunG) * 0.35;

  gl_FragColor = vec4(col * uReveal, 1.0);
  #include <colorspace_fragment>
}
`;

export const atmosphereVertex = /* glsl */ `
varying vec3 vPosW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

/**
 * The atmosphere, seen around the planet's edge. For each pixel it finds how close the view ray
 * passes to the planet, so the glow is densest just above the surface and fades to nothing at the
 * shell. It's bright on the day side, and brightest of all when the star is behind the planet.
 */
export const atmosphereFragment = /* glsl */ `
uniform vec3 uCenter;
uniform float uRadius;
uniform float uShell;
uniform vec3 uColor;
uniform float uStrength;
uniform vec3 uSun;
uniform float uReveal;
varying vec3 vPosW;
void main() {
  vec3 rd = normalize(vPosW - cameraPosition);
  vec3 toC = uCenter - cameraPosition;
  float tca = dot(toC, rd);
  float h = sqrt(max(dot(toC, toC) - tca * tca, 0.0));
  float x = (h - uRadius) / (uShell - uRadius);
  if (x < 0.0) discard;
  vec3 nearest = normalize(cameraPosition + rd * tca - uCenter);
  vec3 l = normalize(-uCenter);
  float sunDot = dot(nearest, l);
  float day = smoothstep(-0.35, 0.55, sunDot);
  float forward = pow(max(dot(rd, l), 0.0), 8.0) * smoothstep(-0.7, 0.1, sunDot);
  float density = exp(-x * 3.2) * (1.0 - smoothstep(0.5, 1.0, x));
  vec3 col = uColor * uSun * density * (day * 0.7 + forward * 3.0) * uStrength * uReveal;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const ringVertex = /* glsl */ `
varying vec3 vPosW;
varying vec2 vLocal;
void main() {
  vLocal = position.xy;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const ringFragment = /* glsl */ `
uniform vec3 uCenter;
uniform float uRadius;
uniform vec2 uRange;
uniform float uSeed;
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uOpacity;
uniform vec3 uSun;
uniform float uReveal;
varying vec3 vPosW;
varying vec2 vLocal;
${noise}
${ringDensity}
void main() {
  float rr = length(vLocal) / uRadius;
  float dens = ringDensity(rr, uRange, uSeed);
  if (dens < 0.002) discard;
  float t = (rr - uRange.x) / (uRange.y - uRange.x);
  vec3 col = mix(uColB, uColA, fbm(vec3(t * 6.0, uSeed + 3.0, 0.0), 3) * 0.5 + 0.5);
  vec3 l = normalize(-vPosW);
  vec3 v = normalize(cameraPosition - vPosW);
  // In the planet's shadow?
  vec3 oc = vPosW - uCenter;
  float b = dot(oc, l);
  float disc = b * b - (dot(oc, oc) - uRadius * uRadius);
  float shadow = b < 0.0 ? 1.0 - smoothstep(-0.04, 0.04, disc / (uRadius * uRadius)) * 0.92 : 1.0;
  // Ice and dust scatter forwards: rings glow when the star is behind them.
  float phase = 0.55 + 1.6 * pow(max(dot(-v, l), 0.0), 6.0);
  gl_FragColor = vec4(col * uSun * shadow * phase * 0.8, dens * uOpacity * uReveal);
  #include <colorspace_fragment>
}
`;
