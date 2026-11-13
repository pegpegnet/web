import { KineticHeading } from '@/components/motion/KineticHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SceneView } from '@/components/three/SceneView';
import { HeroScene } from './HeroScene';
import { href, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/content/i18n';

/**
 * Full-viewport opening. The 3D forms are drawn above the page (the shared canvas sits over the
 * DOM and lets clicks through), so the glass peg can pass in front of the headline.
 */
export function Hero({ locale, t }: { locale: Locale; t: Dictionary['hero'] }) {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <SceneView className="!absolute inset-0" cursor="Drag">
        <HeroScene />
      </SceneView>
      <div className="container-page relative pb-[clamp(2rem,6vh,5rem)]">
        <KineticHeading as="h1" id="hero-title" reveal="load" stretch className="type-poster max-w-[12ch] text-[clamp(3.6rem,1.4rem+8.6vw,12rem)]">
          {t.title}
        </KineticHeading>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[46ch] text-step-1 text-graphite">{t.lead}</p>
          <div className="flex flex-wrap gap-5">
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
