// Adds or updates messages in all three locale files, keeping keys sorted.
// usage: node scripts/add-messages.mjs messages.json   ({ "key": { "es": "", "en": "", "ca": "" } })
import { readFileSync, writeFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(process.argv[2], 'utf8'));
for (const l of ['es', 'en', 'ca']) {
  const file = `src/i18n/${l}.json`;
  const m = JSON.parse(readFileSync(file, 'utf8'));
  for (const [key, values] of Object.entries(input)) {
    if (!values[l]) throw new Error(`${key} has no ${l} value`);
    m[key] = values[l];
  }
  const sorted = Object.fromEntries(Object.keys(m).sort().map((k) => [k, m[k]]));
  writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n');
}
console.log(`Updated ${Object.keys(input).length} messages.`);
