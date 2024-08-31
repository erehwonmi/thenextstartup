import { CustomerProfiles } from '@db/schema';
import { CreateStripePaymentSchema } from '@web-app/core/schemas';
import { pipe } from 'next-route-handler-pipe';
import { requiresCustomerAuth } from '@web-app/core/server/middlewares';
import { stripe } from '@web-app/core/server/payments';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@web-app/core/server/logger';

const HOST_NAME = process.env.HOST_NAME || 'http://localhost:3000';

async function postHandler(
  request: NextRequest & { customer: Omit<CustomerProfiles, 'password'> }
) {
  const correlationId = request.headers.get('x-correlation-id');

  try {
    const requestJson = await request.json();
    const { priceId, itemType } = CreateStripePaymentSchema.parse(requestJson);

    const { userId, stripeId } = request.customer;

    logger.info('New stripe payment checkout', {
      correlationId,
      data: JSON.stringify({ priceId, itemType, userId, stripeId }),
    });

    if (!stripeId) {
      logger.error('Stripe id not found', {
        app: 'web-app',
        correlationId,
        data: JSON.stringify({ priceId, itemType, userId, stripeId }),
      });

      return NextResponse.json(
        {
          data: null,
          message: 'Customer stripe id not found',
          success: false,
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: itemType,
      success_url: `${HOST_NAME}/app/settings/plans?success=true`,
      cancel_url: `${HOST_NAME}/app/settings/plans?canceled=true`,
      customer: stripeId,
      metadata: {
        userId,
        itemType,
        stripeId,
      },
    });

    logger.info('Created stripe session', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({ session }),
    });

    return NextResponse.json(
      {
        data: {
          url: session.url,
        },
        message: 'Created stripe payment checkout',
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error('Stripe payment checkout session', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({ err }),
    });

    return NextResponse.json(
      {
        data: null,
        message: 'Created stripe payment checkout',
        success: true,
      },
      { status: 200 }
    );
  }
}

export const POST = pipe(requiresCustomerAuth, postHandler);
