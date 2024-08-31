import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import { Todos, TodoStatus } from '@db/schema';

type Variables = {
  status?: TodoStatus;
};

type Response = {
  success: boolean;
  data: Todos[];
  message: string;
};

export const useFetchTodos = createQuery<
  Response,
  Variables,
  AxiosError<Response>
>({
  fetcher: async (variables) => {
    return client({
      url: '/api/todos',
      method: 'GET',
      params: {
        status: variables?.status ?? '',
      },
    }).then((response) => response.data);
  },
  queryKey: ['todos'],
});
