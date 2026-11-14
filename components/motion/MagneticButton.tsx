import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'outline';
  size?: 'md' | 'xl';
  /** 'dark' when the button sits on a dark background. */
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * A pill link. Quiet on purpose: a colour change on hover and a slight press, nothing that
 * follows the pointer. (Kept under its old name so every caller stays the same.)
 */
export function MagneticButton({ href, children, variant = 'solid', size = 'md', tone = 'light', className = '' }: Props) {
  const dark = tone === 'dark';
  const sizing = size === 'xl' ? 'h-14 px-8 text-step-1' : 'h-11 px-5 text-step--1';
  const look =
    variant === 'solid'
      ? dark
        ? 'bg-bone text-char hover:bg-bone/85'
        : 'bg-char text-bone hover:bg-char/80'
      : dark
        ? 'text-bone shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)] hover:bg-bone/10'
        : 'text-char shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-chalk';
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
