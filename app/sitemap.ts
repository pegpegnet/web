import type { MetadataRoute } from 'next';
import { alternates, defaultLocale, type Section } from '@/lib/i18n';
import { listedProjects } from '@/lib/projects';

export const dynamic = 'force-static';

const SITE = 'https://pegpeg.net';

/** Every public page, once per language, each listing its translations. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { section?: Section; slug?: string; priority: number }[] = [
    { priority: 1 },
    { section: 'projects', priority: 0.8 },
    { section: 'contact', priority: 0.6 },
    ...listedProjects.map((p) => ({ section: 'projects' as const, slug: p.slug, priority: 0.6 })),
  ];
  return pages.flatMap(({ section, slug, priority }) => {
    const all = alternates(section, slug);
    const languages = Object.fromEntries(Object.entries(all).map(([l, path]) => [l, SITE + path]));
    return Object.values(all).map((path) => ({
      url: SITE + path,
      priority: path === all[defaultLocale] ? priority : priority * 0.9,
      alternates: { languages },
    }));
  });
}
