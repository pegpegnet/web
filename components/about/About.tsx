import type { Dictionary } from '@/content/i18n';
import { StretchLines } from './StretchLines';

/** The studio: three statements in moving type, a paragraph about PegPeg, and how we work. */
export function About({ t }: { t: Dictionary['about'] }) {
  return (
    <section id="studio" aria-label={t.lines.join(' ')} className="bg-chalk py-32">
      <div className="container-page">
        <StretchLines lines={t.lines} />
        <div className="mt-24 grid gap-16 md:grid-cols-12">
          <p className="text-step-2 leading-snug md:col-span-7">{t.intro}</p>
          <ul className="grid gap-10 md:col-span-4 md:col-start-9">
            {t.principles.map((p) => (
              <li key={p.title} className="border-t border-line pt-5">
                <h3 className="font-sans text-step-1 font-bold tracking-normal">{p.title}</h3>
                <p className="mt-2 text-graphite">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
