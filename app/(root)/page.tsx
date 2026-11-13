import type { Metadata } from 'next';
import { defaultLocale, href } from '@/lib/i18n';

const target = href(defaultLocale);

export const metadata: Metadata = {
  title: 'PegPeg',
  robots: { index: false },
  alternates: { canonical: target },
};

export default function Root() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <p style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        <a href={target}>PegPeg</a>
      </p>
    </>
  );
}
