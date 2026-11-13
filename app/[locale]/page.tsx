import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { Hero } from '@/components/hero/Hero';
import { SelectedWork } from '@/components/work/SelectedWork';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <main id="main">
      <Hero locale={locale} t={t.hero} />
      <SelectedWork locale={locale} t={t.work} />
    </main>
  );
}
