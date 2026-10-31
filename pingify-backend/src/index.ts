import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import env from "./env.ts";
import appRouter from "./routes.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import { handleClerkWebhook } from "./module/user/user.webhook.ts";
import "./services/pusher.service.ts";

const app = express();
const PORT = env.PORT || 3000;

console.log("frontend url is ->",env.FRONTEND_URL);
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Registered before express.json(): signature verification needs the raw body.
app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), handleClerkWebhook);

// Clerk can send multiple cookies; keep all Set-Cookie headers instead of only the last one.
app.use("/api/__clerk", (_req, res, next) => {
  const originalSetHeader = res.setHeader.bind(res);

  res.setHeader = (headerName, headerValue) => {
    if (headerName.toLowerCase() !== "set-cookie") {
      return originalSetHeader(headerName, headerValue);
    }

    const existingCookies = res.getHeader("set-cookie");
    const existingCookieList = Array.isArray(existingCookies)
      ? existingCookies.map(String)
      : existingCookies
        ? [String(existingCookies)]
        : [];
    const newCookieList = Array.isArray(headerValue) ? headerValue.map(String) : [String(headerValue)];

    return originalSetHeader("set-cookie", [...existingCookieList, ...newCookieList]);
  };

  next();
});

// Registered before express.json(): the Clerk Frontend API proxy streams the raw body.
app.use(
  clerkMiddleware({
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
    secretKey: env.CLERK_SECRET_KEY,
    frontendApiProxy: {
      enabled: env.CLERK_SECRET_KEY.startsWith("sk_live_"),
      path: "/api/__clerk",
    },
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", appRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
