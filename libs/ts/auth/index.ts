import { Google } from 'arctic';
import { Lucia, Session, TimeSpan, User } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@db';
import { sessions, users } from '@db/schema';
import { cookies } from 'next/headers';
import { cache } from 'react';

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
    };
    UserId: string;
  }
}

export type AuthenticatedUser = User;

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, "w"),
  sessionCookie: {
    expires: true,
    attributes: {
      secure: process.env.ENV === 'PRODUCTION',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
    };
  },
});

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const hostname = process.env.HOST_NAME as string;
export const googleAuth = new Google(
  googleClientId,
  googleClientSecret,
  `${hostname}/api/auth/login/google/callback`
);

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}
  return result;
};

export const loadCurrentUser = cache(async () => {
  const session = await validateRequest();

  return session.user as AuthenticatedUser;
});
