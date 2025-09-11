import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { getAuth } from './auth.ts';

type Auth = ReturnType<typeof getAuth>;

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<Auth>()],
});
