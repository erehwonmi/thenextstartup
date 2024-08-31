import 'server-only';

import { db } from '@db';
import { customerProfiles, users } from '@db/schema';
import { loadCurrentUser } from '@ts/auth';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { cache } from 'react';

export const loadCurrentCustomer = cache(async () => {
  const user = await loadCurrentUser();

  if (!user) {
    return null;
  }

  const {
    id: _id,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...restUsers
  } = getTableColumns(users);
  const { id, createdAt, updatedAt, password, ...restCustomerProfiles } =
    getTableColumns(customerProfiles);

  const customerExists = await db
    .select({
      users: { ...restUsers },
      customerProfiles: { ...restCustomerProfiles },
    })
    .from(users)
    .innerJoin(customerProfiles, eq(users.id, customerProfiles.userId))
    .where(
      and(eq(users.id, user.id), eq(customerProfiles.accountStatus, 'active'))
    );

  if (customerExists.length === 0) {
    return null;
  }

  const [customer] = customerExists;

  return customer;
});

export type CurrentCustomer = Awaited<ReturnType<typeof loadCurrentCustomer>>;
