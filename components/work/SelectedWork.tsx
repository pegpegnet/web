import { KineticHeading } from '@/components/motion/KineticHeading';
import { featuredProjects } from '@/lib/projects';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';
import { WorkChapter } from './WorkChapter';
import { SceneView } from '@/components/three/SceneView';
import { YutubScene, SocialPreviewScene, RetroPongScene, MixMasterScene, BlueCaustics } from '@/components/scenes';
import type { ReactNode } from 'react';
import type { SceneId } from '@/content/projects';

const scenes: Partial<Record<SceneId, ReactNode>> = {
  yutub: <YutubScene />,
  socialpreview: <SocialPreviewScene />,
  retropong: <RetroPongScene />,
  mixmaster: <MixMasterScene />,
};

/** The home page's Selected Work: an intro on the hero's blue, then one chapter per featured project. */
export function SelectedWork({ locale, t }: { locale: Locale; t: Dictionary['work'] }) {
  return (
    <section id="work" aria-labelledby="work-title">
      <div className="relative bg-volt text-bone">
        <SceneView className="!absolute inset-0" layer="own">
          <BlueCaustics />
        </SceneView>
        <div className="container-page relative flex min-h-[60svh] flex-col justify-end pt-32 pb-16">
          <KineticHeading id="work-title" className="type-poster text-step-5">
            {t.title}
          </KineticHeading>
          <p className="mt-5 max-w-[40ch] text-step-1 leading-relaxed text-bone/85">{t.lead}</p>
        </div>
      </div>
      <div className="space-y-6 py-24 md:space-y-8">
        {featuredProjects.map((project) => (
          <WorkChapter
            key={project.slug}
            locale={locale}
            project={project}
            t={t}
            scene={project.scene ? scenes[project.scene] : undefined}
          />
        ))}
      </div>
    </section>
  );
}
