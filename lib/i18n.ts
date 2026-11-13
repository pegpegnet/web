/**
 * Languages and URLs. Every page lives under a language prefix (/en/, /es/, /ca/), and section
 * names are translated in the URL, matching the addresses of the previous site.
 */
export const locales = ['es', 'en', 'ca'] as const;
export type Locale = (typeof locales)[number];
/** The previous site served Spanish by default; the bare domain negotiates (see public/.htaccess). */
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = { es: 'Español', en: 'English', ca: 'Català' };

export const segments = {
  projects: { es: 'proyectos', en: 'projects', ca: 'projectes' },
  contact: { es: 'contacto', en: 'contact', ca: 'contacte' },
  sent: { es: 'enviado', en: 'sent', ca: 'enviat' },
  notSent: { es: 'noenviado', en: 'not-sent', ca: 'no-enviat' },
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

/** The current page in every language, worked out from its path (for the language switch). */
export function alternatesFromPath(pathname: string): Record<Locale, string> | null {
  const [first, second, third] = pathname.split('/').filter(Boolean);
  if (!first || !isLocale(first)) return null;
  const section = second ? sectionFor(first, second) : undefined;
  if (second && !section) return null;
  return alternates(section, third);
}
