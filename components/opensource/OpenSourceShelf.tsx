'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SceneView } from '@/components/three/SceneView';
import { DockScene } from '@/components/scenes';
import { dock, useActiveApp } from './dockStore';

export type ShelfApp = {
  slug: string;
  href: string;
  name: string;
  summary: string;
  icon: string;
  shot: { src: string; width: number; height: number };
  links: { label: string; href: string }[];
};

/**
 * Open source, made for the Mac. A Mac window shows the active app's real screenshot; under it, the
 * apps sit in a 3D Dock; under that, the same apps as an ordinary list with their links. Hovering
 * or focusing either the dock or the list makes that app active.
 */
export function OpenSourceShelf({ apps, t }: { apps: ShelfApp[]; t: { details: string; cursor: string } }) {
  const active = useActiveApp();
  const router = useRouter();
  const open = useCallback((i: number) => apps[i] && router.push(apps[i].href), [apps, router]);
  const current = apps[active] ?? apps[0]!;

  return (
    <div>
      {/* The window */}
      <div className="mx-auto max-w-[64rem] overflow-hidden rounded-[1.1rem] bg-[#202125] shadow-[0_30px_60px_-30px_rgb(17_18_20/0.35)]">
        <div className="flex h-9 items-center gap-2 px-4" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-step--1 font-semibold text-ash">{current.name}</span>
        </div>
        <div className="relative aspect-[16/9] bg-char">
          {apps.map((app, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={app.slug}
              src={app.shot.src}
              width={app.shot.width}
              height={app.shot.height}
              alt=""
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out-expo ${
                i === active ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
              }`}
            />
          ))}
        </div>
      </div>

      {/* The dock */}
      <div
        className="mx-auto mt-6 max-w-[40rem]"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          dock.setPointer(x);
          dock.setActive(Math.min(apps.length - 1, Math.max(0, Math.floor(x * apps.length))));
        }}
        onPointerLeave={() => dock.setPointer(null)}
      >
        <SceneView className="h-[11rem] w-full" layer="own" cursor={t.cursor}>
          <DockScene icons={apps.map((a) => a.icon)} onOpen={open} />
        </SceneView>
      </div>

      {/* The list: names, a line each, and links */}
      <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {apps.map((app, i) => (
          <li
            key={app.slug}
            onPointerEnter={() => dock.setActive(i)}
            onFocus={() => dock.setActive(i)}
            className={`border-t pt-4 transition-colors duration-300 ${i === active ? 'border-volt' : 'border-line'}`}
          >
            <h3 className="text-step-1 font-semibold tracking-[-0.02em]">
              <a href={app.href} className="no-underline hover:text-volt">
                {app.name}
              </a>
            </h3>
            <p className="mt-2 text-step--1 text-graphite">{app.summary}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-step--1 font-medium">
              {app.links.map((l) => (
                <a key={l.href} href={l.href} rel="external" className="text-volt no-underline hover:underline">
                  {l.label}
                </a>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
