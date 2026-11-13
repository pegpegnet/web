import Link from 'next/link';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

/** Charcoal footer: where to find the studio, where to go next, and the wordmark set as big as the page allows. */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const home = href(locale);
  const year = new Date().getFullYear();
  return (
    <footer className="dark overflow-hidden bg-char text-bone">
      <div className="container-page grid gap-12 pt-20 pb-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="max-w-[30ch] text-step-1 leading-snug">{t.footer.about}</p>
        </div>
        <div className="md:col-span-2 md:col-start-7">
          <h2 className="font-sans text-step--1 font-semibold tracking-normal text-ash">{t.footer.studio}</h2>
          <address className="mt-3 not-italic">
            Calle de Luis Antúnez&nbsp;6
            <br />
            08006 Barcelona
          </address>
        </div>
        <nav className="md:col-span-2" aria-label={t.footer.sitemap}>
          <h2 className="font-sans text-step--1 font-semibold tracking-normal text-ash">{t.footer.sitemap}</h2>
          <ul className="mt-3 space-y-1">
            <li><Link className="no-underline hover:text-ember" href={`${home}#work`}>{t.nav.work}</Link></li>
            <li><Link className="no-underline hover:text-ember" href={`${home}#services`}>{t.nav.services}</Link></li>
            <li><Link className="no-underline hover:text-ember" href={href(locale, 'projects')}>{t.projects.title}</Link></li>
            <li><Link className="no-underline hover:text-ember" href={href(locale, 'contact')}>{t.nav.contact}</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-2">
          <h2 className="font-sans text-step--1 font-semibold tracking-normal text-ash">{t.footer.follow}</h2>
          <ul className="mt-3 space-y-1">
            <li><a className="no-underline hover:text-ember" rel="me external" href="https://www.linkedin.com/company/pegpeg">LinkedIn</a></li>
            <li><a className="no-underline hover:text-ember" rel="me external" href="https://github.com/pegpegnet">GitHub</a></li>
            <li><a className="no-underline hover:text-ember" rel="me external" href="https://x.com/pegpegnet">X</a></li>
          </ul>
        </div>
      </div>

      <div className="container-page flex items-end justify-between gap-6 pb-6 text-step--1 text-ash">
        <p>© {year} PegPeg</p>
        <p>Barcelona</p>
      </div>

      {/* The wordmark, cropped by the bottom edge of the page */}
      <p
        aria-hidden="true"
        className="-mb-[0.2em] text-center font-display leading-[0.8] font-[850] tracking-[-0.04em] text-volt select-none [font-size:clamp(4rem,20.5vw,23rem)] [font-stretch:112%]"
      >
        pegpeg
      </p>
    </footer>
  );
}
