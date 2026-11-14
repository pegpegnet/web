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
 * all three. The picture is the block with its peg missing.
 */
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body>
        <main className="container-page flex min-h-[100svh] flex-col justify-center gap-16 py-24 md:flex-row md:items-center md:justify-between">
          <div>
            <a href="/es/" className="font-display text-[1.45rem] leading-none font-bold tracking-[-0.05em] text-volt no-underline">
              pegpeg
            </a>
            <h1 className="type-poster mt-10 text-step-6">404</h1>
            <ul className="mt-8 space-y-5">
              {homes.map((h) => (
                <li key={h.lang} lang={h.lang} className="text-step-1">
                  {h.line}{' '}
                  <a href={h.href} hrefLang={h.lang} className="font-semibold text-volt underline decoration-2 underline-offset-4">
                    {h.go}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* The block, with an empty hole where the peg should be */}
          <div aria-hidden="true" className="relative mx-auto h-56 w-56 shrink-0 rotate-[-8deg] rounded-[3.5rem] bg-volt shadow-[0_40px_80px_-30px_rgb(43_59_255/0.6)] md:mx-0 md:h-80 md:w-80 md:rounded-[5rem]">
            <span className="absolute top-1/2 left-1/2 h-16 w-16 -translate-1/2 rounded-full bg-[#141a6b] shadow-[inset_0_8px_16px_rgb(0_0_0/0.45)] md:h-24 md:w-24" />
          </div>
        </main>
      </body>
    </html>
  );
}
