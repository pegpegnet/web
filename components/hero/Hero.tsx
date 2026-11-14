import { KineticHeading } from '@/components/motion/KineticHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { DragHint } from './DragHint';
import { HeroStage } from './HeroStage';
import { HeroScroll } from './HeroScroll';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

/**
 * Full-viewport opening. The 3D forms are drawn above the page (the shared canvas sits over the
 * DOM and lets clicks through), so the glass peg can pass in front of the headline.
 */
export function Hero({ locale, t }: { locale: Locale; t: Dictionary['hero'] }) {
  return (
    <section
      id="hero"
      data-cursor={t.dragCursor}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] touch-pan-y flex-col justify-center overflow-hidden select-none"
    >
      <HeroStage />
      <HeroScroll />
      <DragHint label={t.drag} />
      <div id="hero-copy" className="container-page relative pt-24 max-md:mt-[38svh] max-md:pb-12">
        <div className="md:max-w-[52%]">
          <KineticHeading as="h1" id="hero-title" reveal="load" className="type-poster max-w-[13ch] text-step-6">
            {t.title}
          </KineticHeading>
          <p className="mt-6 max-w-[40ch] text-step-1 leading-relaxed text-graphite">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <MagneticButton href="#work">{t.seeWork}</MagneticButton>
            <MagneticButton href={href(locale, 'contact')} variant="outline">
              {t.talk}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
