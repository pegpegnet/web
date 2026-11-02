// Fails the build when the JavaScript or CSS a page loads up front grows past the budget.
// Scripts marked with data-lazy are excluded: they are loaded after first paint.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const BUDGET = { js: 150 * 1024, css: 40 * 1024 }; // gzipped bytes

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
})(DIST);

const gz = (file) => gzipSync(readFileSync(join(DIST, file))).length;
let failed = false;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const js = [...html.matchAll(/<script(?![^>]*data-lazy)[^>]*\bsrc="\/([^"]+)"/g)].map((m) => m[1]);
  const css = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="\/([^"]+)"/g)].map((m) => m[1]);
  const size = { js: js.reduce((s, f) => s + gz(f), 0), css: css.reduce((s, f) => s + gz(f), 0) };
  for (const kind of ['js', 'css']) {
    if (size[kind] > BUDGET[kind]) {
      failed = true;
      console.error(`${page}: ${kind} ${(size[kind] / 1024).toFixed(1)} KB gzipped exceeds ${BUDGET[kind] / 1024} KB`);
    }
  }
}
console.log(`Checked ${pages.length} pages against budget (js ${BUDGET.js / 1024} KB, css ${BUDGET.css / 1024} KB gzipped).`);
process.exit(failed ? 1 : 0);
