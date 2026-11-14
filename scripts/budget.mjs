// Fails the build if the home page's first-load JavaScript grows past the budget, or if three.js
// sneaks into it (3D must load after hydration; see components/scenes.tsx). Run after `next build`.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 320;
const pages = ['es/index.html', 'es/proyectos/index.html', 'es/contacto/index.html'];
let failed = false;

for (const page of pages) {
  const html = readFileSync(new URL(`../out/${page}`, import.meta.url), 'utf8');
  const scripts = [...new Set([...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]))];
  let total = 0;
  let three = false;
  for (const src of scripts) {
    const code = readFileSync(new URL(`../out${src}`, import.meta.url));
    total += gzipSync(code).length;
    if (code.includes('WebGLRenderer')) three = true;
  }
  const kb = Math.round(total / 1024);
  const ok = kb <= BUDGET_KB && !three;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} /${page.replace('index.html', '')}: ${kb} KB gzipped first-load JS${three ? ', includes three.js' : ''} (budget ${BUDGET_KB} KB)`);
}
process.exit(failed ? 1 : 0);
