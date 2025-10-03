import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './server/_index'
import 'dotenv/config';
import { env } from 'hono/adapter';

const app = new Hono()

console.log("BASE_URL:", process.env.BASE_URL);
console.log("TRUSTED_ORIGIN:", process.env.TRUSTED_ORIGIN);


app.get('/', (c) => {
  return c.text('Hello Hono!')

})

app.use('*', async (c, next) => {
  const trustedOrigin = env<{ TRUSTED_ORIGIN: string }>(c).TRUSTED_ORIGIN || "https://clario-web.pages.dev";

  const corsMiddleware = cors({
    origin: trustedOrigin,
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
    credentials: true
  });

  return corsMiddleware(c, next);
});

app.use("/trpc/*", cors(),
  trpcServer({
    router: appRouter
  }))

export default app
