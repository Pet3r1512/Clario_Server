import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './server/_index';
import { auth } from './lib/auth';

const TRUSTED_ORIGIN = [
  "http://localhost:5173",
  "https://clario-web.pages.dev",
];

const app = new Hono();

app.options('*', (c) => {
  const origin = c.req.header('Origin') || TRUSTED_ORIGIN[0];
  if (!TRUSTED_ORIGIN.includes(origin)) return c.text('Not allowed', 403);

  return c.text('', 204 as any, {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,Cookie',
    'Access-Control-Allow-Credentials': 'true',
  });
});

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return TRUSTED_ORIGIN[0];
    return TRUSTED_ORIGIN.includes(origin) ? origin : TRUSTED_ORIGIN[0];
  },
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposeHeaders: ["Content-Type", "Set-Cookie"],
  credentials: true,
  maxAge: 600,
}));

app.use('/trpc/*', trpcServer({
  router: appRouter,
  createContext: (c) => {
    const resHeaders = new Headers();
    return {
      headers: Object.fromEntries(c.req.headers),
      auth,
      resHeaders,
    };
  },
}));

export default app;
