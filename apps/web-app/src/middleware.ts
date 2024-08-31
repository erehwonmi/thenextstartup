import createMiddleware from 'next-intl/middleware';
import { localePrefix, defaultLocale, locales, pathnames } from './config';
import { NextRequest } from 'next/server';
import { createId } from '@paralleldrive/cuid2';

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    defaultLocale,
    locales,
    localePrefix,
    pathnames,
  });

  const response = handleI18nRouting(request);

  const correlationId = createId();
  
  request.headers.set('x-correlation-id', correlationId);
  response.headers.set('x-correlation-id', correlationId);

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(jp|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
