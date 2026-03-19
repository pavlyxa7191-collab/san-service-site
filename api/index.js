import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";

// ─── shared/const ────────────────────────────────────────────────────────────
const COOKIE_NAME = "app_session_id";
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
const UNAUTHED_ERR_MSG = "Please login (10001)";
const NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// ─── shared/_core/errors ─────────────────────────────────────────────────────
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}
const ForbiddenError = (msg) => new HttpError(403, msg);

// ─── server/_core/env ────────────────────────────────────────────────────────
const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

// ─── drizzle/schema ──────────────────────────────────────────────────────────
const roleEnum = pgEnum("role", ["user", "admin"]);
const statusEnum = pgEnum("status", [
  "new",
  "contacted",
  "completed",
  "cancelled",
]);

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),
  service: varchar("service", { length: 100 }),
  propertyType: varchar("propertyType", { length: 100 }),
  area: varchar("area", { length: 50 }),
  method: varchar("method", { length: 100 }),
  source: varchar("source", { length: 100 }).default("website"),
  priceMin: integer("priceMin"),
  priceMax: integer("priceMax"),
  message: text("message"),
  status: statusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

const amocrmTokens = pgTable("amocrm_tokens", {
  id: serial("id").primaryKey(),
  subdomain: varchar("subdomain", { length: 100 }).notNull(),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── server/db ───────────────────────────────────────────────────────────────
let _db = null;

async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    for (const field of textFields) {
      const value = user[field];
      if (value === undefined) continue;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({ target: users.openId, set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── server/_core/cookies ────────────────────────────────────────────────────
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");
  return protoList.some((p) => p.trim().toLowerCase() === "https");
}

function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req),
  };
}

// ─── server/_core/sdk (JWT session only) ─────────────────────────────────────
function getSessionSecret() {
  return new TextEncoder().encode(ENV.cookieSecret);
}

async function verifySession(cookieValue) {
  if (!cookieValue) return null;
  try {
    const { payload } = await jwtVerify(cookieValue, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    const { openId, appId, name } = payload;
    if (!openId || !appId || !name) return null;
    return { openId, appId, name };
  } catch {
    return null;
  }
}

async function authenticateRequest(req) {
  const cookieHeader = req.headers.cookie;
  const parsed = cookieHeader
    ? new Map(Object.entries(parseCookieHeader(cookieHeader)))
    : new Map();
  const sessionCookie = parsed.get(COOKIE_NAME);
  const session = await verifySession(sessionCookie);
  if (!session) throw ForbiddenError("Invalid session cookie");
  const user = await getUserByOpenId(session.openId);
  if (!user) throw ForbiddenError("User not found");
  await upsertUser({ openId: user.openId, lastSignedIn: new Date() });
  return user;
}

// ─── server/_core/trpc ───────────────────────────────────────────────────────
const t = initTRPC.context().create({ transformer: superjson });
const router = t.router;
const publicProcedure = t.procedure;

const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.user)
      throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    return next({ ctx: { ...ctx, user: ctx.user } });
  })
);

const adminProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.user || ctx.user.role !== "admin")
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    return next({ ctx: { ...ctx, user: ctx.user } });
  })
);

// ─── server/_core/context ────────────────────────────────────────────────────
async function createContext(opts) {
  let user = null;
  try {
    user = await authenticateRequest(opts.req);
  } catch {
    user = null;
  }
  return { req: opts.req, res: opts.res, user };
}

