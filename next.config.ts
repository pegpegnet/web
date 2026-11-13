import type { NextConfig } from 'next';

// pegpeg.net is served as static files from Apache, so the whole site is exported at build time.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // The site has two root layouts (the bare domain and /[locale]/), so the 404 page is global.
  experimental: { globalNotFound: true },
};

export default config;
