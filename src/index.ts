import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './server/_index'
import 'dotenv/config';
import { env } from './env';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use("/api/auth/**",
  cors({
    origin: env ? env.TRUSTED_ORIGIN : "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
    credentials: true
  })
)

app.use("/trpc/*", cors(),
  trpcServer({
    router: appRouter
  }))

export default app
