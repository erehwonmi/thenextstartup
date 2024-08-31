import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import { SubscriptionPlans } from '@db/schema';

type Variables = undefined;

type Response = {
  success: boolean;
  data: Omit<SubscriptionPlans, 'updatedAt' | 'createdAt'>[];
  message: string;
};

export const useFetchPlans = createQuery<
  Response,
  Variables,
  AxiosError<Response>
>({
  fetcher: async () => {
    return client({
      url: '/api/plans',
      method: 'GET',
    }).then((response) => response.data);
  },
  queryKey: ['plans'],
});
