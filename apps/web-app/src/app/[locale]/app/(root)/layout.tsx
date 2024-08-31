import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import AppRoot from '@web-app/components/app';
import { loadCurrentCustomer } from '@web-app/core/server/session';
import { generateMetadata } from '@web-app/core/seo';
import { Metadata } from 'next';
import { SessionProvider } from '@web-app/core/contexts/session';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = generateMetadata({ title: 'App' });

export default async function RootLayout({ children }: Props) {
  const currentCustomer = await loadCurrentCustomer();

  if (!currentCustomer) redirect('/auth/login');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SessionProvider value={currentCustomer}>
        <AppRoot>{children}</AppRoot>
      </SessionProvider>
    </div>
  );
}
