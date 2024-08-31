import { db } from '@db';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { customerProfiles, emailVerificationCodes, users } from '@db/schema';
import { VerifyCodeSchema } from '@web-app/core/schemas';
import { isWithinExpirationDate } from 'oslo';
import { lucia, validateRequest } from '@ts/auth';
import { cookies } from 'next/headers';
import logger from '@web-app/core/server/logger';
import { NextRequest } from 'next/server';
import { Logger } from 'next-axiom';

async function verifyVerificationCode(
  userId: string,
  code: string,
  logger: Logger,
  correlationId: string
): Promise<{ verified: boolean; expired: boolean }> {
  const {
    id: _id,
    expiresAt: _expiresAt,
    code: _code,
  } = getTableColumns(emailVerificationCodes);

  const _emailVerificationCode = await db
    .select({
      emailVerificationCodes: {
        id: _id,
        expiresAt: _expiresAt,
        code: _code,
      },
    })
    .from(users)
    .innerJoin(
      emailVerificationCodes,
      eq(customerProfiles.id, emailVerificationCodes.customerProfileId)
    )
    .innerJoin(customerProfiles, eq(users.id, customerProfiles.userId))
    .where(
      and(eq(users.id, userId), eq(customerProfiles.accountStatus, 'inactive'))
    );

  if (_emailVerificationCode.length === 0) {
    logger.error('User not found. No verification code', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ userId }),
    });
    return { verified: false, expired: false };
  }

  const [emailVerificationCode] = _emailVerificationCode;

  const {
    code: storedCode,
    id,
    expiresAt,
  } = emailVerificationCode.emailVerificationCodes;
  if (storedCode !== code) {
    logger.error('Code invalid', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ code, storedCode }),
    });

    return { verified: false, expired: false };
  }

  if (!isWithinExpirationDate(expiresAt)) {
    logger.error('Code expired', {
      app: 'admin-web',
      correlationId,
      data: JSON.stringify({ code, storedCode }),
    });
    return { verified: false, expired: true };
  }

  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.id, id));

  return { verified: true, expired: false };
}

export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const { user } = await validateRequest();

  if (!user) {
    logger.error('No user found', {
      app: 'web-app',
      correlationId,
      data: {},
    });
    return Response.json(
      { data: null, message: 'Invalid request', success: false },
      { status: 400 }
    );
  }

  try {
    const cookieStore = cookies();
    const requestJson = await request.json();
    const { code } = VerifyCodeSchema.parse(requestJson);

    const { verified, expired } = await verifyVerificationCode(
      user.id,
      code,
      logger,
      correlationId ?? ''
    );

    if (expired) {
      logger.error('Code expired', {
        app: 'web-app',
        correlationId,
        data: JSON.stringify({ verified, expired, code, user }),
      });

      return Response.json(
        {
          data: { verified, expired },
          message: 'Code expired. Please sign up again.',
          success: false,
        },
        { status: 400 }
      );
    }

    if (!verified) {
      logger.error('Code invalid', {
        app: 'web-app',
        correlationId,
        data: JSON.stringify({ verified, expired, code, user }),
      });

      return Response.json(
        {
          data: { verified, expired },
          message: 'Invalid code',
          success: false,
        },
        { status: 400 }
      );
    }

    logger.info('Valid code', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({ verified, expired, code, user }),
    });

    await lucia.invalidateUserSessions(user.id);

    await db
      .update(customerProfiles)
      .set({ accountStatus: 'active' })
      .where(eq(customerProfiles.userId, user.id));

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.json(
      {
        data: { expired: false, verified: false },
        message: 'Verification success',
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error('Cannot verify code', {
      correlationId,
      app: 'web-app',
      data: JSON.stringify({ err }),
    });
    return Response.json(
      {
        data: { expired: false, verified: false },
        message: 'Invalid token',
        success: false,
      },
      { status: 400 }
    );
  }
};