// ─── server/_core/notification ───────────────────────────────────────────────
async function notifyOwner(payload) {
  if (!payload.title || !payload.content) return false;
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Notification] Service not configured, skipping");
    return false;
  }
  const normalizedBase = ENV.forgeApiUrl.endsWith("/")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/`;
  const endpoint = new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({ title: payload.title, content: payload.content }),
    });
    if (!response.ok) {
      console.warn(`[Notification] Failed (${response.status})`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error:", error);
    return false;
  }
}

// ─── server/_core/systemRouter ───────────────────────────────────────────────
const systemRouter = router({
  health: publicProcedure
    .input(z.object({ timestamp: z.number().min(0) }))
    .query(() => ({ ok: true })),

  notifyOwner: adminProcedure
    .input(
      z.object({ title: z.string().min(1), content: z.string().min(1) })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return { success: delivered };
    }),
});

// ─── server/amocrm ───────────────────────────────────────────────────────────
let cachedAccessToken = null;
let cachedRefreshToken = null;
let tokenExpiresAt = 0;

function getAmoConfig() {
  return {
    subdomain: process.env.AMO_SUBDOMAIN || "",
    clientId: process.env.AMO_CLIENT_ID || "",
    clientSecret: process.env.AMO_CLIENT_SECRET || "",
    redirectUri: process.env.AMO_REDIRECT_URI || "",
  };
}

function isAmoCrmConfigured() {
  const cfg = getAmoConfig();
  return !!(cfg.subdomain && cfg.clientId && cfg.clientSecret);
}

function getAmoBaseUrl() {
  const cfg = getAmoConfig();
  const baseDomain = process.env.AMO_BASE_DOMAIN || "amocrm.ru";
  return `https://${cfg.subdomain}.${baseDomain}`;
}

async function loadTokensFromDb() {
  try {
    const cfg = getAmoConfig();
    if (!cfg.subdomain) return false;
    const db = await getDb();
    if (!db) return false;
    const rows = await db
      .select()
      .from(amocrmTokens)
      .where(eq(amocrmTokens.subdomain, cfg.subdomain))
      .orderBy(desc(amocrmTokens.updatedAt))
      .limit(1);
    if (rows.length === 0) return false;
    const row = rows[0];
    cachedAccessToken = row.accessToken;
    cachedRefreshToken = row.refreshToken;
    tokenExpiresAt = row.expiresAt.getTime();
    console.log("[amoCRM] Tokens loaded from DB");
    return true;
  } catch (err) {
    console.warn("[amoCRM] Failed to load tokens from DB:", err);
    return false;
  }
}

async function saveTokensToDb(tokens) {
  try {
    const cfg = getAmoConfig();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    const db = await getDb();
    if (!db) {
      console.warn("[amoCRM] DB not available, tokens not persisted");
      return;
    }
    const existing = await db
      .select({ id: amocrmTokens.id })
      .from(amocrmTokens)
      .where(eq(amocrmTokens.subdomain, cfg.subdomain))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(amocrmTokens)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt,
        })
        .where(eq(amocrmTokens.subdomain, cfg.subdomain));
    } else {
      await db.insert(amocrmTokens).values({
        subdomain: cfg.subdomain,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
      });
    }
    console.log("[amoCRM] Tokens saved to DB");
  } catch (err) {
    console.warn("[amoCRM] Failed to save tokens to DB:", err);
  }
}

async function exchangeCodeForTokens(code) {
  const cfg = getAmoConfig();
  const response = await fetch(`${getAmoBaseUrl()}/oauth2/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: cfg.redirectUri,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`amoCRM token exchange failed: ${response.status} ${err}`);
  }
  const tokens = await response.json();
  cachedAccessToken = tokens.access_token;
  cachedRefreshToken = tokens.refresh_token;
  tokenExpiresAt = Date.now() + (tokens.expires_in - 60) * 1000;
  await saveTokensToDb(tokens);
  console.log("[amoCRM] Authorization code exchanged successfully");
  return tokens;
}

async function refreshAccessToken() {
  const cfg = getAmoConfig();
  if (!cachedRefreshToken)
    throw new Error("amoCRM: no refresh token available");
  const response = await fetch(`${getAmoBaseUrl()}/oauth2/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      grant_type: "refresh_token",
      refresh_token: cachedRefreshToken,
      redirect_uri: cfg.redirectUri,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`amoCRM token refresh failed: ${response.status} ${err}`);
  }
  const tokens = await response.json();
  cachedAccessToken = tokens.access_token;
  cachedRefreshToken = tokens.refresh_token;
  tokenExpiresAt = Date.now() + (tokens.expires_in - 60) * 1000;
  await saveTokensToDb(tokens);
  return tokens.access_token;
}

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) return cachedAccessToken;

  const envAccessToken = process.env.AMO_ACCESS_TOKEN;
  const envRefreshToken = process.env.AMO_REFRESH_TOKEN;
  if (envAccessToken) {
    cachedAccessToken = envAccessToken;
    if (envRefreshToken) cachedRefreshToken = envRefreshToken;
    tokenExpiresAt = Date.now() + 86400 * 1000;
    return envAccessToken;
  }

  if (!cachedAccessToken) {
    const loaded = await loadTokensFromDb();
    if (loaded && cachedAccessToken && Date.now() < tokenExpiresAt)
      return cachedAccessToken;
  }

  if (cachedRefreshToken) return refreshAccessToken();

  throw new Error(
    "amoCRM: no tokens available. Please complete OAuth2 authorization."
  );
}

