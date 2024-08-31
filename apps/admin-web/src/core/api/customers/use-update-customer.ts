import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { UpdateCustomer } from '@admin-web/core/schemas';

type Response = { success: boolean; data: null; message: string };

export const useUpdateCustomer = createMutation<
  Response,
  UpdateCustomer,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: `/api/customers/${variables.id}`,
      method: 'PUT',
      data: {
        accountStatus: variables.accountStatus,
      },
    }).then((response) => response.data),
});
