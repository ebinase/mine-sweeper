import './globals.css';
import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const ps2p = Press_Start_2P({ weight: '400', preload: false });

export const metadata: Metadata = {
  title: 'Mine Sweeper',
  description: 'Simple Mine Sweeper game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={ps2p.className}>{children}</body>
      <Analytics />
    </html>
  );
}
