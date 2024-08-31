import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { LoginForm } from '@web-app/core/schemas';

type Response = { success: boolean; data: null; message: string };

export const useAdminLogin = createMutation<
  Response,
  LoginForm,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
