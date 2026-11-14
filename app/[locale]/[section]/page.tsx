import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, segments, isLocale, sectionFor, type Section } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';
import { ProjectIndex, type IndexItem } from '@/components/projects/ProjectIndex';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { listedProjects, image, textOf } from '@/lib/projects';
import { href } from '@/lib/i18n';
import { ContactForm } from '@/components/contact/ContactForm';
import { languageAlternates } from '@/lib/seo';
import { MagneticButton } from '@/components/motion/MagneticButton';
import type { Kind } from '@/content/projects';

export const dynamicParams = false;

const pages: Section[] = ['projects', 'contact', 'sent', 'notSent'];

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
  const { locale, which, t } = await resolve(params);
  if (which === 'sent' || which === 'notSent') {
    return { title: which === 'sent' ? t.contact.sentTitle : t.contact.notSentTitle, robots: { index: false } };
  }
  return {
    title: which === 'projects' ? t.projects.title : t.nav.contact,
    description: which === 'projects' ? t.projects.lead : t.contact.pageLead,
    alternates: languageAlternates(locale, which),
  };
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
      <main id="main" className="container-page pt-32 pb-28 md:pt-40">
        <KineticHeading as="h1" reveal="load" className="type-poster text-step-6">
          {t.projects.title}
        </KineticHeading>
        <p className="mt-6 mb-14 max-w-[46ch] text-step-1 text-graphite">{t.projects.lead}</p>
        <ProjectIndex items={items} filters={filters} t={{ filterLabel: t.projects.filterLabel, showing: t.projects.showing }} />
      </main>
    );
  }
  if (which === 'sent' || which === 'notSent') {
    const ok = which === 'sent';
    return (
      <main id="main" className="container-page flex min-h-[80svh] flex-col justify-end pt-40 pb-24">
        <KineticHeading as="h1" reveal="load" className="type-poster max-w-[14ch] text-step-6">
          {ok ? t.contact.sentTitle : t.contact.notSentTitle}
        </KineticHeading>
        <p className="mt-8 max-w-[44ch] text-step-1 text-graphite">{ok ? t.contact.sentText : t.contact.notSentText}</p>
        <div className="mt-10">
          <MagneticButton href={ok ? href(locale) : href(locale, 'contact')}>{ok ? t.contact.sentAction : t.contact.notSentAction}</MagneticButton>
        </div>
      </main>
    );
  }
  return (
    <main id="main" className="container-page pt-32 pb-28 md:pt-40">
      <KineticHeading as="h1" reveal="load" className="type-poster text-step-6">
        {t.contact.pageTitle}
      </KineticHeading>
      <p className="mt-6 max-w-[40ch] text-step-1 text-graphite">{t.contact.pageLead}</p>
      <div className="mt-14 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm locale={locale} t={t.contact} />
        </div>
        <aside className="self-start rounded-[1.5rem] bg-chalk p-8 md:col-span-4 md:col-start-9" aria-labelledby="where-title">
          <h2 id="where-title" className="font-sans text-step--1 font-medium tracking-normal text-graphite">
            {t.contact.where}
          </h2>
          <address className="mt-3 text-step-1 leading-snug not-italic">
            Calle de Luis Antúnez&nbsp;6
            <br />
            08006 Barcelona
          </address>
          <ul className="mt-6 space-y-1 text-step-0 font-medium text-volt">
            <li><a href="https://www.linkedin.com/company/pegpeg" rel="me external" className="hover:underline">LinkedIn</a></li>
            <li><a href="https://github.com/pegpegnet" rel="me external" className="hover:underline">GitHub</a></li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
