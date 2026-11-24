import Link from 'next/link';
import { alternates, href, localeNames, locales, type Locale } from '@/lib/i18n';
import { worlds } from '@/lib/universe';
import type { Dictionary } from '@/content/i18n';
import { HideOnFocus } from './HideOnFocus';
import { HudNav } from './HudNav';
import { SoundToggle } from './SoundToggle';
import { ControlsHint } from './ControlsHint';
import type { CSSProperties } from 'react';

/** Words of a headline, each in its own span for the opening animation. */
function Words({ text, start = 0 }: { text: string; start?: number }) {
  return text.split(' ').map((w, i) => (
    <span key={i} className="intro-word" style={{ '--i': start + i } as CSSProperties}>
      {w}
      {'\u00a0'}
    </span>
  ));
}

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

      <header className="intro-fade pointer-events-auto relative flex items-center justify-between gap-6">
        <Link href={href(locale)} className="font-ui text-[19px] font-semibold tracking-[-0.04em] no-underline" aria-label="PegPeg">
          pegpeg
        </Link>
        <nav aria-label={t.nav.mainNav} className={`flex items-center gap-5 md:gap-8 ${label}`}>
          <HudNav index={t.universe.index} studio={t.universe.studio} />
          <Link href={href(locale, 'contact')} className="no-underline text-starlight/75 transition-colors hover:text-starlight">
            {t.nav.contact}
          </Link>
          <span className="max-md:hidden">
            <SoundToggle text={t.universe.sound} />
          </span>
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
          <p className={`intro-fade ${label} text-starlight/55`}>{t.universe.system.replace('{n}', String(worlds.length))}</p>
          <h1 className="mt-5 font-serif text-[clamp(3.1rem,1.3rem+5.8vw,7.6rem)] leading-[0.9] font-light tracking-[-0.02em] text-balance">
            <Words text={t.universe.title} />
            <em className="text-flare-soft not-italic">
              <Words text={t.universe.titleEm} start={t.universe.title.split(' ').length} />
            </em>
          </h1>
          <p className="intro-fade mt-6 max-w-[42ch] font-ui text-[15px] leading-relaxed text-starlight/70 md:text-[16px]">{t.hero.lead}</p>
        </div>
        <div className="intro-fade">
          <ControlsHint hint={t.universe.hint} hintTouch={t.universe.hintTouch} list={t.universe.indexTitle} />
        </div>
      </HideOnFocus>
    </div>
  );
}
