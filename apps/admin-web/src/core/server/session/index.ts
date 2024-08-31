import 'server-only';

import { db } from '@db';
import { adminProfiles, users } from '@db/schema';
import { loadCurrentUser } from '@ts/auth';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { cache } from 'react';

export const loadCurrentAdmin = cache(async () => {
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
  const { id, createdAt, updatedAt, password, ...restAdminProfiles } =
    getTableColumns(adminProfiles);

  const adminExists = await db
    .select({
      users: { ...restUsers },
      adminProfiles: { ...restAdminProfiles },
    })
    .from(users)
    .innerJoin(adminProfiles, eq(users.id, adminProfiles.userId))
    .where(and(eq(users.id, user.id)));

  if (adminExists.length === 0) {
    return null;
  }

  const [admin] = adminExists;

  return admin;
});

export type CurrentAdmin = Awaited<ReturnType<typeof loadCurrentAdmin>>;
