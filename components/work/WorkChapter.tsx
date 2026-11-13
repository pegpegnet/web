import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SceneView } from '@/components/three/SceneView';
import { href, type Locale } from '@/lib/i18n';
import { image, textOf, type Project } from '@/lib/projects';
import type { Dictionary } from '@/content/i18n';

type Props = {
  locale: Locale;
  project: Project;
  t: Dictionary['work'];
  /** The project's own 3D scene; until it exists the cover image stands in. */
  scene?: ReactNode;
};

/**
 * One full-screen chapter of Selected Work, in the project's own colours. Chapters are sticky,
 * so each one slides over the last (see WorkStack for the depth effect).
 */
export function WorkChapter({ locale, project, t, scene }: Props) {
  const text = textOf(project, locale);
  const cover = project.cover ? image(project.cover) : null;
  const meta = [
    ...project.kinds.map((k) => t.kinds[k]),
    ...project.platforms,
    ...(project.year ? [String(project.year)] : []),
  ];
  const style = {
    '--chapter-bg': project.theme.bg,
    '--chapter-fg': project.theme.fg,
    '--chapter-accent': project.theme.accent,
  } as CSSProperties;

  const fallback = cover ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cover.src}
      width={cover.width}
      height={cover.height}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-full w-full rounded-[2rem] object-cover"
    />
  ) : null;

  return (
    <article
      data-chapter
      aria-labelledby={`work-${project.slug}`}
      style={style}
      className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden bg-[var(--chapter-bg)] text-[var(--chapter-fg)]"
    >
      <div data-chapter-inner className="container-page grid w-full items-center gap-10 py-24 md:grid-cols-12">
        <div className="relative z-[2] md:col-span-5">
          <p className="text-step--1 font-semibold opacity-70">{meta.join(', ')}</p>
          <KineticHeading
            as="h3"
            id={`work-${project.slug}`}
            stretch
            className="type-poster mt-4 text-[clamp(3.4rem,1.6rem+7vw,9.5rem)]"
          >
            {text.name}
          </KineticHeading>
          <p className="mt-6 max-w-[34ch] text-step-1 leading-snug">{text.summary}</p>
          <div className="mt-10">
            <MagneticButton href={href(locale, 'projects', project.slug)} variant="outline">
              {t.view}
            </MagneticButton>
          </div>
        </div>
        <div className="md:col-span-7">
          {scene ? (
            <SceneView className="aspect-[4/3] w-full" fallback={fallback}>
              {scene}
            </SceneView>
          ) : (
            // The picture opens the project too; the button above is the accessible link, so this one is skipped.
            <Link
              href={href(locale, 'projects', project.slug)}
              data-cursor={t.viewCursor}
              tabIndex={-1}
              aria-hidden="true"
              className="block aspect-[4/3] w-full"
            >
              {fallback}
            </Link>
          )}
        </div>
      </div>
      {/* Darkens as the next chapter slides over this one */}
      <div data-chapter-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-char opacity-0" />
    </article>
  );
}
