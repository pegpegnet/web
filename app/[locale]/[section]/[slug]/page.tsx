import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, segments, isLocale, sectionFor } from '@/lib/i18n';
import { getProject, image, projects, textOf } from '@/lib/projects';
import { getDictionary } from '@/content/i18n';
import { ProjectPage } from '@/components/project/ProjectPage';

export const dynamicParams = false;

type Params = Promise<{ locale: string; section: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, section: segments.projects[locale], slug: p.slug })));
}

async function resolve(params: Params) {
  const { locale, section, slug } = await params;
  if (!isLocale(locale) || sectionFor(locale, section) !== 'projects') notFound();
  const project = getProject(slug);
  if (!project) notFound();
  return { locale, project, text: textOf(project, locale) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { project, text } = await resolve(params);
  const cover = project.cover ? image(project.cover) : undefined;
  return {
    title: text.name,
    description: text.summary,
    openGraph: cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height }] } : undefined,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { locale, project } = await resolve(params);
  return <ProjectPage locale={locale} project={project} t={getDictionary(locale)} />;
}
