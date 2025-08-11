import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { captcha } from 'better-auth/plugins';
import { oneTap } from 'better-auth/plugins';
import { apiKey } from 'better-auth/plugins';
import { organization } from 'better-auth/plugins';

import { db } from '@/db';
import * as schema from '@/db/schema';

export const auth = betterAuth({
  advanced: {
    cookiePrefix: process.env.APP_PREFIX!!,
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(user, url, token);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!!,
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  plugins: [
    nextCookies(),
    apiKey(),
    oneTap(),
    organization(),
    captcha({
      provider: 'cloudflare-turnstile',
      secretKey: process.env.TURNSTILE_SECRET_KEY!!,
      endpoints: ['/sign-up/email', '/login/email'],
    }),
  ],
});
