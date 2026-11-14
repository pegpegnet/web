import Link from 'next/link';

/**
 * The PegPeg wordmark: the original lowercase "pegpeg" in electric blue, redrawn in Anybody.
 * On hover the letters condense and spring back, a small preview of the site's kinetic type.
 */
export function Wordmark({ href, className = '' }: { href: string; className?: string }) {
  return (
    <Link href={href} className={`wordmark group inline-block text-volt no-underline ${className}`} aria-label="PegPeg, home">
      <span
        aria-hidden="true"
        className="block font-display text-[1.9rem] leading-none font-[850] tracking-[-0.03em] transition-[font-stretch] duration-700 ease-out-expo [font-stretch:118%] group-hover:[font-stretch:72%]"
      >
        pegpeg
      </span>
    </Link>
  );
}
