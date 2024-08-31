import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { SignupForm } from '@web-app/core/schemas';

type Response = {
  success: boolean;
  data: { resendCode: boolean };
  message: string;
};

export const useSignup = createMutation<
  Response,
  SignupForm,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/signup',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
