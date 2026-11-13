import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { href } from '@/lib/i18n';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <main id="main" className="container-page pt-40 pb-24">
      <h1 className="type-poster text-step-6">{t.hero.title}</h1>
      <p className="mt-8 max-w-[44ch] text-step-1 text-graphite">{t.hero.lead}</p>
      <div className="mt-10 flex flex-wrap gap-5">
        <MagneticButton href="#work">{t.hero.seeWork}</MagneticButton>
        <MagneticButton href={href(locale, 'contact')} variant="outline">
          {t.hero.talk}
        </MagneticButton>
      </div>
    </main>
  );
}
