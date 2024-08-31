'use client';

import { createContext, useContext } from 'react';
import { loadCurrentAdmin } from '@admin-web/core/server/session';

type ContextType = Awaited<ReturnType<typeof loadCurrentAdmin>>;

const SessionContext = createContext<ContextType>({
  users: { email: null },
  adminProfiles: { userId: null, lastActiveAt: new Date(), adminType: 'admin' },
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
