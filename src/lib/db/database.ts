// Make sure to install the 'pg' package
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, {
  schema,
  logger: true,
});
