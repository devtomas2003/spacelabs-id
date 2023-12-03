import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'SpaceLabs ID',
  description: 'Inicie Sessão em qualquer plataforma SpaceLabs de forma fácil e segura!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT">
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <body className={roboto.className}>{children}</body>
    </html>
  )
};