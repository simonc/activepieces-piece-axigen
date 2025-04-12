import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { axigenAuth } from '../common/auth';
import type { AxigenAuth } from '../common/auth';
import { makeClient } from '../common/client';

export const customApiCall = createCustomApiCallAction({
  // @ts-ignore - Type compatibility issues between different versions of framework
  auth: axigenAuth,
  baseUrl: (auth) => makeClient(auth as unknown as AxigenAuth).baseUrl,
  authMapping: async (auth) => makeClient(auth as unknown as AxigenAuth).authHeaders,
});
