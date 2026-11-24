'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { focusWorld, openStudio, stepWorld } from './navigation';
import { useUniverse } from './store';

export const label = 'font-mono text-[10px] uppercase tracking-[0.18em]';
const pad = (n: number) => String(n).padStart(2, '0');

export type WorldInfo = {
  slug: string;
  number: number;
  name: string;
  summary: string;
  type: string;
  year?: number;
  platforms: string;
  kinds: string;
  cover: { src: string; width: number; height: number } | null;
  href: string;
  links: { label: string; href: string }[];
  inner: boolean;
};

export type PanelText = {
  of: string;
  back: string;
  previous: string;
  next: string;
  caseStudy: string;
  close: string;
  year: string;
  platforms: string;
  kind: string;
};

/**
 * A panel over the universe: down the right on wide screens, a sheet from the bottom on phones.
 * It's solid rather than blurred, so it costs the 3D nothing. The camera moves the subject aside
 * to make room for it (see scene/Rig.tsx).
 */
function Sheet({ open, labelledBy, children }: { open: boolean; labelledBy: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={labelledBy}
      aria-hidden={!open}
      inert={!open}
      className={`pointer-events-auto absolute inset-x-2 bottom-2 z-20 flex max-h-[min(60svh,34rem)] flex-col overflow-hidden rounded-[1.4rem] border border-starlight/10 bg-[rgb(5_7_13/0.86)] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] transition-[opacity,translate] duration-500 ease-out-expo md:inset-x-auto md:top-20 md:right-5 md:bottom-5 md:max-h-none md:w-[clamp(22rem,34vw,29rem)] md:rounded-[1.6rem] ${
        open ? 'translate-x-0 translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0 md:translate-x-6 md:translate-y-0'
      }`}
    >
      <div className="overflow-y-auto overscroll-contain p-5 md:p-8">{children}</div>
    </section>
  );
}

function Close({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={text}
      className="grid size-10 shrink-0 place-items-center rounded-full border border-starlight/15 text-starlight/80 transition-colors hover:bg-starlight/10 hover:text-starlight"
    >
      <span aria-hidden="true">×</span>
    </button>
  );
}

const pill = 'inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium transition-colors';

