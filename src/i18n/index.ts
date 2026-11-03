import es from './es.json';
import en from './en.json';
import ca from './ca.json';

export const locales = ['es', 'en', 'ca'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

const messages = { es, en, ca } satisfies Record<Locale, Record<string, string>>;
export type MessageKey = keyof typeof es;

/** Returns the message for `key` in `locale`. Messages may contain trusted inline HTML. */
export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}

export function isLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '');
}

/** Localized path segments, matching the URLs of the previous site. */
export const segments = {
  projects: { es: 'proyectos', en: 'projects', ca: 'projectes' },
  services: { es: 'servicios', en: 'services', ca: 'serveis' },
  glossary: { es: 'glosario', en: 'glossary', ca: 'glossari' },
  contact: { es: 'contacto', en: 'contact', ca: 'contacte' },
  sent: { es: 'enviado', en: 'sent', ca: 'enviat' },
  notSent: { es: 'noenviado', en: 'not-sent', ca: 'no-enviat' },
  mobileApps: { es: 'aplicaciones-moviles', en: 'mobile-apps', ca: 'aplicacions-mobils' },
  webApps: { es: 'aplicaciones-web', en: 'web-apps', ca: 'aplicacions-web' },
  ai: { es: 'soluciones-ia', en: 'ai-solutions', ca: 'solucions-ia' },
} as const satisfies Record<string, Record<Locale, string>>;

export type Section = keyof typeof segments;

/** Absolute path for a section (and optional child slug) in a locale, with trailing slash. */
export function path(locale: Locale, section?: Section, slug?: string): string {
  const parts: string[] = [locale];
  if (section) parts.push(segments[section][locale]);
  if (slug) parts.push(slug);
  return `/${parts.join('/')}/`;
}
