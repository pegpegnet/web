import { MagneticButton } from '@/components/motion/MagneticButton';
import { KineticHeading } from '@/components/motion/KineticHeading';
import { SceneView } from '@/components/three/SceneView';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';
import { PegBoard } from './PegBoard';

/** The last scene of the home page: the question, the oversized "Let's talk", and a pegboard to play with. */
export function ContactScene({ locale, t }: { locale: Locale; t: Dictionary['contact'] }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="dark relative overflow-hidden bg-char text-bone">
      <div className="container-page relative z-[2] pt-28">
        <KineticHeading id="contact-title" stretch className="type-poster max-w-[17ch] text-[clamp(3.2rem,1rem+6.4vw,8.6rem)]">
          {t.title}
        </KineticHeading>
        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[26ch] text-step-2 leading-tight text-ash">{t.lead}</p>
          <MagneticButton href={href(locale, 'contact')} size="xl" tone="dark">
            {t.talk}
          </MagneticButton>
        </div>
      </div>
      <SceneView className="mt-8 h-[min(70vh,44rem)] w-full touch-pan-y" layer="own" cursor={t.boardCursor}>
        <PegBoard />
      </SceneView>
    </section>
  );
}