/** The world in focus: what the project is, the facts, and the way to its full story. */
export function WorldPanel({ worlds, t }: { worlds: WorldInfo[]; t: PanelText }) {
  const focus = useUniverse((s) => s.focus);
  // Keep showing the last world while the panel fades out.
  const last = useRef<WorldInfo | null>(null);
  const current = worlds.find((w) => w.slug === focus) ?? null;
  if (current) last.current = current;
  const w = current ?? last.current;
  const i = w ? worlds.indexOf(w) : 0;
  const prev = worlds[(i - 1 + worlds.length) % worlds.length]!;
  const next = worlds[(i + 1) % worlds.length]!;

  return (
    <Sheet open={!!current} labelledBy="world-title">
      {w && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className={`${label} text-starlight/55`} aria-live="polite">
              {t.of.replace('{n}', pad(w.number)).replace('{total}', pad(worlds.length))} · {w.type}
            </p>
            <Close onClick={() => focusWorld(null)} text={t.back} />
          </div>
          <h2 id="world-title" className="mt-3 font-serif text-[clamp(2.4rem,1.7rem+2vw,3.5rem)] leading-[0.95] tracking-[-0.01em]">
            {w.name}
          </h2>
          <p className="mt-4 font-ui text-[15px] leading-relaxed text-starlight/75">{w.summary}</p>
          {w.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={w.cover.src}
              width={w.cover.width}
              height={w.cover.height}
              alt=""
              loading="lazy"
              className="mt-6 aspect-[2/1] w-full rounded-xl bg-starlight/5 object-cover md:aspect-[16/10]"
            />
          )}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-starlight/10 pt-5 font-ui text-[14px]">
            {w.year && (
              <div>
                <dt className={`${label} text-starlight/45`}>{t.year}</dt>
                <dd className="mt-1 tabular-nums">{w.year}</dd>
              </div>
            )}
            {w.platforms && (
              <div>
                <dt className={`${label} text-starlight/45`}>{t.platforms}</dt>
                <dd className="mt-1">{w.platforms}</dd>
              </div>
            )}
            <div className="col-span-2">
              <dt className={`${label} text-starlight/45`}>{t.kind}</dt>
              <dd className="mt-1">{w.kinds}</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-2">
            <Link href={w.href} className={`${pill} bg-starlight text-space no-underline hover:bg-flare-soft`}>
              {t.caseStudy} <span aria-hidden="true">→</span>
            </Link>
            {w.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener external"
                className={`${pill} border border-starlight/20 text-starlight no-underline hover:border-starlight/50`}
              >
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-starlight/10 pt-4">
            <button type="button" onClick={() => stepWorld(-1)} className="group text-left">
              <span className={`${label} block text-starlight/45`}>← {t.previous}</span>
              <span className="mt-1 block truncate font-serif text-[1.2rem] text-starlight/80 group-hover:text-starlight">{prev.name}</span>
            </button>
            <button type="button" onClick={() => stepWorld(1)} className="group text-right">
              <span className={`${label} block text-starlight/45`}>{t.next} →</span>
              <span className="mt-1 block truncate font-serif text-[1.2rem] text-starlight/80 group-hover:text-starlight">{next.name}</span>
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}

export type StudioText = {
  eyebrow: string;
  title: string;
  intro: string;
  servicesTitle: string;
  services: { name: string; text: string }[];
  principles: { title: string; text: string }[];
  contactTitle: string;
  talk: string;
  contactHref: string;
  where: string;
  close: string;
};

/** The star is the studio: who PegPeg is, what it does, and how to get in touch. */
export function StudioPanel({ t }: { t: StudioText }) {
  const open = useUniverse((s) => s.studio);
  return (
    <Sheet open={open} labelledBy="studio-title">
      <div className="flex items-center justify-between gap-4">
        <p className={`${label} text-flare-soft/80`}>{t.eyebrow}</p>
        <Close onClick={() => openStudio(false)} text={t.close} />
      </div>
      <h2 id="studio-title" className="mt-3 font-serif text-[clamp(2.2rem,1.6rem+1.8vw,3.1rem)] leading-[0.98] tracking-[-0.01em]">
        {t.title}
      </h2>
      <p className="mt-5 font-ui text-[15px] leading-relaxed text-starlight/75">{t.intro}</p>

      <h3 className={`${label} mt-9 text-starlight/45`}>{t.servicesTitle}</h3>
      <ul className="mt-3 divide-y divide-starlight/10 border-y border-starlight/10">
        {t.services.map((s) => (
          <li key={s.name} className="py-3.5">
            <p className="font-ui text-[15px] font-medium">{s.name}</p>
            <p className="mt-1 font-ui text-[14px] leading-relaxed text-starlight/65">{s.text}</p>
          </li>
        ))}
      </ul>

      <ul className="mt-8 space-y-4">
        {t.principles.map((p) => (
          <li key={p.title}>
            <p className="font-serif text-[1.25rem] leading-tight">{p.title}</p>
            <p className="mt-1 font-ui text-[14px] leading-relaxed text-starlight/65">{p.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-9 rounded-2xl border border-starlight/10 bg-starlight/[0.03] p-5">
        <p className="font-serif text-[1.6rem] leading-tight">{t.contactTitle}</p>
        <Link href={t.contactHref} className={`${pill} mt-4 bg-flare text-space no-underline hover:bg-flare-soft`}>
          {t.talk} <span aria-hidden="true">→</span>
        </Link>
        <p className={`${label} mt-5 text-starlight/45`}>{t.where}</p>
        <address className="mt-1 font-ui text-[14px] text-starlight/75 not-italic">
          Calle de Luis Antúnez&nbsp;6, 08006 Barcelona
        </address>
      </div>
    </Sheet>
  );
}
