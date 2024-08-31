import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { CreateLemonsqueezyPayment } from '@web-app/core/schemas';

type Response = { success: boolean; data?: { url: string }; message: string };

export const useCreateLemonsqueezyPayment = createMutation<
  Response,
  CreateLemonsqueezyPayment,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/payments/lemonsqueezy',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
