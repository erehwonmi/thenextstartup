import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

export const useLogout = createMutation<
  Response,
  undefined,
  AxiosError<Response>
>({
  mutationFn: () =>
    client({
      url: '/api/auth/logout',
      method: 'DELETE',
    }).then((response) => response.data),
});
