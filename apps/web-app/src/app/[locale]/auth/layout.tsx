import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { loadCurrentCustomer } from '@web-app/core/server/session';
import { generateMetadata } from '@web-app/core/seo';
import { Metadata } from 'next';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = generateMetadata({ title: 'Auth' });

export default async function RootLayout({ children }: Props) {
  const currentCustomer = await loadCurrentCustomer();

  if (currentCustomer) redirect('/app/home');

  return (
    <div className="flex flex-col justify-center items-center h-screen xs:h-full">
      <h1 className="p-10 text-black dark:text-white font-bungeeShade font-semibold text-5xl">
        The <label>Next</label> Startup
      </h1>
      {children}
    </div>
  );
}
