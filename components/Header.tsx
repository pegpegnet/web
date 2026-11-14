'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Wordmark } from './Wordmark';
import { alternatesFromPath, href, localeNames, locales, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

type Props = { locale: Locale; t: Dictionary['nav'] & { menu: string; close: string; mainNav: string } };

/** Fixed header: wordmark, section links and languages on wide screens, a full-screen menu on small ones. */
export function Header({ locale, t }: Props) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const home = href(locale);
  const switchTo = alternatesFromPath(pathname) ?? Object.fromEntries(locales.map((l) => [l, href(l)]));
  const languages = (
    <ul className="flex gap-1" aria-label={t.language}>
      {locales.map((l) => (
        <li key={l}>
          <a
            href={switchTo[l]}
            hrefLang={l}
            lang={l}
            aria-label={localeNames[l]}
            aria-current={l === locale ? 'true' : undefined}
            className="block rounded-full px-2 py-1.5 text-step--1 font-medium uppercase no-underline opacity-55 transition-opacity hover:opacity-100 aria-[current=true]:opacity-100"
          >
            {l}
          </a>
        </li>
      ))}
    </ul>
  );
  const links = [
    { label: t.work, to: `${home}#work` },
    { label: t.services, to: `${home}#services` },
    { label: t.about, to: `${home}#studio` },
    { label: t.contact, to: href(locale, 'contact') },
  ];

  // A backdrop once the page has moved, and light text over dark sections.
  useEffect(() => {
    let last = window.scrollY;
    const sample = () => {
      // What is just under the header? Dark sections and chapters carry the .dark class.
      const probe = document.elementFromPoint(window.innerWidth / 2, 72);
      setOnDark(!!probe?.closest('.dark'));
    };
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setSolid(y > 40);
      sample();
      last = y;
    };
    // At most once per frame, however many scroll events arrive.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    const late = window.setTimeout(sample, 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(late);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // A new page may start on a different surface: look again once it has painted (and after the curtain lifts).
  useEffect(() => {
    const look = () => setOnDark(!!document.elementFromPoint(window.innerWidth / 2, 72)?.closest('.dark'));
    const timers = [80, 400, 1000].map((ms) => window.setTimeout(look, ms));
    return () => timers.forEach(window.clearTimeout);
  }, [pathname]);

  // Escape closes the menu and returns focus to the button; the page behind can't scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b transition-[opacity,background-color] duration-300 ${
          onDark ? 'border-white/10 bg-char/95' : 'border-line bg-bone/95'
        } ${solid && !open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`container-page relative flex h-16 items-center justify-between transition-colors duration-300 ${onDark && !open ? 'text-bone' : ''}`}
      >
        <Wordmark href={home} className={onDark && !open ? '!text-bone' : 'relative z-10'} />

        <nav aria-label={t.mainNav} className="hidden items-center gap-6 md:flex">
          <ul className="flex gap-6">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  href={l.to}
                  className={`text-step--1 font-medium no-underline transition-colors ${
                    onDark ? 'text-bone/75 hover:text-bone' : 'text-graphite hover:text-char'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {languages}
        </nav>

        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
          className={`relative z-10 flex h-10 items-center gap-3 rounded-full px-4 text-step--1 font-medium md:hidden ${
            onDark && !open ? 'bg-bone text-char' : 'bg-chalk text-char'
          }`}
        >
          {open ? t.close : t.menu}
          <span aria-hidden="true" className="relative block h-2.5 w-4">
            <span
              className={`absolute left-0 h-[2px] w-4 bg-current transition-transform duration-500 ease-out-expo ${open ? 'top-1 rotate-45' : 'top-0'}`}
            />
            <span
              className={`absolute left-0 h-[2px] w-4 bg-current transition-transform duration-500 ease-out-expo ${open ? 'top-1 -rotate-45' : 'top-2'}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 flex flex-col bg-bone pt-24 pb-12 text-char md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.2 }}
          >
            <nav aria-label={t.mainNav} className="container-page">
              <ul>
                {links.map((l, i) => (
                  <li key={l.to} className="border-b border-line">
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.3 }}
                    >
                      <Link
                        href={l.to}
                        onClick={() => setOpen(false)}
                        className="block py-4 text-step-3 font-semibold tracking-[-0.03em] no-underline"
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">{languages}</div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