async function amoRequest(method, path, body, retry = true) {
  const token = await getAccessToken();
  const response = await fetch(`${getAmoBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 401 && retry) {
    cachedAccessToken = null;
    tokenExpiresAt = 0;
    await refreshAccessToken();
    return amoRequest(method, path, body, false);
  }
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`amoCRM API error ${response.status}: ${err}`);
  }
  if (response.status === 204) return {};
  return response.json();
}

const amoServiceLabels = {
  klopov: "Уничтожение клопов",
  tarakanov: "Уничтожение тараканов",
  gryzunov: "Уничтожение грызунов",
  pleseni: "Удаление плесени",
  kleshchey: "Обработка от клещей",
  dezinfektsii: "Дезинфекция",
  zapahov: "Борьба с запахами",
  nasekomyh: "Другие насекомые",
};

const amoPropertyLabels = {
  apartment: "Квартира",
  house: "Частный дом",
  office: "Офис/организация",
  hostel: "Общежитие/гостиница",
  warehouse: "Склад/производство",
};

async function createAmoCrmLead(input) {
  if (!isAmoCrmConfigured()) {
    console.log("[amoCRM] Not configured, skipping CRM push");
    return null;
  }
  const serviceLabel = input.service
    ? amoServiceLabels[input.service] || input.service
    : null;
  const propertyLabel = input.propertyType
    ? amoPropertyLabels[input.propertyType] || input.propertyType
    : null;
  const parts = [
    serviceLabel,
    propertyLabel,
    input.area ? `${input.area} м²` : null,
  ].filter(Boolean);
  const leadName = parts.length > 0 ? parts.join(" | ") : "Заявка с сайта";
  const price = input.priceMin || undefined;
  const noteParts = [];
  if (input.method) noteParts.push(`Метод: ${input.method}`);
  if (input.source) noteParts.push(`Источник: ${input.source}`);
  if (input.message) noteParts.push(`Сообщение: ${input.message}`);

  const contactFields = [
    { field_code: "PHONE", values: [{ value: input.phone, enum_code: "WORK" }] },
  ];
  if (input.email)
    contactFields.push({
      field_code: "EMAIL",
      values: [{ value: input.email, enum_code: "WORK" }],
    });

  const payload = [
    {
      name: leadName,
      price,
      _embedded: {
        contacts: [{ name: input.name, custom_fields_values: contactFields }],
      },
    },
  ];

  try {
    const result = await amoRequest("POST", "/api/v4/leads/complex", payload);
    const leadId = Array.isArray(result)
      ? result[0]?.id
      : result?._embedded?.leads?.[0]?.id;
    console.log(`[amoCRM] Lead created, ID: ${leadId}`);
    if (noteParts.length > 0 && leadId) {
      try {
        await amoRequest("POST", `/api/v4/leads/${leadId}/notes`, [
          { note_type: "common", params: { text: noteParts.join("\n") } },
        ]);
      } catch (noteErr) {
        console.warn("[amoCRM] Failed to add note:", noteErr);
      }
    }
    return { id: leadId };
  } catch (err) {
    console.error("[amoCRM] Failed to create lead:", err);
    return null;
  }
}

async function testAmoCrmConnection() {
  if (!isAmoCrmConfigured())
    return {
      ok: false,
      error:
        "amoCRM не настроен. Укажите AMO_SUBDOMAIN, AMO_CLIENT_ID, AMO_CLIENT_SECRET.",
    };
  try {
    const result = await amoRequest("GET", "/api/v4/account");
    return { ok: true, account: result.name || result.subdomain };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function hasAmoCrmTokens() {
  try {
    const cfg = getAmoConfig();
    if (!cfg.subdomain) return false;
    const db = await getDb();
    if (!db) return false;
    const rows = await db
      .select({ id: amocrmTokens.id })
      .from(amocrmTokens)
      .where(eq(amocrmTokens.subdomain, cfg.subdomain))
      .limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}

// ─── server/routers ──────────────────────────────────────────────────────────
const leadsServiceLabels = {
  klopov: "Клопы",
  tarakanov: "Тараканы",
  gryzunov: "Крысы/мыши",
  pleseni: "Плесень/грибок",
  kleshchey: "Клещи",
  dezinfektsii: "Дезинфекция",
  zapahov: "Борьба с запахами",
  nasekomyh: "Другие насекомые",
};

const leadsPropertyLabels = {
  apartment: "Квартира",
  house: "Частный дом",
  office: "Офис/организация",
  hostel: "Общежитие/гостиница",
  warehouse: "Склад/производство",
};

const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),

  leads: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          phone: z.string().min(6).max(50),
          email: z.string().email().optional().or(z.literal("")),
          service: z.string().optional(),
          propertyType: z.string().optional(),
          area: z.string().optional(),
          method: z.string().optional(),
          source: z.string().optional().default("website"),
          priceMin: z.number().optional(),
          priceMax: z.number().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(leads).values({
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          service: input.service || null,
          propertyType: input.propertyType || null,
          area: input.area || null,
          method: input.method || null,
          source: input.source || "website",
          priceMin: input.priceMin || null,
          priceMax: input.priceMax || null,
          message: input.message || null,
          status: "new",
        });

        let amoCrmLeadId = null;
        try {
          const amoResult = await createAmoCrmLead({
            name: input.name,
            phone: input.phone,
            email: input.email || null,
            service: input.service || null,
            propertyType: input.propertyType || null,
            area: input.area || null,
            method: input.method || null,
            source: input.source || null,
            priceMin: input.priceMin || null,
            priceMax: input.priceMax || null,
            message: input.message || null,
          });
          amoCrmLeadId = amoResult?.id || null;
        } catch (err) {
          console.error("[leads.create] amoCRM push failed (non-fatal):", err);
        }

        const serviceLabel = input.service
          ? leadsServiceLabels[input.service] || input.service
          : "—";
        const propertyLabel = input.propertyType
          ? leadsPropertyLabels[input.propertyType] || input.propertyType
          : "—";
        const priceStr = input.priceMin
          ? `${input.priceMin.toLocaleString()} – ${(input.priceMax || Math.round(input.priceMin * 1.2)).toLocaleString()} ₽`
          : "—";

        try {
          await notifyOwner({
            title: `🆕 Новая заявка от ${input.name}`,
            content: [
              `**Имя:** ${input.name}`,
              `**Телефон:** ${input.phone}`,
              input.email ? `**Email:** ${input.email}` : null,
              `**Услуга:** ${serviceLabel}`,
              `**Тип объекта:** ${propertyLabel}`,
              `**Площадь:** ${input.area || "—"}`,
              `**Метод:** ${input.method || "—"}`,
              `**Расчётная стоимость:** ${priceStr}`,
              `**Источник:** ${input.source || "сайт"}`,
              input.message ? `**Сообщение:** ${input.message}` : null,
              amoCrmLeadId ? `**amoCRM лид ID:** ${amoCrmLeadId}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
          });
        } catch (notifyErr) {
          console.warn(
            "[leads.create] Notification failed (non-fatal):",
            notifyErr
          );
        }

        return { success: true, amoCrmLeadId };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(100);
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "contacted", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Forbidden");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db
          .update(leads)
          .set({ status: input.status })
          .where(eq(leads.id, input.id));
        return { success: true };
      }),

    testAmoCrm: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      return testAmoCrmConnection();
    }),

    exchangeCode: protectedProcedure
      .input(z.object({ code: z.string().min(10) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Forbidden");
        const tokens = await exchangeCodeForTokens(input.code);
        return { success: true, expiresIn: tokens.expires_in };
      }),

    amoCrmStatus: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      const configured = isAmoCrmConfigured();
      const hasTokensInDb = await hasAmoCrmTokens();
      const subdomain = process.env.AMO_SUBDOMAIN || null;
      const clientId = process.env.AMO_CLIENT_ID || null;
      const redirectUri = process.env.AMO_REDIRECT_URI || "";
      const oauthUrl =
        subdomain && clientId
          ? `https://${subdomain}.amocrm.ru/oauth?client_id=${clientId}&state=admin&mode=popup&redirect_uri=${encodeURIComponent(redirectUri)}`
          : null;
      return {
        configured,
        subdomain,
        hasClientId: !!process.env.AMO_CLIENT_ID,
        hasClientSecret: !!process.env.AMO_CLIENT_SECRET,
        hasAccessToken: !!process.env.AMO_ACCESS_TOKEN || hasTokensInDb,
        hasRefreshToken: !!process.env.AMO_REFRESH_TOKEN || hasTokensInDb,
        hasTokensInDb,
        oauthUrl,
        redirectUri: process.env.AMO_REDIRECT_URI || null,
      };
    }),
  }),
});

