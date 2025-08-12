import { Hono } from 'hono';

const app = new Hono();

export type AppType = typeof app;

export { app };
