import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth.ts";
import { registerChatRoutes } from "../server/_core/chat.ts";
import { registerAmoCrmOAuthRoutes } from "../server/amocrmOAuth.ts";
import { appRouter } from "../server/routers.ts";
import { createContext } from "../server/_core/context.ts";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerOAuthRoutes(app);
registerAmoCrmOAuthRoutes(app);
registerChatRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
