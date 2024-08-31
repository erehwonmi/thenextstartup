import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createId } from '@paralleldrive/cuid2';

export default async function middleware(request: NextRequest) {
  const correlationId = createId();
  request.headers.set('x-correlation-id', correlationId);
  const response = NextResponse.next();
  response.headers.set('x-correlation-id', correlationId);
  return response;
}

export const config = {};
