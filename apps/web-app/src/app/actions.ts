'use server';

import { lucia } from '@ts/auth';
import { cookies } from 'next/headers';

export const setSession = async (userId: string) => {
  const cookieStore = cookies();
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};
