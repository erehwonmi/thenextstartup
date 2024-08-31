import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { VerifyCode } from '@web-app/core/schemas';

type Response = {
  success: boolean;
  data: { expired: boolean; verified: boolean };
  message: string;
};

export const useVerifyCode = createMutation<
  Response,
  VerifyCode,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/verify',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
