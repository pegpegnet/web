import Link from 'next/link';
import { Wordmark } from './Wordmark';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

/** A quiet footer: the studio in a line, where it is, where to go next. */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const home = href(locale);
  const year = new Date().getFullYear();
  const heading = 'font-mono text-[11px] uppercase tracking-[0.18em] text-dust';
  const link = 'text-step--1 text-starlight/85 no-underline transition-colors hover:text-flare';
  return (
    <footer className="border-t border-rim bg-nebula">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark href={home} />
          <p className="mt-4 max-w-[36ch] text-step--1 leading-relaxed text-haze">{t.footer.about}</p>
        </div>
        <div className="md:col-span-3">
          <h2 className={heading}>{t.footer.studio}</h2>
          <address className="mt-3 text-step--1 leading-relaxed not-italic">
            Calle de Luis Antúnez&nbsp;6
            <br />
            08006 Barcelona
          </address>
        </div>
        <nav className="md:col-span-2" aria-label={t.footer.sitemap}>
          <h2 className={heading}>{t.footer.sitemap}</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className={link} href={href(locale, 'projects')}>{t.projects.title}</Link></li>
            <li><Link className={link} href={`${home}#services`}>{t.nav.services}</Link></li>
            <li><Link className={link} href={`${home}#studio`}>{t.nav.about}</Link></li>
            <li><Link className={link} href={href(locale, 'contact')}>{t.nav.contact}</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-2">
          <h2 className={heading}>{t.footer.follow}</h2>
          <ul className="mt-3 space-y-2">
            <li><a className={link} rel="me external" href="https://www.linkedin.com/company/pegpeg">LinkedIn</a></li>
            <li><a className={link} rel="me external" href="https://github.com/pegpegnet">GitHub</a></li>
            <li><a className={link} rel="me external" href="https://x.com/pegpegnet">X</a></li>
          </ul>
        </div>
      </div>
      <div className="container-page flex justify-between border-t border-rim py-6 text-step--1 text-haze">
        <p>© {year} PegPeg</p>
        <p>Barcelona</p>
      </div>
    </footer>
  );
}
