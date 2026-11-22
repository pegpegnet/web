// Checks the content before a build: unique slugs, every referenced image present in public/work,
// text for every language, and exactly one world in the PegPeg system for every listed project.
// Run with: node scripts/check-content.ts   (Node 22.18+ strips the types)
import { readFileSync } from 'node:fs';
import { projects } from '../content/projects.ts';
import { worlds } from '../lib/universe.ts';

const media = JSON.parse(readFileSync(new URL('../content/media.json', import.meta.url), 'utf8')) as Record<string, unknown>;
const problems: string[] = [];
const seen = new Set<string>();

for (const p of projects) {
  if (seen.has(p.slug)) problems.push(`duplicate slug ${p.slug}`);
  seen.add(p.slug);
  if (!/^[a-z0-9-]+$/.test(p.slug)) problems.push(`slug ${p.slug} is not URL-safe`);
  for (const img of [p.cover, ...p.gallery].filter(Boolean) as string[]) {
    if (!(img in media)) problems.push(`${p.slug}: image ${img} not in public/work`);
  }
  for (const [locale, text] of Object.entries(p.text)) {
    if (!text.name || !text.summary) problems.push(`${p.slug}: ${locale} text is missing a name or summary`);
  }
}

const listed = new Set(projects.filter((p) => p.listed).map((p) => p.slug));
const placed = new Set<string>();
for (const w of worlds) {
  if (placed.has(w.slug)) problems.push(`world ${w.slug} appears twice`);
  placed.add(w.slug);
  if (!listed.has(w.slug)) problems.push(`world ${w.slug} is not a listed project`);
}
for (const slug of listed) if (!placed.has(slug)) problems.push(`listed project ${slug} has no world in lib/universe.ts`);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Content OK: ${projects.length} projects, ${worlds.length} worlds, ${Object.keys(media).length} images.`);
