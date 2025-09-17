import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type AuthSession, getAuth } from '@/lib/auth/auth';
import { CreatePromptPage } from '@/modules/prompt/create-prompt-page';

export default async function Page() {
  const session = (await getAuth().api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })) as unknown as AuthSession;

  if (!session?.user) {
    return redirect('/auth');
  }

  return <CreatePromptPage />;
}
