import './global.css';
import Providers from './providers';

import { Bungee_Shade, Josefin_Sans, Noto_Sans } from 'next/font/google';

export const metadata = {
  title: 'TheNextStartup - Admin',
};

const bungeeShade = Bungee_Shade({
  subsets: ['latin'],
  variable: '--font-bungeeShade',
  weight: '400',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-notoSans',
  display: 'swap',
});

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefinSans',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bungeeShade.variable} ${notoSans.variable} ${josefinSans.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
