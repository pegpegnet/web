/**
 * Languages and URLs. Every page lives under a language prefix (/en/, /es/, /ca/), and section
 * names are translated in the URL, matching the addresses of the previous site.
 */
export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const segments = {
  projects: { en: 'projects' },
  contact: { en: 'contact' },
  sent: { en: 'sent' },
  notSent: { en: 'not-sent' },
} as const satisfies Record<string, Record<Locale, string>>;

export type Section = keyof typeof segments;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Absolute URL path, always with a trailing slash: href('en', 'projects', 'yutub') → /en/projects/yutub/ */
export function href(locale: Locale, section?: Section, slug?: string): string {
  const parts: string[] = [locale];
  if (section) parts.push(segments[section][locale]);
  if (slug) parts.push(slug);
  return `/${parts.join('/')}/`;
}

/** Which section a translated URL segment belongs to in a language. */
export function sectionFor(locale: Locale, segment: string): Section | undefined {
  return (Object.keys(segments) as Section[]).find((s) => segments[s][locale] === segment);
}

/** The same page in every language, for the language switch and hreflang. */
export function alternates(section?: Section, slug?: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, href(l, section, slug)])) as Record<Locale, string>;
}
