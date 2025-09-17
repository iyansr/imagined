import { redirect } from 'next/navigation';

import { authClient } from '@/lib/auth/auth-client';
import { CreatePromptPage } from '@/modules/prompt/create-prompt-page';

export default async function Page() {
  const session = await authClient.getSession();

  if (!session.data?.user) {
    return redirect('/auth');
  }

  return <CreatePromptPage />;
}
