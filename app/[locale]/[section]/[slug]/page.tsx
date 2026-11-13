import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, segments, isLocale, sectionFor } from '@/lib/i18n';
import { getProject, projects, textOf } from '@/lib/projects';

export const dynamicParams = false;

type Params = Promise<{ locale: string; section: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((p) => ({ locale, section: segments.projects[locale], slug: p.slug })),
  );
}

async function resolve(params: Params) {
  const { locale, section, slug } = await params;
  if (!isLocale(locale) || sectionFor(locale, section) !== 'projects') notFound();
  const project = getProject(slug);
  if (!project) notFound();
  return { locale, project, text: textOf(project, locale) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { text } = await resolve(params);
  return { title: text.name, description: text.summary };
}

/** Project page. A plain version for now; the full case-study design arrives later in the series. */
export default async function ProjectPage({ params }: { params: Params }) {
  const { text } = await resolve(params);
  return (
    <main id="main" className="container-page pt-40 pb-24">
      <h1 className="type-poster text-step-5">{text.name}</h1>
      <p className="mt-6 max-w-[44ch] text-step-1 text-graphite">{text.summary}</p>
      {text.sections.map((s) => (
        <section key={s.heading} className="mt-12 max-w-[64ch]">
          <h2 className="font-sans text-step-2 font-bold tracking-normal">{s.heading}</h2>
          {s.body.map((b) => (
            <p key={b} className="mt-4">
              {b}
            </p>
          ))}
          {s.list && (
            <ul className="mt-4 list-disc space-y-1 pl-5">
              {s.list.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
