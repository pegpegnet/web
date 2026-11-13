import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { Hero } from '@/components/hero/Hero';
import { SelectedWork } from '@/components/work/SelectedWork';
import { OpenSource } from '@/components/opensource/OpenSource';
import { Services } from '@/components/services/Services';
import { About } from '@/components/about/About';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <main id="main">
      <Hero locale={locale} t={t.hero} />
      <SelectedWork locale={locale} t={t.work} />
      <OpenSource locale={locale} t={t.openSource} />
      <Services t={t.services} />
      <About t={t.about} />
    </main>
  );
}
