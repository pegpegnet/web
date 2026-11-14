import { KineticHeading } from '@/components/motion/KineticHeading';
import { getProject, image, textOf } from '@/lib/projects';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';
import { OpenSourceShelf, type ShelfApp } from './OpenSourceShelf';

// Dock order, with each app's icon and the screenshot its window shows.
const APPS: { slug: string; icon: string; shot: string }[] = [
  { slug: 'abadia', icon: 'abadia-icon', shot: 'abadia-remake' },
  { slug: 'shinymac', icon: 'shinymac-icon', shot: 'shinymac-smartcare' },
  { slug: 'forest', icon: 'forest-icon', shot: 'forest-workspace' },
  { slug: 'app-visionos-yutub', icon: 'yutub-logo', shot: 'yutub-screenshot' },
];

export function OpenSource({ locale, t }: { locale: Locale; t: Dictionary['openSource'] }) {
  const apps: ShelfApp[] = APPS.map(({ slug, icon, shot }) => {
    const project = getProject(slug)!;
    const text = textOf(project, locale);
    return {
      slug,
      href: href(locale, 'projects', slug),
      name: text.name,
      summary: text.summary,
      icon: image(icon).src,
      shot: image(shot),
      links: project.links.map((l) => ({
        label: l.href.includes('/releases') ? t.download : l.href.includes('github.com') ? t.source : l.label[locale],
        href: l.href,
      })),
    };
  });
  return (
    <section id="open-source" aria-labelledby="open-source-title" className="bg-bone py-28 md:py-36">
      <div className="container-page">
        <KineticHeading id="open-source-title" className="type-poster max-w-[16ch] text-step-5">
          {t.title}
        </KineticHeading>
        <p className="mt-5 mb-14 max-w-[44ch] text-step-1 leading-relaxed text-graphite">{t.lead}</p>
        <OpenSourceShelf apps={apps} t={t} />
      </div>
    </section>
  );
}
