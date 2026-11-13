import type { ReactNode } from 'react';

// The bare domain only forwards to a language; Apache answers it with a redirect in production.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
