import '../global.css';
import ScrollTop from '@web-app/components/scrolltop';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Providers from './providers';
import { Bungee_Shade, Josefin_Sans, Noto_Sans } from 'next/font/google';
import '@tanstack/react-table';
import { generateMetadata } from '@web-app/core/seo';
import { Metadata } from 'next';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue = string> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

export const metadata: Metadata = generateMetadata({});

// Optimized google font load by including it in deployment and build
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

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html
      suppressHydrationWarning={true}
      className={`!scroll-smooth bg-dark ${bungeeShade.variable} ${notoSans.variable} ${josefinSans.variable}`}
      lang={locale}
    >
      <head />
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <ScrollTop />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
