import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { BanCustomers } from '@admin-web/core/schemas';

type Response = { success: boolean; data: null; message: string };

export const useBanCustomers = createMutation<
  Response,
  BanCustomers,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: `/api/customers/ban`,
      method: 'PUT',
      data: {
        userIds: variables.userIds,
      },
    }).then((response) => response.data),
});
