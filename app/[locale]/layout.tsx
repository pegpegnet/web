import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales, isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
    <html lang={locale}>
      <body>
        <a
          href="#main"
          className="fixed top-2 left-2 z-[100] -translate-y-24 rounded-full bg-char px-4 py-2 text-bone focus:translate-y-0"
        >
          {t.nav.skip}
        </a>
        <Header locale={locale} t={t.nav} />
        {children}
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
