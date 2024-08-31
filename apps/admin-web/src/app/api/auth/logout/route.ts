import logger from '@admin-web/core/server/logger';
import { lucia, validateRequest } from '@ts/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');
  const { session } = await validateRequest();

  if (!session) {
    logger.error('No session found', {
      app: 'admin-web',
      correlationId,
      data: {},
    });

    return NextResponse.redirect('/');
  }

  const cookieStore = cookies();
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();

  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return Response.json(
    { data: null, message: 'Logout success', success: true },
    { status: 200 }
  );
};
