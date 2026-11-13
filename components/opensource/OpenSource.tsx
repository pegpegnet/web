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
    <section id="open-source" aria-labelledby="open-source-title" className="dark bg-char py-28 text-bone">
      <div className="container-page">
        <KineticHeading id="open-source-title" className="type-poster max-w-[14ch] text-[clamp(3rem,1rem+7vw,9rem)]">
          {t.title}
        </KineticHeading>
        <p className="mt-6 mb-16 max-w-[44ch] text-step-1 leading-snug text-ash">{t.lead}</p>
        <OpenSourceShelf apps={apps} t={t} />
      </div>
    </section>
  );
}
