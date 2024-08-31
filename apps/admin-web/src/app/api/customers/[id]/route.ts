import { UpdateCustomerSchema } from '@admin-web/core/schemas';
import logger from '@admin-web/core/server/logger';
import { requiresAdminAuth } from '@admin-web/core/server/middlewares';
import { db } from '@db';
import { AdminProfiles, customerProfiles, sessions } from '@db/schema';

import { eq } from 'drizzle-orm';
import { pipe } from 'next-route-handler-pipe';
import { NextRequest, NextResponse } from 'next/server';

async function putHandler(
  request: NextRequest & { admin: Omit<AdminProfiles, 'password'> },
  { params }: { params: { id: string } }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const requestJson = await request.json();

  const { id, accountStatus } = UpdateCustomerSchema.parse({
    ...requestJson,
    ...params,
  });

  logger.info('Update Customer', {
    app: 'admin-web',
    correlationId,
    data: JSON.stringify({ id, accountStatus }),
  });

  await db.transaction(async (tx) => {
    const [{ updatedId }] = await tx
      .update(customerProfiles)
      .set({ accountStatus })
      .where(eq(customerProfiles.id, id))
      .returning({ updatedId: customerProfiles.userId });

    if (accountStatus === 'disabled') {
      await tx.delete(sessions).where(eq(sessions.userId, updatedId as string));

      logger.info('Deleted Customer Session', {
        app: 'admin-web',
        correlationId,
        data: JSON.stringify({ id, accountStatus, updatedId }),
      });
    }
  });

  return NextResponse.json(
    {
      data: null,
      message: `Modified customer ${id}`,
      success: true,
    },
    { status: 200 }
  );
}

export const PUT = pipe(requiresAdminAuth, putHandler);
