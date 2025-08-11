import { type Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABSE_URL as string,
  },
} satisfies Config;
