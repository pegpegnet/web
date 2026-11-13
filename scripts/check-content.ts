// Checks the project content before a build: unique slugs, every referenced image present in
// public/work, every featured scene used once, and text for every language.
// Run with: node scripts/check-content.ts   (Node 22.18+ strips the types)
import { readFileSync } from 'node:fs';
import { projects } from '../content/projects.ts';

const media = JSON.parse(readFileSync(new URL('../content/media.json', import.meta.url), 'utf8')) as Record<string, unknown>;
const problems: string[] = [];
const seen = new Set<string>();
const scenes = new Set<string>();

for (const p of projects) {
  if (seen.has(p.slug)) problems.push(`duplicate slug ${p.slug}`);
  seen.add(p.slug);
  if (!/^[a-z0-9-]+$/.test(p.slug)) problems.push(`slug ${p.slug} is not URL-safe`);
  for (const img of [p.cover, ...p.gallery].filter(Boolean) as string[]) {
    if (!(img in media)) problems.push(`${p.slug}: image ${img} not in public/work`);
  }
  if (p.scene) {
    if (scenes.has(p.scene)) problems.push(`scene ${p.scene} used twice`);
    scenes.add(p.scene);
  }
  for (const [locale, text] of Object.entries(p.text)) {
    if (!text.name || !text.summary) problems.push(`${p.slug}: ${locale} text is missing a name or summary`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Content OK: ${projects.length} projects, ${scenes.size} scenes, ${Object.keys(media).length} images.`);
