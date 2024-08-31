import { verify } from '@node-rs/argon2';
import { db } from '@db';
import { and, eq } from 'drizzle-orm';
import { adminProfiles, users } from '@db/schema';
import { lucia } from '@ts/auth';
import { LoginFormSchema } from '@web-app/core/schemas';
import { cookies } from 'next/headers';
import logger from '@admin-web/core/server/logger';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const cookieStore = cookies();
  const requestJson = await request.json();

  const { email, password } = LoginFormSchema.parse(requestJson);

  logger.info('Logging in', {
    app: 'admin-web',
    correlationId,
    data: JSON.stringify({ email }),
  });

  const adminExists = await db
    .select()
    .from(users)
    .innerJoin(adminProfiles, eq(users.id, adminProfiles.userId))
    .where(and(eq(users.email, email)));

  if (adminExists.length === 0) {
    logger.error('Invalid admin credentials', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ email }),
    });

    return Response.json(
      {
        data: null,
        message: 'Invalid admin credentials',
        success: false,
      },
      { status: 400 }
    );
  }

  const [user] = adminExists;

  const validPassword = await verify(
    user.admin_profiles.password as string,
    password,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    }
  );

  if (!validPassword) {
    logger.error('Invalid password', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ email }),
    });

    return Response.json(
      {
        data: null,
        message: 'Invalid admin credentials',
        success: false,
      },
      { status: 400 }
    );
  }

  const session = await lucia.createSession(user.users.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return Response.json(
    { data: null, message: 'Successfully logged in', success: true },
    { status: 200 }
  );
};
