import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales, isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { languageAlternates } from '@/lib/seo';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollRestoration } from '@/components/motion/ScrollRestoration';
import { PageTransition } from '@/components/motion/PageTransition';
import { QualityProvider } from '@/components/three/QualityProvider';
import { StageLoader } from '@/components/three/StageLoader';
import '../globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL('https://pegpeg.net'),
    title: { default: t.meta.title, template: '%s | PegPeg' },
    description: t.meta.description,
    alternates: languageAlternates(locale),
    openGraph: { siteName: 'PegPeg', locale: { es: 'es_ES', en: 'en_GB', ca: 'ca_ES' }[locale], type: 'website' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Hide animated headlines before first paint when motion is allowed; show them after 3 s regardless. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('motion');setTimeout(function(){d.classList.remove('motion')},3000)}",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-2 left-2 z-[100] -translate-y-24 rounded-full bg-char px-4 py-2 text-bone focus:translate-y-0"
        >
          {t.nav.skip}
        </a>
        <QualityProvider>
          <ScrollRestoration />
          <Header locale={locale} t={t.nav} />
          {children}
          <Footer locale={locale} t={t} />
          <StageLoader />
          <PageTransition />
        </QualityProvider>
      </body>
    </html>
  );
}
