import 'server-only';

import { db } from '@db';
import { CustomerProfiles, customerProfiles } from '@db/schema';
import { loadCurrentUser } from '@ts/auth';
import { User } from 'lucia';
import { PipeFunction } from 'next-route-handler-pipe';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export const requiresAuth: PipeFunction<{ user: User }> = async (
  req,
  _,
  next
) => {
  const user = await loadCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized', data: null, success: false },
      { status: 401 }
    );
  }

  req.user = user;
  return await next();
};

export const requiresCustomerAuth: PipeFunction<{
  customer: Omit<CustomerProfiles, 'password'> & { email: string };
}> = async (req, _, next) => {
  const user = await loadCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized', data: null, success: false },
      { status: 401 }
    );
  }

  const customer = await db.query.customerProfiles.findFirst({
    where: eq(customerProfiles.userId, user.id),
    columns: { password: false },
  });

  if (!customer) {
    return NextResponse.json(
      { message: 'Unauthorized', data: null, success: false },
      { status: 401 }
    );
  }

  req.customer = { ...customer, email: user.email };
  return await next();
};
