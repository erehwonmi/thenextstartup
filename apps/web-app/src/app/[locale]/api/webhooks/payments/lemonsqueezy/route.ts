import crypto from 'crypto';

import { db } from '@db';
import { customerProfiles } from '@db/schema';
import { eq } from 'drizzle-orm';
import { LemonsqueezyWebhookEventSchema } from '@web-app/core/schemas';
import { NextRequest } from 'next/server';
import logger from '@web-app/core/server/logger';

const WEBHOOK_KEY = process.env.LEMONSQUEEZY_SECRET_KEY as string;

export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  const clonedReq = request.clone();

  const hmac = crypto.createHmac('sha256', WEBHOOK_KEY);
  const digest = Buffer.from(
    hmac.update(await clonedReq.text()).digest('hex'),
    'utf8'
  );
  const signature = Buffer.from(
    request.headers.get('X-Signature') || '',
    'utf8'
  );



  logger.info('Verifying lemonsqueezy webhook signature', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({
      signature,
    }),
  });

  if (!crypto.timingSafeEqual(digest, signature)) {
   
    logger.error('Invalid lemonsqueezy webhook signature', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({
        signature,
      }),
    });

    return Response.json(
      {
        data: null,
        message: 'Lemonsqueezy Webhook Invalid signature',
        success: false,
      },
      { status: 400 }
    );
  }

  logger.info('Processing lemonsqueezy webhook', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({
      signature,
    }),
  });

  try {
    const payload = await request.json();

    const { meta, data } = LemonsqueezyWebhookEventSchema.parse(payload);

    switch (meta.event_name) {
      case 'subscription_payment_success': {
        const customerId = data.attributes.customer_id;

        logger.info('Paid plan lemonsqueezy webhook', {
          app: 'web-app',
          correlationId,
          data: JSON.stringify({
            meta,
            customerId,
            data,
          }),
        });

        await db
          .update(customerProfiles)
          .set({ subscriptionTier: 'pro', subscriptionStatus: 'active' })
          .where(eq(customerProfiles.lemonSqueezyId, customerId));

        break;
      }
      case 'subscription_payment_refunded':
      case 'subscription_expired':
      case 'subscription_cancelled': {
        const customerId = data.attributes.customer_id;

        logger.info('Cancelled plan stripe webhook', {
          app: 'web-app',
          correlationId,
          data: JSON.stringify({
            meta,
            customerId,
            data,
          }),
        });

        await db
          .update(customerProfiles)
          .set({ subscriptionTier: 'free', subscriptionStatus: 'cancelled' })
          .where(eq(customerProfiles.lemonSqueezyId, customerId));
        break;
      }
    }

    return Response.json(
      {
        data: null,
        message: 'Success Lemonsqueezy webhook event',
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {

    logger.info('Lemonsqueezy webhook error', {
      app: 'web-app',
      correlationId,
      data: {
        data: JSON.stringify({ err }),
      },
    });

    return Response.json(
      {
        data: null,
        message: 'Lemonsqueezy Webhook error',
        success: false,
      },
      { status: 400 }
    );
  }
};
