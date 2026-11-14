import { MagneticButton } from '@/components/motion/MagneticButton';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { SceneView } from '@/components/three/SceneView';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';
import { PegBoard } from '@/components/scenes';

/** The last scene of the home page: the question, the oversized "Let's talk", and a pegboard to play with. */
export function ContactScene({ locale, t }: { locale: Locale; t: Dictionary['contact'] }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-bone pt-28 pb-6 md:pt-36">
      <div className="container-page relative">
        <KineticHeading id="contact-title" className="type-poster max-w-[18ch] text-step-5">
          {t.title}
        </KineticHeading>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[30ch] text-step-1 leading-relaxed text-graphite">{t.lead}</p>
          <MagneticButton href={href(locale, 'contact')} size="xl">
            {t.talk}
          </MagneticButton>
        </div>
      </div>
      <div className="container-page mt-14">
        <div className="dark overflow-hidden rounded-[2rem] bg-char">
          <SceneView className="h-[min(62vh,38rem)] w-full touch-pan-y" layer="own" cursor={t.boardCursor}>
            <PegBoard />
          </SceneView>
        </div>
      </div>
    </section>
  );
}
