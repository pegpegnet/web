'use client';

import { useState } from 'react';

/**
 * A YouTube video that loads nothing from YouTube until the visitor presses play: a poster and a
 * play button first, then the privacy-enhanced (no-cookie) player.
 */
export function VideoFacade({ id, title, poster, label }: { id: string; title: string; poster?: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <div className="aspect-video overflow-hidden rounded-[1.25rem] bg-char">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-[1.25rem] bg-char text-left"
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-[opacity,scale] duration-700 ease-out-expo group-hover:scale-105 group-hover:opacity-90" />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center gap-3 rounded-full bg-bone px-6 py-4 font-semibold text-char transition-transform duration-500 ease-out-expo group-hover:scale-110">
          <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
            <path d="M0 0l14 8-14 8z" fill="currentColor" />
          </svg>
          {label}
        </span>
      </span>
    </button>
  );
}
