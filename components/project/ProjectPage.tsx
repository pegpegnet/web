import Link from 'next/link';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Portrait } from '@/components/universe/Portrait';
import { RevealImage } from './RevealImage';
import { VideoFacade } from './VideoFacade';
import { href, type Locale } from '@/lib/i18n';
import { image, nextProject, textOf, type Project } from '@/lib/projects';
import { getWorld, worlds } from '@/lib/universe';
import type { Dictionary } from '@/content/i18n';

const label = 'font-mono text-[11px] uppercase tracking-[0.18em]';
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A project's case study. At the top, the project's world turning beside its name; then the facts,
 * the story, the pictures, and the next world along.
 */
export function ProjectPage({ locale, project, t }: { locale: Locale; project: Project; t: Dictionary }) {
  const text = textOf(project, locale);
  const world = getWorld(project.slug);
  const cover = project.cover ? image(project.cover) : null;
  const gallery = project.gallery.map(image);
  const next = nextProject(project.slug);
  const nextText = textOf(next, locale);
  const nextWorld = getWorld(next.slug);
  const kinds = [...new Set(project.kinds.map((k) => t.work.kinds[k]))].join(', ');

  return (
    <main id="main">
      <header className="container-page grid items-center gap-10 pt-10 pb-16 md:grid-cols-12 md:pt-16">
        <div className="md:col-span-6">
          <p className={`${label} text-haze`}>
            <Link href={href(locale, 'projects')} className="no-underline hover:text-starlight">
              {t.project.all}
            </Link>
            {world && (
              <span>
                {' '}
                · {t.universe.of.replace('{n}', pad(world.number)).replace('{total}', String(worlds.length))} · {t.universe.types[world.type]}
              </span>
            )}
          </p>
          <KineticHeading as="h1" reveal="load" className="type-poster mt-6 max-w-[14ch] text-[clamp(3.4rem,1.8rem+5vw,7.5rem)]">
            {text.name}
          </KineticHeading>
          <p className="mt-6 max-w-[40ch] text-step-1 leading-relaxed text-haze">{text.summary}</p>
        </div>
        {world ? (
          <Portrait slug={project.slug} className="aspect-square w-full rounded-[2rem] md:col-span-6" />
        ) : (
          cover && <RevealImage {...cover} alt={text.name} eager className="aspect-[4/3] w-full md:col-span-6" />
        )}
      </header>

      <dl className="container-page grid gap-8 border-y border-rim py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className={`${label} text-dust`}>{t.project.kind}</dt>
          <dd className="mt-2 text-step-1">{kinds}</dd>
        </div>
        {project.platforms.length > 0 && (
          <div>
            <dt className={`${label} text-dust`}>{t.project.platforms}</dt>
            <dd className="mt-2 text-step-1">{project.platforms.join(', ')}</dd>
          </div>
        )}
        {project.year && (
          <div>
            <dt className={`${label} text-dust`}>{t.project.year}</dt>
            <dd className="mt-2 text-step-1 tabular-nums">{project.year}</dd>
          </div>
        )}
        {project.links.length > 0 && (
          <div>
            <dt className={`${label} text-dust`}>{t.project.links}</dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {project.links.map((l) => (
                <MagneticButton key={l.href} href={l.href} variant="outline" tone="dark">
                  {l.label[locale]} <span aria-hidden="true">↗</span>
                </MagneticButton>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {world && cover && (
        <div className="container-page mt-16">
          <RevealImage {...cover} alt={text.name} className="aspect-[16/9] max-h-[80svh] w-full rounded-[2rem]" />
        </div>
      )}

      {text.sections.map((s) => (
        <section key={s.heading} className="container-page grid gap-6 py-16 md:grid-cols-12">
          <h2 className="text-[clamp(1.9rem,1.5rem+1.2vw,2.6rem)] md:col-span-4">{s.heading}</h2>
          <div className="space-y-5 text-step-1 leading-relaxed text-starlight/85 md:col-span-7 md:col-start-6">
            {s.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
            {s.list && (
              <ul className="space-y-3">
                {s.list.map((li) => (
                  <li key={li} className="flex gap-4">
                    <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-flare" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      {gallery.length > 0 && (
        <div className="container-page grid gap-6 py-12 md:grid-cols-12">
          {gallery.map((img, i) => (
            <RevealImage
              key={img.src}
              {...img}
              alt={`${text.name}, ${i + 1}`}
              className={`${i % 3 === 0 ? 'md:col-span-8' : i % 3 === 1 ? 'md:col-span-4 md:self-end' : 'md:col-span-6 md:col-start-4'} rounded-2xl bg-nebula`}
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
          <h2 className="text-[clamp(1.9rem,1.5rem+1.2vw,2.6rem)] md:col-span-4">{t.project.press}</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-step-1 md:col-span-7 md:col-start-6">
            {project.press.map((p) => (
              <li key={p.href}>
                <a href={p.href} rel="external" className="underline decoration-1 underline-offset-4 hover:text-flare">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label={t.project.next} className="mt-16 border-t border-rim">
        <Link href={href(locale, 'projects', next.slug)} className="group container-page block py-20 no-underline">
          <span className={`${label} block text-haze`}>
            {t.project.next}
            {nextWorld ? ` · ${t.universe.types[nextWorld.type]}` : ''}
          </span>
          <span className="type-poster mt-3 flex items-center gap-5 text-[clamp(3rem,1.6rem+5vw,7rem)] transition-colors group-hover:text-flare-soft">
            {nextText.name}
            <span aria-hidden="true" className="inline-block text-[0.6em] transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </span>
        </Link>
      </nav>
    </main>
  );
}
