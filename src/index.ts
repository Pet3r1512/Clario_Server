import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './server/_index';
import { auth } from './lib/auth';
import 'dotenv/config';

const TRUSTED_ORIGIN = [
  "http://localhost:5173",
  "https://clario-web.pages.dev",
];

const app = new Hono();

app.get('/', (c) => c.text('Hello Hono!'));

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return TRUSTED_ORIGIN[0];
      return TRUSTED_ORIGIN.includes(origin) ? origin : TRUSTED_ORIGIN[0];
    },
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["Content-Type", "Set-Cookie"],
    credentials: true,
    maxAge: 600,
  })
);

app.use(
  "/trpc/*",
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
