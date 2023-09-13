import './globals.css';
import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const siteName= 'マインスイーパー Classic';
const description = 'ブラウザで気軽に楽しめるクラシックなマインスイーパー | 3つの難易度で、スキマ時間にサクッと遊べる';
const url = 'https://mine-sweeper.ebinas.dev';

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: url,
  },
};

const ps2p = Press_Start_2P({ weight: '400', preload: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className={ps2p.className}>{children}</body>
      <Analytics />
    </html>
  );
}
