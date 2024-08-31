import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { DeleteTodo } from '@web-app/core/schemas';

type Response = { success: boolean; data: null; message: string };

export const useDeleteTodo = createMutation<
  Response,
  DeleteTodo,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: `/api/todos/${variables.id}`,
      method: 'DELETE',
    }).then((response) => response.data),
});
