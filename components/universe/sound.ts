/**
 * The system's sound, made on the spot with the Web Audio API (no files): a low, slowly breathing
 * drone with a little hiss of distant wind, and a soft whoosh when the camera flies to a world.
 * Nothing plays until the visitor turns it on.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let on = false;

function impulse(c: AudioContext, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  return buf;
}

function build() {
  const c = new AudioContext();
  const out = c.createGain();
  out.gain.value = 0;
  out.connect(c.destination);
  const reverb = c.createConvolver();
  reverb.buffer = impulse(c, 4);
  const wet = c.createGain();
  wet.gain.value = 0.6;
  reverb.connect(wet).connect(out);

  // The drone: three low tones through a filter that opens and closes very slowly.
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 520;
  filter.Q.value = 0.7;
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.045;
  const depth = c.createGain();
  depth.gain.value = 220;
  lfo.connect(depth).connect(filter.frequency);
  lfo.start();
  const drone = c.createGain();
  drone.gain.value = 0.16;
  for (const [f, type, g] of [
    [55, 'sine', 1],
    [82.6, 'sine', 0.55],
    [110.4, 'triangle', 0.12],
  ] as const) {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = f;
    o.detune.value = (Math.random() - 0.5) * 8;
    const og = c.createGain();
    og.gain.value = g;
    o.connect(og).connect(filter);
    o.start();
  }
  filter.connect(drone);
  drone.connect(out);
  drone.connect(reverb);

  // Distant wind: filtered noise, barely there.
  noise = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const hiss = c.createBufferSource();
  hiss.buffer = noise;
  hiss.loop = true;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 420;
  band.Q.value = 0.6;
  const hg = c.createGain();
  hg.gain.value = 0.018;
  hiss.connect(band).connect(hg).connect(reverb);
  hiss.start();

  ctx = c;
  master = out;
}

export function isSoundOn() {
  return on;
}

export function setSound(enable: boolean) {
  on = enable;
  if (enable && !ctx) build();
  if (!ctx || !master) return;
  if (enable) void ctx.resume();
  master.gain.setTargetAtTime(enable ? 0.55 : 0, ctx.currentTime, enable ? 1.2 : 0.3);
}

/** A breath of air rising and falling, for a flight. */
export function whoosh() {
  if (!on || !ctx || !master || !noise) return;
  const c = ctx;
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.4;
  f.frequency.setValueAtTime(180, t);
  f.frequency.exponentialRampToValueAtTime(1100, t + 0.9);
  f.frequency.exponentialRampToValueAtTime(260, t + 2.2);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.12, t + 0.7);
  g.gain.linearRampToValueAtTime(0, t + 2.3);
  src.connect(f).connect(g).connect(master);
  src.start(t);
  src.stop(t + 2.4);
}
