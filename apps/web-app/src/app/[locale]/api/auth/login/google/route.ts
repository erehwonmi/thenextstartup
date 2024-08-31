import { generateCodeVerifier, generateState } from 'arctic';

import { googleAuth } from '@ts/auth';
import { cookies } from 'next/headers';
import logger from '@web-app/core/server/logger';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const cookieStore = cookies();
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await googleAuth.createAuthorizationURL(state, codeVerifier, {
    scopes: ['email', 'profile'],
  });

  logger.info('Auth URL', {
    correlationId,
    app: 'web-app',
    data: JSON.stringify({ url }),
  });

  cookieStore.set('google_oauth_state', state, {
    secure: true,
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
  });

  cookieStore.set('google_code_verifier', codeVerifier, {
    secure: true,
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
  });

  return Response.redirect(url);
};
