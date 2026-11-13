import { KineticHeading } from '@/components/motion/KineticHeading';
import { SceneView } from '@/components/three/SceneView';
import type { Dictionary } from '@/content/i18n';
import { ServiceList } from './ServiceList';
import { ServiceObjects } from '@/components/scenes';

/**
 * What we do: a sticky 3D composition beside the list of services. Scrolling through the list,
 * or pointing at a service, rearranges the objects so that service comes forward.
 */
export function Services({ t }: { t: Dictionary['services'] }) {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-bone">
      <div className="container-page pt-32">
        <KineticHeading id="services-title" className="type-poster text-[clamp(4rem,1rem+12vw,15rem)]">
          {t.title}
        </KineticHeading>
        <p className="mt-6 max-w-[40ch] text-step-1 text-graphite">{t.lead}</p>
      </div>
      <div className="container-page grid md:grid-cols-12 md:gap-10">
        <div className="sticky top-16 z-[1] h-[42svh] md:top-0 md:order-2 md:col-span-7 md:h-[100svh]">
          <SceneView className="h-full w-full" layer="own">
            <ServiceObjects />
          </SceneView>
        </div>
        <div className="relative z-[2] md:order-1 md:col-span-5">
          <ServiceList items={t.items} />
        </div>
      </div>
    </section>
  );
}
