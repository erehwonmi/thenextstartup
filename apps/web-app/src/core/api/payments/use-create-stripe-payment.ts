import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { CreateStripePayment } from '@web-app/core/schemas';

type Response = { success: boolean; data?: { url: string }; message: string };

export const useCreateStripePayment = createMutation<
  Response,
  CreateStripePayment,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/payments/stripe',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
