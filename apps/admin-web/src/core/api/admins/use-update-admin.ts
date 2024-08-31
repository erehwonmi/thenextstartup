import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { UpdateAdmin } from '@admin-web/core/schemas';

type Response = { success: boolean; data: null; message: string };

export const useUpdateAdmin = createMutation<
  Response,
  UpdateAdmin,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: `/api/admins/${variables.id}`,
      method: 'PUT',
      data: {
        adminType: variables.adminType,
      },
    }).then((response) => response.data),
});
