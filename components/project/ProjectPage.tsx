import Link from 'next/link';
import type { CSSProperties } from 'react';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { RevealImage } from './RevealImage';
import { VideoFacade } from './VideoFacade';
import { href, type Locale } from '@/lib/i18n';
import { image, nextProject, textOf, type Project } from '@/lib/projects';
import { isDark } from '@/lib/color';
import type { Dictionary } from '@/content/i18n';

/** A project's case study, in the project's own colours. */
export function ProjectPage({ locale, project, t }: { locale: Locale; project: Project; t: Dictionary }) {
  const text = textOf(project, locale);
  const dark = isDark(project.theme.bg);
  const cover = project.cover ? image(project.cover) : null;
  const gallery = project.gallery.map(image);
  const next = nextProject(project.slug);
  const nextText = textOf(next, locale);
  const kinds = [...new Set(project.kinds.map((k) => t.work.kinds[k]))].join(', ');
  const style = { '--p-bg': project.theme.bg, '--p-fg': project.theme.fg, '--p-accent': project.theme.accent } as CSSProperties;

  return (
    <main id="main" style={style} className={`bg-[var(--p-bg)] text-[var(--p-fg)] ${dark ? 'dark' : ''}`}>
      <header className="container-page pt-36 pb-16">
        <p className="text-step--1 font-semibold">
          <Link href={href(locale, 'projects')} className="no-underline opacity-70 hover:opacity-100">
            {t.project.all}
          </Link>
        </p>
        <KineticHeading as="h1" reveal="load" className="type-poster mt-5 max-w-[16ch] text-step-6">
          {text.name}
        </KineticHeading>
        <p className="mt-6 max-w-[40ch] text-step-2 leading-snug opacity-80">{text.summary}</p>
      </header>

      {cover && (
        <div className="container-page">
          <RevealImage {...cover} alt={text.name} eager className="aspect-[16/9] max-h-[80svh] w-full rounded-[2rem]" />
        </div>
      )}

      {/* Facts */}
      <dl className="container-page mt-16 grid gap-8 border-b border-current/15 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-step--1 font-semibold opacity-70">{t.project.kind}</dt>
          <dd className="mt-2 text-step-1">{kinds}</dd>
        </div>
        {project.platforms.length > 0 && (
          <div>
            <dt className="text-step--1 font-semibold opacity-70">{t.project.platforms}</dt>
            <dd className="mt-2 text-step-1">{project.platforms.join(', ')}</dd>
          </div>
        )}
        {project.year && (
          <div>
            <dt className="text-step--1 font-semibold opacity-70">{t.project.year}</dt>
            <dd className="mt-2 text-step-1 tabular-nums">{project.year}</dd>
          </div>
        )}
        {project.links.length > 0 && (
          <div>
            <dt className="text-step--1 font-semibold opacity-70">{t.project.links}</dt>
            <dd className="mt-3 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <MagneticButton key={l.href} href={l.href} variant="outline" tone={dark ? 'dark' : 'light'}>
                  {l.label[locale]}
                </MagneticButton>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {/* The story */}
      {text.sections.map((s) => (
        <section key={s.heading} className="container-page grid gap-6 py-16 md:grid-cols-12">
          <h2 className="text-step-2 font-semibold tracking-[-0.02em] md:col-span-4">{s.heading}</h2>
          <div className="space-y-5 text-step-1 leading-relaxed md:col-span-7 md:col-start-6">
            {s.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
            {s.list && (
              <ul className="space-y-3">
                {s.list.map((li) => (
                  <li key={li} className="flex gap-4">
                    <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 rounded-full bg-[var(--p-accent)]" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      {/* Gallery, in an alternating rhythm rather than a grid */}
      {gallery.length > 0 && (
        <div className="container-page grid gap-6 py-12 md:grid-cols-12">
          {gallery.map((img, i) => (
            <RevealImage
              key={img.src}
              {...img}
              alt={`${text.name}, ${i + 1}`}
              className={`${i % 3 === 0 ? 'md:col-span-8' : i % 3 === 1 ? 'md:col-span-4 md:self-end' : 'md:col-span-6 md:col-start-4'} rounded-2xl bg-black/5`}
            />
          ))}
        </div>
      )}

      {project.youtube && (
        <div className="container-page py-12">
          <VideoFacade id={project.youtube} title={text.name} poster={cover?.src} label={t.project.video} />
        </div>
      )}

      {project.press && (
        <section className="container-page grid gap-6 py-12 md:grid-cols-12">
          <h2 className="text-step-2 font-semibold tracking-[-0.02em] md:col-span-4">{t.project.press}</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-step-1 md:col-span-7 md:col-start-6">
            {project.press.map((p) => (
              <li key={p.href}>
                <a href={p.href} rel="external" className="underline decoration-1 underline-offset-4 hover:text-[var(--p-accent)]">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Next project */}
      <nav aria-label={t.project.next} className="mt-16 border-t border-current/15">
        <Link
          href={href(locale, 'projects', next.slug)}
          className="group relative block overflow-hidden no-underline"
        >
                    <span className="container-page relative block py-20">
            <span className="block text-step--1 font-semibold opacity-70">{t.project.next}</span>
            <span className="type-poster mt-2 flex items-center gap-4 text-step-5">{nextText.name}<span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span></span>
          </span>
        </Link>
      </nav>
    </main>
  );
}
