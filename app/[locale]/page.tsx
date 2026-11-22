import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { Universe } from '@/components/universe/Universe';
import { Hud } from '@/components/universe/Hud';
import { worlds } from '@/lib/universe';
import { getProject, textOf } from '@/lib/projects';

/** The home page is the PegPeg system: every project a world, explorable in 3D. */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const names = worlds.map((w) => ({ slug: w.slug, number: w.number, name: textOf(getProject(w.slug)!, locale).name }));
  return (
    <main id="main">
      <Universe names={names} t={t.universe}>
        <Hud locale={locale} t={t} />
      </Universe>
    </main>
  );
}
