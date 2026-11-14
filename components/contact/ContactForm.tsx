'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

/**
 * The contact form: a plain HTML form that posts to /api/contact.php, so it works without
 * JavaScript too. Script only records when the page was opened (bots submit instantly) and shows
 * a sending state.
 */
export function ContactForm({ locale, t }: { locale: Locale; t: Dictionary['contact'] }) {
  const started = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (started.current) started.current.value = String(Math.floor(Date.now() / 1000));
  }, []);

  const field =
    'w-full border-0 border-b-2 border-char/25 bg-transparent px-0 pt-2 pb-3 text-step-2 text-char transition-colors placeholder:text-graphite/60 focus:border-volt focus:outline-none user-invalid:border-[#b42318]';
  const label = 'block text-step--1 font-semibold';

  return (
    <form method="post" action="/api/contact.php" onSubmit={() => setSending(true)} className="grid gap-10">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="t" ref={started} defaultValue="" />
      <div>
        <label htmlFor="c-name" className={label}>
          {t.name} <span className="font-normal text-graphite">({t.required})</span>
        </label>
        <input id="c-name" name="name" autoComplete="name" required maxLength={200} className={field} />
      </div>
      <div>
        <label htmlFor="c-email" className={label}>
          {t.email} <span className="font-normal text-graphite">({t.required})</span>
        </label>
        <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} className={field} />
      </div>
      <div>
        <label htmlFor="c-message" className={label}>
          {t.message} <span className="font-normal text-graphite">({t.required})</span>
        </label>
        <textarea id="c-message" name="message" rows={5} required maxLength={5000} className={`${field} resize-y`} />
      </div>
      {/* Left empty by people; bots that fill every field are dropped by the endpoint */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="justify-self-start rounded-full bg-char px-9 py-5 text-step-1 font-semibold text-bone transition-colors hover:bg-volt disabled:cursor-progress disabled:opacity-60"
      >
        {sending ? t.sending : t.send}
      </button>
    </form>
  );
}
