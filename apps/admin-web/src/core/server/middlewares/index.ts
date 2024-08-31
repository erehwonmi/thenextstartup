import 'server-only';

import { db } from '@db';
import { AdminProfiles, adminProfiles } from '@db/schema';
import { loadCurrentUser } from '@ts/auth';
import { User } from 'lucia';
import { PipeFunction } from 'next-route-handler-pipe';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import logger from '../logger';

export const requiresAuth: PipeFunction<{ user: User }> = async (
  req,
  _,
  next
) => {
  const user = await loadCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized', data: null, success: false },
      { status: 401 }
    );
  }

  req.user = user;
  return await next();
};

export const requiresAdminAuth: PipeFunction<
  {
    admin: Omit<AdminProfiles, 'password'>;
  } & NextRequest
> = async (req, _, next) => {
  const user = await loadCurrentUser();

  const correlationId = req.headers.get('x-correlation-id');

  logger.info('Current user', {
    app: 'admin-web',
    correlationId,
    data: JSON.stringify({ user }),
  });

  if (!user) {
    logger.error('User not found', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ user }),
    });

    return NextResponse.json(
      { message: 'Unauthorized', data: null, success: false },
      { status: 401 }
    );
  }

  const admin = await db.query.adminProfiles.findFirst({
    where: eq(adminProfiles.userId, user.id),
    columns: { password: false },
  });

  if (!admin) {
    logger.error('Admin not found', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ user }),
    });

    return NextResponse.json(
      { message: 'Unauthorized', data: null, success: false },
      { status: 401 }
    );
  }

  req.admin = admin;
  return await next();
};
