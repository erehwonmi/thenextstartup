import { GetCustomersSchema } from '@admin-web/core/schemas';
import logger from '@admin-web/core/server/logger';
import { requiresAdminAuth } from '@admin-web/core/server/middlewares';
import { db } from '@db';
import { AdminProfiles, customerProfiles, users } from '@db/schema';
import { count, eq, getTableColumns, desc, like } from 'drizzle-orm';
import { pipe } from 'next-route-handler-pipe';
import { NextRequest, NextResponse } from 'next/server';

async function getHandler(
  request: NextRequest & { admin: Omit<AdminProfiles, 'password'> }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const url = new URL(request.url);
  const _skip = url.searchParams.get('skip');
  const _limit = url.searchParams.get('limit');
  const _q = url.searchParams.get('q');
  const _qk = url.searchParams.get('qk');

  try {
    const { skip, limit, q, qk } = GetCustomersSchema.parse({
      skip: _skip,
      limit: _limit,
      q: _q,
      qk: _qk,
    });

    logger.info('Get Customers', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ skip, limit, q, qk }),
    });

    const hasQuery = q && qk;
    const isUserQk = qk === 'email';

    let whereFilter = undefined;

    if (hasQuery && isUserQk) {
      whereFilter = like(users[qk], `${q}%`);
    } else if (hasQuery && !isUserQk) {
      whereFilter = like(customerProfiles[qk], `${q}%`);
    }

    const sq = db
      .select({ id: customerProfiles.id, email: getTableColumns(users).email })
      .from(customerProfiles)
      .innerJoin(users, eq(customerProfiles.userId, users.id))
      .where(whereFilter)
      .orderBy(customerProfiles.id)
      .limit(limit)
      .offset(skip)
      .as('subquery');

    const { password, ...rest } = getTableColumns(customerProfiles);

    const _customerCount = await db
      .select({ count: count() })
      .from(customerProfiles)
      .innerJoin(users, eq(customerProfiles.userId, users.id))
      .where(whereFilter);
    const customerCount = _customerCount[0].count;

    const customers = await db
      .select({ ...rest, email: sq.email })
      .from(customerProfiles)
      .innerJoin(sq, eq(customerProfiles.id, sq.id))
      .orderBy(desc(customerProfiles.createdAt));

    const pageCount = Math.ceil(customerCount / limit);

    return NextResponse.json(
      {
        data: { list: customers, count: customerCount, pageCount },
        message: 'Fetch customers',
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error('Get customers failed', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ err }),
    });

    return NextResponse.json(
      {
        data: [],
        message: 'Invalid request',
        success: false,
      },
      { status: 400 }
    );
  }
}

export const GET = pipe(requiresAdminAuth, getHandler);
