import { KineticHeading } from '@/components/motion/KineticHeading';
import { featuredProjects } from '@/lib/projects';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';
import { WorkChapter } from './WorkChapter';
import { WorkStack } from './WorkStack';
import { YutubScene } from './scenes/YutubScene';
import { SocialPreviewScene } from './scenes/SocialPreviewScene';
import { RetroPongScene } from './scenes/RetroPongScene';
import type { ReactNode } from 'react';
import type { SceneId } from '@/content/projects';

const scenes: Partial<Record<SceneId, ReactNode>> = {
  yutub: <YutubScene />,
  socialpreview: <SocialPreviewScene />,
  retropong: <RetroPongScene />,
};

/** The home page's Selected Work: an intro on the hero's blue, then one chapter per featured project. */
export function SelectedWork({ locale, t }: { locale: Locale; t: Dictionary['work'] }) {
  return (
    <section id="work" aria-labelledby="work-title">
      <div className="bg-volt text-bone">
        <div className="container-page flex min-h-[70svh] flex-col justify-end pt-32 pb-16">
          <KineticHeading id="work-title" className="type-poster text-[clamp(4rem,1rem+13vw,17rem)]">
            {t.title}
          </KineticHeading>
          <p className="mt-8 max-w-[40ch] text-step-1 leading-snug">{t.lead}</p>
        </div>
      </div>
      <WorkStack>
        {featuredProjects.map((project) => (
          <WorkChapter
            key={project.slug}
            locale={locale}
            project={project}
            t={t}
            scene={project.scene ? scenes[project.scene] : undefined}
          />
        ))}
      </WorkStack>
    </section>
  );
}
