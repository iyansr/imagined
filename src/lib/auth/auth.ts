import { getCloudflareContext } from '@opennextjs/cloudflare';
import { betterAuth, type Session, type User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { getDb } from '@/lib/db/database';
import * as schema from '@/lib/db/schema';

export const getAuth = () => {
  const ctx = getCloudflareContext();
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schema,
    }),
    appName: 'imagined',
    plugins: [],
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      github: {
        clientId: ctx.env.GITHUB_CLIENT_ID,
        clientSecret: ctx.env.GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: ctx.env.GOOGLE_CLIENT_ID,
        clientSecret: ctx.env.GOOGLE_CLIENT_SECRET,
      },
    },
  });
};

export type AuthSession = {
  session: Session | null;
  user: User | null;
};
