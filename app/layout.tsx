import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abu Janda App',
  description: 'Login simple, clean, clear, minimalis cerah dengan Next.js dan Neon.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
