'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Wordmark } from './Wordmark';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

type Props = { locale: Locale; t: Dictionary['nav'] & { menu: string; close: string; mainNav: string } };

/** Fixed header: wordmark, section links on wide screens, and a full-screen menu on small ones. */
export function Header({ locale, t }: Props) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const toggle = useRef<HTMLButtonElement>(null);
  const home = href(locale);
  const links = [
    { label: t.work, to: `${home}#work` },
    { label: t.services, to: `${home}#services` },
    { label: t.about, to: `${home}#studio` },
    { label: t.contact, to: href(locale, 'contact') },
  ];

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
      <div className="container-page flex items-center justify-between py-5">
        <Wordmark href={home} className={open ? 'relative z-10 !text-bone' : ''} />

        <nav aria-label={t.mainNav} className="hidden md:block">
          <ul className="flex gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  href={l.to}
                  className="rounded-full px-4 py-2 text-step--1 font-semibold no-underline transition-colors hover:bg-char hover:text-bone"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
          className={`relative z-10 flex h-11 items-center gap-3 rounded-full px-5 text-step--1 font-semibold md:hidden ${
            open ? 'bg-bone text-char' : 'bg-char text-bone'
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
            className="fixed inset-0 flex flex-col justify-end bg-char pb-12 text-bone md:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduce ? 0.15 : 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label={t.mainNav} className="container-page">
              <ul>
                {links.map((l, i) => (
                  <li key={l.to} className="overflow-hidden">
                    <motion.div
                      initial={reduce ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={l.to}
                        onClick={() => setOpen(false)}
                        className="type-poster block py-1 text-[clamp(3.5rem,17vw,6rem)] no-underline transition-colors hover:text-ember focus-visible:text-ember"
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
