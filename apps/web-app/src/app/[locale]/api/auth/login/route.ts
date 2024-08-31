import { verify } from '@node-rs/argon2';
import { db } from '@db';
import { and, eq } from 'drizzle-orm';
import { customerProfiles, users } from '@db/schema';
import { lucia } from '@ts/auth';
import { LoginFormSchema } from '@web-app/core/schemas';
import { cookies } from 'next/headers';
import logger from '@web-app/core/server/logger';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const cookieStore = cookies();
  const requestJson = await request.json();

  const { email, password } = LoginFormSchema.parse(requestJson);

  logger.info('Log in', {
    correlationId,
    app: 'web-app',
    data: JSON.stringify({ email }),
  });

  const userExists = await db
    .select()
    .from(users)
    .innerJoin(customerProfiles, eq(users.id, customerProfiles.userId))
    .where(
      and(eq(users.email, email), eq(customerProfiles.accountStatus, 'active'))
    );

  if (userExists.length === 0) {
    logger.error('User not found. Invalid user credentials', {
      correlationId,
      app: 'web-app',
      data: JSON.stringify({ email }),
    });

    return Response.json(
      {
        data: null,
        message: 'Invalid user credentials',
        success: false,
      },
      { status: 400 }
    );
  }

  const [user] = userExists;

  // Password is required on the application signup logic anyway
  const validPassword = await verify(
    user.customer_profiles.password as string,
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
      correlationId,
      app: 'web-app',
      data: JSON.stringify({ email }),
    });

    return Response.json(
      {
        data: null,
        message: 'Invalid user credentials',
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
