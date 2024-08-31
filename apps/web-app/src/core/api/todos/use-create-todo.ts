import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { CreateTodo } from '@web-app/core/schemas';
import { Todos } from '@db/schema';

type Response = { success: boolean; data: Todos; message: string };

export const useCreateTodo = createMutation<
  Response,
  CreateTodo,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/todos',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
