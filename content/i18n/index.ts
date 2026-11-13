import type { Locale } from '@/lib/i18n';
import en, { type Dictionary } from './en';

const dictionaries: Record<Locale, Dictionary> = { en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
export type { Dictionary };
