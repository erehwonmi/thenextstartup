import { UpdateAdminSchema } from '@admin-web/core/schemas';
import logger from '@admin-web/core/server/logger';
import { requiresAdminAuth } from '@admin-web/core/server/middlewares';
import { db } from '@db';
import { adminProfiles, AdminProfiles } from '@db/schema';
import { eq } from 'drizzle-orm';
import { pipe } from 'next-route-handler-pipe';
import { NextRequest, NextResponse } from 'next/server';

async function putHandler(
  request: NextRequest & { admin: Omit<AdminProfiles, 'password'> },
  { params }: { params: { id: string } }
) {
  const correlationId = request.headers.get('x-correlation-id');

  // RBAC
  if (request.admin.adminType === 'admin') {
    logger.error('Update Admin', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ admin: request.admin }),
    });

    return NextResponse.json(
      {
        data: null,
        message: `Invalid request`,
        success: false,
      },
      { status: 400 }
    );
  }

  const requestJson = await request.json();

  const { id, adminType } = UpdateAdminSchema.parse({
    ...requestJson,
    ...params,
  });

  logger.info('New admin type', {
    app: 'admin-web',
    correlationId,
    data: JSON.stringify({ id, adminType }),
  });

  await db
    .update(adminProfiles)
    .set({ adminType })
    .where(eq(adminProfiles.id, id));

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
