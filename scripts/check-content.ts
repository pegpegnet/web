// Verifies that every translation key and image referenced by the project data exists,
// that all locales define the same keys, and that slugs are unique.
// Runs with Node's built-in TypeScript type stripping: node scripts/check-content.ts
import { existsSync, readFileSync } from 'node:fs';
import { projects, type Block } from '../src/data/projects.ts';

const locales = ['es', 'en', 'ca'] as const;
const messages = Object.fromEntries(
  locales.map((l) => [l, JSON.parse(readFileSync(`src/i18n/${l}.json`, 'utf8')) as Record<string, string>]),
);
const errors: string[] = [];

const reference = Object.keys(messages.es).sort().join('\n');
for (const l of locales) {
  if (Object.keys(messages[l]).sort().join('\n') !== reference) errors.push(`${l}.json keys differ from es.json`);
  for (const [k, v] of Object.entries(messages[l])) if (!v.trim()) errors.push(`${l}.json: "${k}" is empty`);
}

const keysOf = (b: Block): string[] =>
  'key' in b ? [b.key] : 'keys' in b ? b.keys : 'titleKey' in b ? [b.titleKey] : [];
const imagesOf = (b: Block): string[] => (b.type === 'image' ? [b.src] : []);

const seen = new Set<string>();
for (const p of projects) {
  if (seen.has(p.slug)) errors.push(`duplicate slug ${p.slug}`);
  seen.add(p.slug);
  const keys: string[] = [p.summaryKey, ...('key' in p.title ? [p.title.key] : [])];
  const images = [p.thumb, ...(p.gallery ?? [])].filter(Boolean);
  if (p.page) {
    keys.push(p.page.titleKey, ...p.page.blocks.flatMap(keysOf));
    images.push(...(p.page.hero ? [p.page.hero] : []), ...p.page.blocks.flatMap(imagesOf));
  }
  if (!p.page && !p.gallery?.length) errors.push(`${p.slug}: needs a page or a gallery`);
  if (p.listed && !p.thumb) errors.push(`${p.slug}: listed project needs a thumbnail`);
  for (const k of keys) for (const l of locales) if (!(k in messages[l])) errors.push(`${p.slug}: ${l} is missing "${k}"`);
  for (const f of images) if (!existsSync(`src/assets/works/${f}`)) errors.push(`${p.slug}: missing image ${f}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Content OK: ${projects.length} projects, ${Object.keys(messages.es).length} messages in ${locales.length} locales.`);
