import { getAuth } from '@/lib/auth/auth';

function toNextJsHandler() {
  const handler = async (request: Request) => {
    return getAuth().handler(request);
  };
  return {
    GET: handler,
    POST: handler,
  };
}

export const { POST, GET } = toNextJsHandler();
