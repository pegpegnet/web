import type { Locale } from '@/lib/i18n';
import en, { type Dictionary } from './en';
import es from './es';
import ca from './ca';

const dictionaries: Record<Locale, Dictionary> = { es, en, ca };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
export type { Dictionary };
