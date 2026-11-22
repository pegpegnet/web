import Link from 'next/link';

/** The PegPeg wordmark: lowercase "pegpeg" in Geist, as on the home page's top bar. */
export function Wordmark({ href, className = '' }: { href: string; className?: string }) {
  return (
    <Link href={href} className={`inline-block font-ui text-[19px] leading-none font-semibold tracking-[-0.04em] text-starlight no-underline ${className}`}>
      pegpeg
    </Link>
  );
}
