import { db } from '@db';
import { customerProfiles } from '@db/schema';
import logger from '@web-app/core/server/logger';
import { stripe } from '@web-app/core/server/payments';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

const WEBHOOK_KEY = process.env.STRIPE_WEBHOOK_SECRET_KEY as string;

export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const requestText = await request.text();

  const signature = request.headers.get('Stripe-Signature') as string;

  logger.info('Processing stripe webhook', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({
      signature,
    }),
  });

  try {
    const event = stripe.webhooks.constructEvent(
      requestText,
      signature,
      WEBHOOK_KEY
    );

    const { type, data } = event;

    switch (type) {
      case 'customer.subscription.updated': {
        const customerId = data.object.customer;

        logger.info('Paid plan stripe webhook', {
          app: 'web-app',
          correlationId,
          data: JSON.stringify({
            customerId,
            data,
          }),
        });

        await db
          .update(customerProfiles)
          .set({ subscriptionTier: 'pro', subscriptionStatus: 'active' })
          .where(eq(customerProfiles.stripeId, customerId as string));

        break;
      }
      case 'customer.subscription.deleted': {
        const customerId = data.object.customer;

        logger.info('Cancelled plan stripe webhook', {
          app: 'web-app',
          correlationId,
          data: JSON.stringify({
            customerId,
            data,
          }),
        });

        await db
          .update(customerProfiles)
          .set({ subscriptionTier: 'free', subscriptionStatus: 'cancelled' })
          .where(eq(customerProfiles.stripeId, customerId as string));

        break;
      }
    }

    return Response.json(
      {
        data: null,
        message: 'Success Stripe webhook event',
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    logger.info('Stripe webhook error', {
      app: 'web-app',
      correlationId,
      data: {
        data: JSON.stringify({ err }),
      },
    });

    return Response.json(
      {
        data: null,
        message: 'Stripe Webhook error',
        success: false,
      },
      { status: 400 }
    );
  }
};
