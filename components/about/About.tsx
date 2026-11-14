import type { Dictionary } from '@/content/i18n';
import { KineticHeading } from '@/components/motion/KineticHeading';

/** The studio: three statements in moving type, a paragraph about PegPeg, and how we work. */
export function About({ t }: { t: Dictionary['about'] }) {
  return (
    <section id="studio" aria-label={t.lines.join(' ')} className="bg-bone py-28 md:py-36">
      <div className="container-page">
        <KineticHeading className="type-poster max-w-[20ch] text-step-5">{t.lines.join(' ')}</KineticHeading>
        <div className="mt-16 grid gap-14 md:grid-cols-12">
          <p className="text-step-2 leading-snug tracking-[-0.015em] text-graphite md:col-span-7">{t.intro}</p>
          <ul className="grid gap-10 md:col-span-4 md:col-start-9">
            {t.principles.map((p) => (
              <li key={p.title} className="border-t border-line pt-5">
                <h3 className="text-step-1 font-semibold tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-2 text-graphite">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
