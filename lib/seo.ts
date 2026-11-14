import type { Metadata } from 'next';
import { alternates, defaultLocale, href, type Locale, type Section } from './i18n';

/** Canonical URL and hreflang alternates for a page that exists in every language. */
export function languageAlternates(locale: Locale, section?: Section, slug?: string): Metadata['alternates'] {
  const all = alternates(section, slug);
  return {
    canonical: href(locale, section, slug),
    languages: { ...all, 'x-default': all[defaultLocale] },
  };
}
