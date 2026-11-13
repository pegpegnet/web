'use client';

import { useEffect, useRef } from 'react';
import { services, useActiveService } from './servicesStore';

/**
 * The services as a list. The one closest to the middle of the screen is in focus; pointing at or
 * focusing one brings it forward instead.
 */
export function ServiceList({ items }: { items: { name: string; text: string }[] }) {
  const active = useActiveService();
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const els = [...(list.current?.querySelectorAll('li') ?? [])];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) services.setScrolled(els.indexOf(e.target as HTMLLIElement));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={list} className="space-y-[18vh] py-[20vh] max-md:space-y-16 max-md:py-12" onPointerLeave={() => services.setPointed(null)}>
      {items.map((item, i) => (
        <li
          key={item.name}
          tabIndex={0}
          onPointerEnter={() => services.setPointed(i)}
          onFocus={() => services.setPointed(i)}
          onBlur={() => services.setPointed(null)}
          className={`rounded-xl outline-offset-8 transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-35'}`}
        >
          <h3 className="type-poster text-[clamp(2.4rem,1.2rem+3.6vw,5rem)]">{item.name}</h3>
          <p className="mt-4 max-w-[38ch] text-step-1 leading-snug">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
