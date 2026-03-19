import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth.js";
import { registerChatRoutes } from "../server/_core/chat.js";
import { registerAmoCrmOAuthRoutes } from "../server/amocrmOAuth.js";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";

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
