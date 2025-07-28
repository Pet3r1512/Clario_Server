import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './server/_index'
import 'dotenv/config';
import { env } from 'hono/adapter';

const app = new Hono()


app.get('/', (c) => {
  return c.text('Hello Hono!')

})

app.use("/api/auth/**", async (c, next) => {
  const trustedOrigin = env<{ TRUSTED_ORIGIN: string }>(c).TRUSTED_ORIGIN || "http://localhost:5173";
  cors({
    origin: trustedOrigin,
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
    credentials: true
  })(c, next);
})

app.use("/trpc/*", cors(),
  trpcServer({
    router: appRouter
  }))

export default app
