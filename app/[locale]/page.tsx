import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { Universe } from '@/components/universe/Universe';
import { Hud } from '@/components/universe/Hud';
import { BELT, worlds } from '@/lib/universe';
import { getProject, image, textOf } from '@/lib/projects';
import { href } from '@/lib/i18n';
import type { StudioText, WorldInfo } from '@/components/universe/Panels';

/** The home page is the PegPeg system: every project a world, explorable in 3D. */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const info: WorldInfo[] = worlds.map((w) => {
    const p = getProject(w.slug)!;
    const text = textOf(p, locale);
    return {
      slug: w.slug,
      number: w.number,
      name: text.name,
      summary: text.summary,
      type: t.universe.types[w.type],
      year: p.year,
      platforms: p.platforms.join(', '),
      kinds: [...new Set(p.kinds.map((k) => t.work.kinds[k]))].join(', '),
      cover: p.cover ? image(p.cover) : null,
      href: href(locale, 'projects', p.slug),
      links: p.links.map((l) => ({ label: l.label[locale], href: l.href })),
      inner: w.orbit.radius < BELT.inner,
    };
  });
  const studio: StudioText = {
    eyebrow: 'PegPeg · Barcelona',
    title: t.about.lines.join(' '),
    intro: t.about.intro,
    servicesTitle: t.services.title,
    services: t.services.items,
    principles: t.about.principles,
    contactTitle: t.contact.title,
    talk: t.contact.talk,
    contactHref: href(locale, 'contact'),
    where: t.contact.where,
    close: t.universe.close,
  };
  return (
    <main id="main">
      <Universe worlds={info} t={{ ...t.universe, year: t.project.year, platforms: t.project.platforms, kind: t.project.kind }} studio={studio}>
        <Hud locale={locale} t={t} />
      </Universe>
    </main>
  );
}
