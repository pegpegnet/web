import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

/** Every page except the home page, which is the universe itself, has the header and footer. */
export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <>
      <Header locale={locale} t={t.nav} system={t.universe.back} />
      {children}
      <Footer locale={locale} t={t} />
    </>
  );
}
