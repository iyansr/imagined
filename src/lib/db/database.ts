import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { cache } from 'react';

import * as schema from './schema';

export const getDb = cache(() => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL as string,
    // You don't want to reuse the same connection for multiple requests
    maxUses: 1,
  });
  return drizzle({ client: pool, schema });
});
