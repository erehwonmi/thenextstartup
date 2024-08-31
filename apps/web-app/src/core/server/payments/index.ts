import 'server-only';

import Stripe from 'stripe';
import { createCustomer, lemonSqueezySetup, NewCustomer } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY as string,
});

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export * as lemonsqueezy from '@lemonsqueezy/lemonsqueezy.js';
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID as string;

export const createPaymentCustomerAccount = async ({
  provider = 'stripe',
  email,
}: {
  email: string;
  provider?: 'stripe' | 'lemonsqueezy';
}) => {
  switch (provider) {
    default:
    case 'stripe': {
      const params: Stripe.CustomerCreateParams = {
        description: `TheNextStartup Customer ${email}`,
        email,
      };

      const customer: Stripe.Customer = await stripe.customers.create(params);

      return customer.id;
    }
    case 'lemonsqueezy': {
      const params: NewCustomer = {
        email,
        name: `TheNextStartup Customer ${email}`,
      };

      const { data } = await createCustomer(LEMONSQUEEZY_STORE_ID, params);

      return data?.data.id;
    }
  }
};
