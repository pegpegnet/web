'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wordmark } from './Wordmark';
import { alternatesFromPath, href, localeNames, locales, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

type Props = { locale: Locale; t: Dictionary['nav'] & { menu: string; close: string; mainNav: string }; system: string };

const label = 'font-mono text-[11px] uppercase tracking-[0.18em]';

/**
 * The top bar of every page but the home page, matching the home page's own: the wordmark, the way
 * back to the system, the projects, the studio, contact and the languages. It fits on a phone
 * without a menu.
 */
export function Header({ locale, t, system }: Props) {
  const pathname = usePathname();
  const home = href(locale);
  const switchTo = alternatesFromPath(pathname) ?? Object.fromEntries(locales.map((l) => [l, href(l)]));
  const link = 'no-underline text-starlight/70 transition-colors hover:text-starlight aria-[current=page]:text-flare';
  const projects = href(locale, 'projects');
  const contact = href(locale, 'contact');
  return (
    <header className="sticky top-0 z-50 bg-[linear-gradient(rgb(2_3_8/0.92),rgb(2_3_8/0.75)_70%,transparent)]">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Wordmark href={home} />
        <nav aria-label={t.mainNav} className={`flex items-center gap-4 md:gap-8 ${label}`}>
          <Link href={home} className={`${link} max-md:hidden`}>
            {system}
          </Link>
          <Link href={projects} className={link} aria-current={pathname === projects ? 'page' : undefined}>
            {t.work}
          </Link>
          <Link href={`${home}#studio`} className={`${link} max-sm:hidden`}>
            {t.about}
          </Link>
          <Link href={contact} className={link} aria-current={pathname === contact ? 'page' : undefined}>
            {t.contact}
          </Link>
          <ul className="flex gap-2.5" aria-label={t.language}>
            {locales.map((l) => (
              <li key={l}>
                <a
                  href={switchTo[l]}
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
      </div>
    </header>
  );
}
