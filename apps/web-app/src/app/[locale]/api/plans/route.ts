import { db } from '@db';
import { getTableColumns } from 'drizzle-orm';
import { subscriptionPlans } from '@db/schema';
import { NextRequest } from 'next/server';
import logger from '@web-app/core/server/logger';

export const revalidate = 3600;

export const GET = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const { createdAt, updatedAt, ...rest } = getTableColumns(subscriptionPlans);
  const plans = await db.select(rest).from(subscriptionPlans);

  logger.info('Got plans list', {
    app: 'web-app',
    correlationId,
    data: {},
  });

  return Response.json({
    success: true,
    data: plans,
    message: 'Got subscription plans',
  });
};
