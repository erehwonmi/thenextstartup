import { ReactNode } from 'react';
import AppRoot from '@admin-web/components/app';
import { redirect } from 'next/navigation';
import { loadCurrentAdmin } from '@admin-web/core/server/session';
import { SessionProvider } from '@admin-web/core/contexts/session';

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const currentAdmin = await loadCurrentAdmin();

  if (!currentAdmin) redirect('/');

  return (
    <SessionProvider value={currentAdmin}>
      <AppRoot>{children}</AppRoot>
    </SessionProvider>
  );
}
