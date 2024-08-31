import { loadCurrentAdmin } from '@admin-web/core/server/session';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'TheNextStartup - Admin',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentAdmin = await loadCurrentAdmin();

  if (currentAdmin) {
    redirect('/app');
  }

  return children;
}
