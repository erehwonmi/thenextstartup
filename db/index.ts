import * as schema from './schema';

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL as string;
const authToken = process.env.DB_AUTH_TOKEN as string;
const logger = process.env.ENV === 'STAGING' ? true : false;

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema, logger });
