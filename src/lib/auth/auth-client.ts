import { createAuthClient } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import type { getAuth } from './auth.ts';

type Auth = ReturnType<typeof getAuth>;

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<Auth>()],
});
