import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './server/_index';
import { auth } from './lib/auth';

const TRUSTED_ORIGINS = [
  "http://localhost:5173",
  "https://clario-web.pages.dev",
];

const app = new Hono();

app.use('*', async (c, next) => {
  const origin = c.req.header('Origin');

  const isOriginAllowed = origin && TRUSTED_ORIGINS.includes(origin);

  if (c.req.method === 'OPTIONS') {
    // Handle preflight request
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isOriginAllowed ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  await next();

  if (isOriginAllowed) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Expose-Headers', 'Content-Type, Set-Cookie');
  }
});

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