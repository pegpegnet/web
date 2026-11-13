import type { NextConfig } from 'next';

// pegpeg.net is served as static files from Apache, so the whole site is exported at build time.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
