import './globals.css';
import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const siteName = 'マインスイーパー クラシック | Minesweeper Classic';
const description =
  'マインスイーパークラシックへようこそ！ 誰もが知っている古典的ゲームを広告の無いシンプルなUIでプレイできます。まずは難易度を3つの中から選び、プレイを開始しましょう | マインスイーパ, Minesweeper';
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
    <html lang='ja' style={{ height: '-webkit-fill-available' }}>
      <head>
        <meta name='thumbnail' content={url + '/thumbnail.png'} />
      </head>
      <body
        className={ps2p.className + ' h-screen w-screen'}
        style={{ height: '-webkit-fill-available' }}
      >
        {children}
      </body>
      <Analytics />
    </html>
  );
}
