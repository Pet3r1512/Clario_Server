import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use("/api/auth/**",
  cors({
    origin: "localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
    credentials: true
  })
)
export default app
