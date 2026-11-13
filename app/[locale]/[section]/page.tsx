import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, segments, isLocale, sectionFor, type Section } from '@/lib/i18n';
import { getDictionary } from '@/content/i18n';

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
  const { which, t } = await resolve(params);
  return (
    <main className="container-page py-24">
      <h1 className="type-poster text-step-5">{which === 'projects' ? t.projects.title : t.contact.title}</h1>
    </main>
  );
}
