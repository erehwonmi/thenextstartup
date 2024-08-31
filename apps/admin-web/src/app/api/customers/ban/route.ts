import { BanCustomersSchema } from '@admin-web/core/schemas';
import logger from '@admin-web/core/server/logger';
import { requiresAdminAuth } from '@admin-web/core/server/middlewares';
import { db } from '@db';
import { AdminProfiles, customerProfiles, sessions } from '@db/schema';

import { inArray } from 'drizzle-orm';
import { pipe } from 'next-route-handler-pipe';
import { NextRequest, NextResponse } from 'next/server';

async function putHandler(
  request: NextRequest & { admin: Omit<AdminProfiles, 'password'> }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const requestJson = await request.json();

  const { userIds } = BanCustomersSchema.parse({
    ...requestJson,
  });

  logger.info('Banning customers', {
    app: 'admin-web',
    correlationId,
    data: JSON.stringify({ userIds }),
  });

  await db.transaction(async (tx) => {
    await tx
      .update(customerProfiles)
      .set({ accountStatus: 'disabled' })
      .where(inArray(customerProfiles.userId, userIds));

    await tx.delete(sessions).where(inArray(sessions.userId, userIds));

    logger.info('Deleted Customer Session', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ userIds }),
    });
  });

  return NextResponse.json(
    {
      data: null,
      message: `Banned ${userIds.length} customers`,
      success: true,
    },
    { status: 200 }
  );
}

export const PUT = pipe(requiresAdminAuth, putHandler);
