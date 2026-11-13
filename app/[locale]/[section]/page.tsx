import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, segments, isLocale, sectionFor, type Section } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { ProjectIndex, type IndexItem } from '@/components/projects/ProjectIndex';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { listedProjects, image, textOf } from '@/lib/projects';
import { href } from '@/lib/i18n';
import type { Kind } from '@/content/projects';

export const dynamicParams = false;

const pages: Section[] = ['projects', 'contact'];

export function generateStaticParams() {
  return locales.flatMap((locale) => pages.map((s) => ({ locale, section: segments[s][locale] })));
}

async function resolve(params: Promise<{ locale: string; section: string }>) {
  const { locale, section } = await params;
  if (!isLocale(locale)) notFound();
  const which = sectionFor(locale, section);
  if (!which || !pages.includes(which)) notFound();
  return { locale, which, t: getDictionary(locale) };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string }> }): Promise<Metadata> {
  const { which, t } = await resolve(params);
  return { title: which === 'projects' ? t.projects.title : t.nav.contact };
}

export default async function SectionPage({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale, which, t } = await resolve(params);
  if (which === 'projects') {
    const items: IndexItem[] = listedProjects.map((p) => {
      const text = textOf(p, locale);
      return {
        slug: p.slug,
        href: href(locale, 'projects', p.slug),
        name: text.name,
        summary: text.summary,
        kinds: p.kinds,
        meta: [...new Set([...p.kinds.map((k) => t.work.kinds[k]), ...p.platforms])].join(', '),
        year: p.year,
        cover: p.cover ? image(p.cover) : null,
        theme: { bg: p.theme.bg, fg: p.theme.fg },
      };
    });
    const kinds: Kind[] = ['app', 'web', 'game', 'open-source'];
    const filters = [
      { value: 'all' as const, label: t.projects.all },
      ...kinds.map((k) => ({ value: k, label: t.work.kinds[k] })),
    ];
    return (
      <main id="main" className="container-page pt-40 pb-32">
        <KineticHeading as="h1" reveal="load" className="type-poster text-[clamp(4rem,1rem+12vw,15rem)]">
          {t.projects.title}
        </KineticHeading>
        <p className="mt-6 mb-14 max-w-[46ch] text-step-1 text-graphite">{t.projects.lead}</p>
        <ProjectIndex items={items} filters={filters} t={{ filterLabel: t.projects.filterLabel, showing: t.projects.showing }} />
      </main>
    );
  }
  return (
    <main id="main" className="container-page pt-40 pb-24">
      <h1 className="type-poster text-step-5">{t.contact.title}</h1>
    </main>
  );
}