// ─── amoCRM OAuth callback page ───────────────────────────────────────────────
function renderOAuthPage(success, message, expiresIn) {
  const icon = success ? "✅" : "❌";
  const title = success ? "amoCRM подключён" : "Ошибка подключения amoCRM";
  const bgColor = success ? "#0A0F1E" : "#1a0505";
  const accentColor = success ? "#D0021B" : "#cc4400";
  const expiryInfo = expiresIn
    ? `<p style="color:#888;font-size:14px;margin-top:8px;">Токен действителен ${Math.round(expiresIn / 3600)} часов.</p>`
    : "";
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${bgColor}; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; max-width: 480px; width: 100%; text-align: center; }
    .icon { font-size: 56px; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; color: ${accentColor}; }
    p { color: #ccc; line-height: 1.6; margin-bottom: 8px; }
    .btn { display: inline-block; margin-top: 24px; padding: 12px 28px; background: ${accentColor}; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    ${expiryInfo}
    ${
      success
        ? `<a href="/" class="btn">На главную →</a>`
        : `<a href="/" class="btn">На главную</a>`
    }
  </div>
</body>
</html>`;
}

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// amoCRM OAuth2 callback
app.get("/api/amocrm/oauth", async (req, res) => {
  const { code, referer, platform } = req.query;
  console.log("[amoCRM OAuth] Callback received", {
    code: code ? "present" : "missing",
    referer,
    platform,
  });
  if (!code) {
    return res
      .status(400)
      .send(
        renderOAuthPage(false, "Ошибка: параметр code отсутствует в запросе.")
      );
  }
  try {
    const tokens = await exchangeCodeForTokens(String(code));
    console.log("[amoCRM OAuth] Authorization successful");
    return res.send(
      renderOAuthPage(
        true,
        "Авторизация прошла успешно! Токены сохранены. Теперь все заявки с сайта будут автоматически передаваться в amoCRM.",
        tokens.expires_in
      )
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[amoCRM OAuth] Token exchange failed:", errorMessage);
    return res
      .status(500)
      .send(
        renderOAuthPage(
          false,
          `Ошибка при обмене кода на токены: ${errorMessage}`
        )
      );
  }
});

// Database diagnostic endpoint
app.get("/api/db-check", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.json({ ok: false, error: "No DB connection", DATABASE_URL: !!process.env.DATABASE_URL });
    }
    const result = await db.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    return res.json({ ok: true, tables: result.rows || result, DATABASE_URL: !!process.env.DATABASE_URL });
  } catch (err) {
    return res.json({ ok: false, error: String(err), cause: err?.cause ? String(err.cause) : undefined, DATABASE_URL: !!process.env.DATABASE_URL });
  }
});

// tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({ router: appRouter, createContext })
);

export default app;
