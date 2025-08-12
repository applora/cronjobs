import { oneTapClient } from 'better-auth/client/plugins';
import { apiKeyClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [
    apiKeyClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!!,
    }),
  ],
});
