import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./server/_index";
import auth from "./lib/auth";
import "dotenv/config";
import { env } from "./env";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

const isProduction = env?.NODE_ENV === "production";

app.use(
  "*",
  cors({
    origin: isProduction
      ? ["https://www.clariofinance.site", "https://clariofinance.site"]
      : ["http://localhost:5173"],
    credentials: true,
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "User-Agent",
      "Referer",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
  }),
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});


app.get("/", (c) => {
  return c.json({
    message: "Hono server is running",
    env: env?.NODE_ENV,
    docs: new URL("/api/auth/reference", c.req.url).href,
  });
});

app.options("/api/auth/**", (c) => {
  const requestOrigin = c.req.header("Origin");
  const trustedOrigins = isProduction
    ? ["https://www.clariofinance.site", "https://clariofinance.site"]
    : ["http://localhost:5173", "http://192.168.50.89:5173"];

  if (requestOrigin && trustedOrigins.includes(requestOrigin)) {
    c.header("Access-Control-Allow-Origin", requestOrigin);
    c.header("Access-Control-Allow-Credentials", "true");
    c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    c.header("Vary", "Origin");
  }

  return c.body(null, 204);
});

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  const response = await auth.handler(c.req.raw);

  const newHeaders = new Headers(response.headers);
  const requestOrigin = c.req.header("Origin");
  const trustedOrigins = isProduction
    ? ["https://www.clariofinance.site", "https://clariofinance.site"]
    : ["http://localhost:5173", "http://192.168.50.89:5173"];

  if (requestOrigin && trustedOrigins.includes(requestOrigin)) {
    newHeaders.set("Access-Control-Allow-Origin", requestOrigin);
    newHeaders.set("Access-Control-Allow-Credentials", "true");
    newHeaders.set("Vary", "Origin");
  }

  return c.newResponse(response.body, response.status as any,
    Object.fromEntries(newHeaders.entries())
  );
});

app.get("/session", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ message: "Invalid or expired session" }, 401);
  }

  return c.json({
    user: session.user,
    session: session.session,
  });
});

app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
  }),
);

export default app
