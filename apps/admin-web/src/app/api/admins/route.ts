import { GetAdminsSchema } from '@admin-web/core/schemas';
import logger from '@admin-web/core/server/logger';
import { requiresAdminAuth } from '@admin-web/core/server/middlewares';
import { db } from '@db';
import { adminProfiles, AdminProfiles, users } from '@db/schema';
import { count, eq, getTableColumns, desc, like } from 'drizzle-orm';
import { pipe } from 'next-route-handler-pipe';
import { NextRequest, NextResponse } from 'next/server';

async function getHandler(
  request: NextRequest & {
    admin: Omit<AdminProfiles, 'password'>;
  }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const url = new URL(request.url);
  const _skip = url.searchParams.get('skip');
  const _limit = url.searchParams.get('limit');
  const _q = url.searchParams.get('q');
  const _qk = url.searchParams.get('qk');

  try {
    const { skip, limit, q, qk } = GetAdminsSchema.parse({
      skip: _skip,
      limit: _limit,
      q: _q,
      qk: _qk,
    });

    logger.info('Get Admins', {
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
      whereFilter = like(adminProfiles[qk], `${q}%`);
    }

    const sq = db
      .select({ id: adminProfiles.id, email: getTableColumns(users).email })
      .from(adminProfiles)
      .innerJoin(users, eq(adminProfiles.userId, users.id))
      .where(whereFilter)
      .orderBy(adminProfiles.id)
      .limit(limit)
      .offset(skip)
      .as('subquery');

    const { password, ...rest } = getTableColumns(adminProfiles);

    const _adminCount = await db
      .select({ count: count() })
      .from(adminProfiles)
      .innerJoin(users, eq(adminProfiles.userId, users.id))
      .where(whereFilter);
    const adminCount = _adminCount[0].count;

    const admins = await db
      .select({ ...rest, email: sq.email })
      .from(adminProfiles)
      .innerJoin(sq, eq(adminProfiles.id, sq.id))
      .orderBy(desc(adminProfiles.createdAt));

    const pageCount = Math.ceil(adminCount / limit);
    return NextResponse.json(
      {
        data: { list: admins, count: adminCount, pageCount },
        message: 'Fetch admins',
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error('Get admins failed', {
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
