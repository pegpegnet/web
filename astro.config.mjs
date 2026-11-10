// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Form result pages are noindex, and the root duplicates /es/; keep them out of the sitemap.
const unlisted = /\/(enviado|noenviado|sent|not-sent|enviat|no-enviat)\/$/;

export default defineConfig({
  site: 'https://pegpeg.net',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en', ca: 'ca-ES' } },
      filter: (page) => page !== 'https://pegpeg.net/' && !unlisted.test(page),
    }),
  ],
  i18n: {
    locales: ['es', 'en', 'ca'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
