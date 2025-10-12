import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './server/_index';
import { auth } from './lib/auth';

const TRUSTED_ORIGINS = [
  "http://localhost:5173",
  "https://clario-web.pages.dev",
];

const app = new Hono();

app.use(
  '*',
  cors({
    origin: TRUSTED_ORIGINS,
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Access-Control-Request-Headers'],
    exposeHeaders: ['Content-Type', 'Set-Cookie'],
    credentials: true,
    maxAge: 86400,
  })
);

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (c) => {
      const resHeaders = new Headers();
      return {
        headers: Object.fromEntries(c.req.headers),
        auth,
        resHeaders,
      };
    },
  })
);

export default app;