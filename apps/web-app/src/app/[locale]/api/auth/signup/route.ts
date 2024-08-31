import { hash } from '@node-rs/argon2';
import { db } from '@db';
import { eq } from 'drizzle-orm';
import { customerProfiles, emailVerificationCodes, users } from '@db/schema';
import { SignupFormSchema } from '@web-app/core/schemas';
import { createPaymentCustomerAccount } from '@web-app/core/server/payments';
import mailer from '@ts/mailer';
import EmailVerification from '@web-app/components/mail-templates/email-verification';
import { lucia } from '@ts/auth';
import { cookies } from 'next/headers';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';
import logger from '@web-app/core/server/logger';
import { NextRequest } from 'next/server';

async function generateEmailVerificationCode(
  customerProfileId: string
): Promise<string> {
  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.customerProfileId, customerProfileId));

  const code = generateRandomString(8, alphabet('0-9'));
  await db.insert(emailVerificationCodes).values({
    expiresAt: createDate(new TimeSpan(5, 'm')),
    customerProfileId,
    code,
  });
  return code;
}

export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const cookieStore = cookies();
  const requestJson = await request.json();

  const { email, password } = SignupFormSchema.parse(requestJson);

  logger.info('Signing up', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({ email }),
  });

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userExists = await db
    .select()
    .from(users)
    .innerJoin(customerProfiles, eq(users.id, customerProfiles.userId))
    .where(eq(users.email, email));

  if (userExists.length !== 0) {
    logger.info('No customer profile found', {
      correlationId,
      app: 'web-app',
      data: JSON.stringify({ email }),
    });

    const [user] = userExists;

    if (user.customer_profiles.accountStatus === 'active') {
      logger.error('Email address already found', {
        correlationId,
        app: 'web-app',
        data: JSON.stringify({ email }),
      });

      return Response.json(
        {
          data: { resendCode: false },
          message: 'Email address is already taken.',
          success: false,
        },
        { status: 400 }
      );
    }

    const code = await generateEmailVerificationCode(user.customer_profiles.id);

    await mailer.emails.send({
      from: 'signup@mail.thenextstartup.erehwonmi.com',
      to: email,
      subject: 'Email verification',
      react: EmailVerification({ email, code }),
    });

    logger.info('Sent verification email', {
      correlationId,
      app: 'web-app',
      data: { email },
    });

    const session = await lucia.createSession(user.users.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.json(
      {
        data: { resendCode: true },
        message: 'We have sent a new verification code.',
        success: false,
      },
      { status: 200 }
    );
  }

  const customerId = await createPaymentCustomerAccount({
    email,
    provider: 'stripe',
  });

  //NOTE: Uncomment if you're using LemonSqueezy
  // const customerId = await createPaymentCustomerAccount({
  //   email,
  //   provider: 'lemonsqueezy',
  // });

  const { userId, customerProfileId } = await db.transaction(async (tx) => {
    const [newUser] = await tx
      .insert(users)
      .values({ email })
      .returning({ insertedId: users.id });

    const [newCustomer] = await tx
      .insert(customerProfiles)
      .values({
        stripeId: customerId,
        // NOTE: Uncomment if you're using LemonSqueezy
        //lemonSqueezyId: customerId,
        accountType: 'email',
        password: passwordHash,
        userId: newUser.insertedId,
      })
      .returning({ insertedId: customerProfiles.id });

    return {
      userId: newUser.insertedId,
      customerProfileId: newCustomer.insertedId,
    };
  });

  const code = await generateEmailVerificationCode(customerProfileId);

  await mailer.emails.send({
    from: 'signup@mail.thenextstartup.erehwonmi.com',
    to: email,
    subject: 'Email verification',
    react: EmailVerification({ email, code }),
  });

  logger.info('Created customer information and sent verification email', {
    correlationId,
    app: 'web-app',
    data: { email },
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return Response.json(
    {
      data: { resendCode: false },
      message: 'Successfully signed up',
      success: true,
    },
    { status: 200 }
  );
};
