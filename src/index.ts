import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './server/_index'
import 'dotenv/config';

const TRUSTED_ORIGIN = [
  "http://localhost:5173",  // for local dev
  "https://clario-web.pages.dev", // production
];

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')

})

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return TRUSTED_ORIGIN[0]; // allow server-to-server requests
      return TRUSTED_ORIGIN.includes(origin) ? origin : TRUSTED_ORIGIN[0];
    },
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["Content-Type"],
    credentials: true,
    maxAge: 600,
  })
);

// Apply tRPC only once — no extra cors()
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);

export default app;

