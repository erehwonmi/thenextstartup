'use client';

import { createContext, useContext } from 'react';
import { loadCurrentCustomer } from '@web-app/core/server/session';

type ContextType = Awaited<ReturnType<typeof loadCurrentCustomer>>;

const SessionContext = createContext<ContextType>({
  users: { email: null },
  customerProfiles: {
    userId: null,
    lastActiveAt: new Date(),
    accountStatus: 'disabled',
    accountType: 'email',
    subscriptionStatus: 'expired',
    subscriptionTier: 'free',
    googleId: null,
    stripeId: null,
    lemonSqueezyId: null,
  },
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: ContextType }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
