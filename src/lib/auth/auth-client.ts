import { createAuthClient } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import type { auth } from './auth.ts';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
  plugins: [inferAdditionalFields<typeof auth>()],
});
