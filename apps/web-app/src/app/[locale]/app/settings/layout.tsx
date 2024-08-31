import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import SettingsRoot from '@web-app/components/app/settings';
import { loadCurrentCustomer } from '@web-app/core/server/session';
import { SessionProvider } from '@web-app/core/contexts/session';

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const currentCustomer = await loadCurrentCustomer();

  if (!currentCustomer) redirect('/auth/login');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SessionProvider value={currentCustomer}>
        <SettingsRoot>{children}</SettingsRoot>
      </SessionProvider>
    </div>
  );
}
