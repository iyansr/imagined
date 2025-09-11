'use client';

import { GithubIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        onClick={async () => {
          await authClient.signIn.social({
            provider: 'github',
          });
        }}
      >
        <GithubIcon /> Sign In with GitHub
      </Button>
    </div>
  );
}
