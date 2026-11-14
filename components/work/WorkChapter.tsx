import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SceneView } from '@/components/three/SceneView';
import { href, type Locale } from '@/lib/i18n';
import { image, textOf, type Project } from '@/lib/projects';
import { isDark } from '@/lib/color';
import type { Dictionary } from '@/content/i18n';

type Props = {
  locale: Locale;
  project: Project;
  t: Dictionary['work'];
  /** The project's own 3D scene; until it exists the cover image stands in. */
  scene?: ReactNode;
};

/** One project of Selected Work: a rounded panel in the project's own colours, with its scene. */
export function WorkChapter({ locale, project, t, scene }: Props) {
  const text = textOf(project, locale);
  const cover = project.cover ? image(project.cover) : null;
  const meta = [
    ...new Set([...project.kinds.map((k) => t.kinds[k]), ...project.platforms, ...(project.year ? [String(project.year)] : [])]),
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
      className="h-full w-full rounded-[1.25rem] object-cover"
    />
  ) : null;

  return (
    <article data-chapter aria-labelledby={`work-${project.slug}`} style={style} className="container-page">
      <div
        className={`grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[var(--chapter-bg)] p-6 text-[var(--chapter-fg)] md:grid-cols-12 md:gap-10 md:p-12 ${
          isDark(project.theme.bg) ? 'dark' : ''
        }`}
      >
        <div className="relative z-[2] md:col-span-5">
          <p className="text-step--1 font-medium opacity-70">{meta.join(', ')}</p>
          <KineticHeading as="h3" id={`work-${project.slug}`} className="type-poster mt-3 text-[clamp(2rem,1.4rem+2.4vw,3.5rem)]">
            {text.name}
          </KineticHeading>
          <p className="mt-4 max-w-[34ch] text-step-1 leading-relaxed opacity-85">{text.summary}</p>
          <div className="mt-8">
            <MagneticButton href={href(locale, 'projects', project.slug)} variant="outline" tone={isDark(project.theme.bg) ? 'dark' : 'light'}>
              {t.view}
            </MagneticButton>
          </div>
        </div>
        <div className="md:col-span-7">
          {scene ? (
            <SceneView className="aspect-[4/3] w-full touch-pan-y" fallback={fallback} cursor={project.scene === 'retropong' ? t.playCursor : project.scene === 'mixmaster' ? t.mixCursor : t.exploreCursor} layer="own">
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
    </article>
  );
}
