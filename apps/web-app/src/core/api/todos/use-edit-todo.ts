import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { EditTodo } from '@web-app/core/schemas';
import { Todos } from '@db/schema';

type Response = { success: boolean; data: Todos; message: string };

export const useEditTodo = createMutation<
  Response,
  EditTodo,
  AxiosError<Response>
>({
  mutationFn: async (variables) =>
    client({
      url: `/api/todos/${variables.id}`,
      method: 'PUT',
      data: {
        title: variables.title,
        description: variables.description,
        status: variables.status,
      },
    }).then((response) => response.data),
});
