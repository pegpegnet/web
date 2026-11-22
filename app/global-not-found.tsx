import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Página no encontrada | PegPeg',
  description: 'Esta página no existe.',
  robots: { index: false },
};

const homes = [
  { lang: 'es', href: '/es/', line: 'Esta página no existe.', go: 'Ir al inicio' },
  { lang: 'en', href: '/en/', line: 'This page doesn’t exist.', go: 'Go to the home page' },
  { lang: 'ca', href: '/ca/', line: 'Aquesta pàgina no existeix.', go: 'Vés a l’inici' },
];

/**
 * The 404 page for any unknown address. The language of a missing page isn't known, so it speaks
 * all three. The picture is a world drifting alone, lit from behind by a star out of frame.
 */
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body>
        <main className="container-page flex min-h-[100svh] flex-col justify-center gap-16 py-24 md:flex-row md:items-center md:justify-between">
          <div>
            <a href="/es/" className="font-ui text-[19px] leading-none font-semibold tracking-[-0.04em] text-starlight no-underline">
              pegpeg
            </a>
            <h1 className="type-poster mt-10 text-[clamp(5rem,3rem+8vw,11rem)]">404</h1>
            <ul className="mt-8 space-y-5">
              {homes.map((h) => (
                <li key={h.lang} lang={h.lang} className="text-step-1">
                  {h.line}{' '}
                  <a href={h.href} hrefLang={h.lang} className="text-flare underline decoration-1 underline-offset-4">
                    {h.go}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* A lost world: its night side towards us, a thin crescent of starlight on its edge */}
          <div
            aria-hidden="true"
            className="mx-auto h-56 w-56 shrink-0 rounded-full bg-[radial-gradient(circle_at_78%_30%,#3a2a20_0%,#0b0d16_42%,#020308_70%)] shadow-[inset_-14px_10px_24px_-6px_rgb(255_179_107/0.55),0_0_80px_-10px_rgb(255_179_107/0.25)] md:mx-0 md:h-80 md:w-80"
          />
        </main>
      </body>
    </html>
  );
}
