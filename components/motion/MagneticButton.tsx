import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'outline';
  size?: 'md' | 'xl';
  /** Kept for callers; every surface is dark now. */
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * A pill link. Quiet on purpose: a colour change on hover and a slight press, nothing that
 * follows the pointer. (Kept under its old name so every caller stays the same.)
 */
export function MagneticButton({ href, children, variant = 'solid', size = 'md', className = '' }: Props) {
  const sizing = size === 'xl' ? 'h-14 px-8 text-step-1' : 'h-11 px-5 text-step--1';
  const look =
    variant === 'solid'
      ? 'bg-starlight text-space hover:bg-flare-soft'
      : 'text-starlight shadow-[inset_0_0_0_1px_rgb(239_234_226/0.25)] hover:bg-starlight/10';
  const external = /^https?:/.test(href);
  return (
    <Link
      href={href}
      {...(external ? { rel: 'external' } : {})}
      className={`inline-flex items-center justify-center rounded-full font-medium no-underline transition-[background-color,transform] duration-200 active:scale-[0.98] ${sizing} ${look} ${className}`}
    >
      {children}
    </Link>
  );
}
