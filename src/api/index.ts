import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { logger } from 'hono/logger';

const app = new Hono()
  .use(bearerAuth({ token: process.env.API_KEY! }))
  .use(logger())
  .get("/", (c) => c.text("Hello Supercrawler!"))


export default app;