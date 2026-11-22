import Link from 'next/link';
import { alternates, href, localeNames, locales, type Locale } from '@/lib/i18n';
import { worlds } from '@/lib/universe';
import type { Dictionary } from '@/content/i18n';
import { HideOnFocus } from './FocusBar';

/** Small uppercase monospace text: the instrument labels of the interface. */
export const label = 'font-mono text-[11px] uppercase tracking-[0.18em]';

/**
 * The interface over the universe: wordmark, navigation and languages along the top, the headline
 * and the controls along the bottom. Rendered on the server, so it's there before any 3D loads.
 */
export function Hud({ locale, t }: { locale: Locale; t: Dictionary }) {
  const languages = alternates();
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-[var(--spacing-gutter)] pt-5 pb-7 md:pb-9">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,rgb(2_3_8/0.82),rgb(2_3_8/0.35)_45%,transparent)]" />

      <header className="pointer-events-auto relative flex items-center justify-between gap-6">
        <Link href={href(locale)} className="font-ui text-[19px] font-semibold tracking-[-0.04em] no-underline" aria-label="PegPeg">
          pegpeg
        </Link>
        <nav aria-label={t.nav.mainNav} className={`flex items-center gap-5 md:gap-8 ${label}`}>
          <Link href={href(locale, 'projects')} className="no-underline text-starlight/75 transition-colors hover:text-starlight">
            {t.projects.title}
          </Link>
          <Link href={href(locale, 'contact')} className="no-underline text-starlight/75 transition-colors hover:text-starlight">
            {t.nav.contact}
          </Link>
          <ul className="flex gap-2.5" aria-label={t.nav.language}>
            {locales.map((l) => (
              <li key={l}>
                <a
                  href={languages[l]}
                  hrefLang={l}
                  lang={l}
                  aria-label={localeNames[l]}
                  aria-current={l === locale ? 'true' : undefined}
                  className="no-underline text-starlight/45 transition-colors hover:text-starlight aria-[current=true]:text-flare"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <HideOnFocus className="relative flex items-end justify-between gap-10">
        <div className="max-w-[48rem]">
          <p className={`${label} text-starlight/55`}>{t.universe.system.replace('{n}', String(worlds.length))}</p>
          <h1 className="mt-5 font-serif text-[clamp(3.1rem,1.3rem+5.8vw,7.6rem)] leading-[0.9] font-normal tracking-[-0.02em] text-balance">
            {t.universe.title} <em className="text-flare-soft">{t.universe.titleEm}</em>
          </h1>
          <p className="mt-6 max-w-[42ch] font-ui text-[15px] leading-relaxed text-starlight/70 md:text-[16px]">{t.hero.lead}</p>
        </div>
        <p className={`${label} hidden shrink-0 text-starlight/50 md:block pointer-coarse:hidden`}>{t.universe.hint}</p>
        <p className={`${label} hidden shrink-0 text-starlight/50 pointer-coarse:md:block`}>{t.universe.hintTouch}</p>
      </HideOnFocus>
    </div>
  );
}
