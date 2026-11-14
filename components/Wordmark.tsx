import Link from 'next/link';

/** The PegPeg wordmark: the original lowercase "pegpeg" in volt blue, set in Inter. */
export function Wordmark({ href, className = '' }: { href: string; className?: string }) {
  return (
    <Link href={href} className={`inline-block text-volt no-underline ${className}`} aria-label="PegPeg, home">
      <span aria-hidden="true" className="block font-display text-[1.45rem] leading-none font-[700] tracking-[-0.05em]">
        pegpeg
      </span>
    </Link>
  );
}
