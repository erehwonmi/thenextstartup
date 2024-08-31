import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { googleAuth, lucia } from '@ts/auth';
import { db } from '@db';
import { eq } from 'drizzle-orm';
import { customerProfiles, users } from '@db/schema';
import { createPaymentCustomerAccount } from '@web-app/core/server/payments';
import logger from '@web-app/core/server/logger';
import { NextRequest } from 'next/server';

const OPENIDCONNECT_GOOGLE = 'https://openidconnect.googleapis.com/v1/userinfo';

const HOST_NAME = process.env.HOST_NAME as string;

export const GET = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const cookieStore = cookies();
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('google_oauth_state')?.value ?? null;
  const codeVerifier = cookies().get('google_code_verifier')?.value ?? null;

  if (error === 'access_denied') {
    logger.error('Access denied in google callback', {
      correlationId,
      app: 'web-app',
      data: JSON.stringify({ code, state, storedState, codeVerifier }),
    });

    return Response.redirect(new URL('/auth/login', request.url));
  }

  logger.info('Google callback', {
    correlationId,
    app: 'web-app',
    data: JSON.stringify({ code, state, storedState, codeVerifier }),
  });

  const diffState = state !== storedState;

  if (!code || !state || diffState || !codeVerifier) {
    logger.error('Invalid state', {
      correlationId,
      app: 'web-app',
      data: JSON.stringify({ code, state, storedState, codeVerifier }),
    });

    return Response.json(
      { data: null, message: 'Invalid request', success: false },
      { status: 400 }
    );
  }

  const redirection = new URL('/app', HOST_NAME);

  try {
    const { accessToken } = await googleAuth.validateAuthorizationCode(
      code,
      codeVerifier
    );

    const response = await fetch(OPENIDCONNECT_GOOGLE, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { sub: googleId, email }: GoogleUser = await response.json();

    const googleUser = await db.query.customerProfiles.findFirst({
      where: eq(customerProfiles.googleId, googleId),
    });

    if (googleUser) {
      logger.info('Google user found', {
        correlationId,
        app: 'web-app',
        data: {},
      });

      const session = await lucia.createSession(
        googleUser.userId as string,
        {}
      );
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return Response.redirect(redirection);
    }

    // If the email is already registered then transform the existing account into a "google" type of account. It's your decision to do whatever you want going from here.
    const _user = await db
      .select()
      .from(users)
      .innerJoin(customerProfiles, eq(users.id, customerProfiles.userId))
      .where(eq(users.email, email));

    let userId = '';
    if (_user.length !== 0) {
      logger.info(
        'User already exists, updating it to be a google type account',
        {
          correlationId,
          app: 'web-app',
          data: JSON.stringify({ email }),
        }
      );

      const [existingUser] = _user;
      const [{ updatedUserId }] = await db
        .update(customerProfiles)
        .set({ accountType: 'google', googleId })
        .where(
          eq(
            customerProfiles.userId,
            existingUser.customer_profiles.userId as string
          )
        )
        .returning({ updatedUserId: users.id });
      userId = updatedUserId;
    } else {
      logger.info('Creating new customer profile', {
        correlationId,
        app: 'web-app',
        data: JSON.stringify({ email }),
      });

      const customerId = await createPaymentCustomerAccount({
        email,
        provider: 'stripe',
      });

      // NOTE: Uncomment if you're using LemonSqueezy
      // const customerId = await createPaymentCustomerAccount({
      //   email,
      //   provider: 'lemonsqueezy',
      // });

      userId = await db.transaction(async (tx) => {
        const [newUser] = await tx
          .insert(users)
          .values({ email })
          .returning({ insertedId: users.id });

        await tx.insert(customerProfiles).values({
          accountType: 'google',
          userId: newUser.insertedId,
          googleId,
          // stripeId: customerId,
          lemonSqueezyId: customerId,
          accountStatus: 'active',
        });

        return newUser.insertedId;
      });
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return Response.redirect(redirection);
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
};

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
