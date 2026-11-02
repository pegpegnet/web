// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pegpeg.net',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    locales: ['es', 'en', 'ca'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
