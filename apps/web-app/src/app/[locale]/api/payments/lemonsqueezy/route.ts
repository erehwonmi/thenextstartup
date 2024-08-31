import { CustomerProfiles } from '@db/schema';
import { CreateLemonsqueezyPaymentSchema } from '@web-app/core/schemas';
import { pipe } from 'next-route-handler-pipe';
import { requiresCustomerAuth } from '@web-app/core/server/middlewares';
import { lemonsqueezy } from '@web-app/core/server/payments';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@web-app/core/server/logger';

const HOST_NAME = process.env.HOST_NAME || 'http://localhost:3000';
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID as string;

async function postHandler(
  request: NextRequest & {
    customer: Omit<CustomerProfiles, 'password'> & { email: string };
  }
) {
  const correlationId = request.headers.get('x-correlation-id');

  try {
    const requestJson = await request.json();
    const { variantId } = CreateLemonsqueezyPaymentSchema.parse(requestJson);

    const { userId, lemonSqueezyId, email } = request.customer;

    logger.info('New lemonsqueezy payment checkout', {
      correlationId,
      data: JSON.stringify({ variantId, userId, lemonSqueezyId, email }),
    });

    if (!lemonSqueezyId) {
      logger.error('Lemon squeezy id not found', {
        app: 'web-app',
        correlationId,
        data: JSON.stringify({ variantId, userId, lemonSqueezyId }),
      });

      return NextResponse.json(
        {
          data: null,
          message: 'Customer lemonsqueezy id not found',
          success: false,
        },
        { status: 400 }
      );
    }

    const params: lemonsqueezy.NewCheckout = {
      checkoutOptions: {
        subscriptionPreview: true,
      },
      productOptions: {
        redirectUrl: `${HOST_NAME}/app/settings/plans?success=true`,
      },
      checkoutData: {
        email,
        name: `TheNextStartup Customer ${email}`,
        custom: {
          lemonSqueezyId,
          userId,
          variantId,
        },
      },
      expiresAt: null,
      testMode: process.env.ENV === 'STAGING' ? true : false,
    };

    const { data } = await lemonsqueezy.createCheckout(
      LEMONSQUEEZY_STORE_ID,
      variantId,
      params
    );

    const url = data?.data.attributes.url;

    logger.info('Created lemonsqueezy checkout', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({ data }),
    });

    return NextResponse.json(
      {
        data: {
          url,
        },
        message: 'Created lemonsqueezy checkout',
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error('Lemonsqueezy payment checkout session', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({ err }),
    });

    return NextResponse.json(
      {
        data: null,
        message: 'Created lemonsqueezy checkout',
        success: true,
      },
      { status: 200 }
    );
  }
}

export const POST = pipe(requiresCustomerAuth, postHandler);
