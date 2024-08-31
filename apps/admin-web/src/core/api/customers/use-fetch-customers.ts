import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import { CustomerProfiles } from '@db/schema';
import { GetCustomers } from '@admin-web/core/schemas';

type Response = {
  success: boolean;
  data: {
    list: Omit<CustomerProfiles & { email: string }, 'password'>[];
    count: number;
    pageCount: number;
  };
  message: string;
};

export const useFetchCustomers = createQuery<
  Response,
  GetCustomers,
  AxiosError<Response>
>({
  fetcher: async (variables) => {
    return client({
      url: '/api/customers',
      params: variables,
      method: 'GET',
    }).then((response) => response.data);
  },
  queryKey: ['customers'],
});
