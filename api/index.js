var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
var roleEnum, statusEnum, users, leads, amocrmTokens;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    roleEnum = pgEnum("role", ["user", "admin"]);
    statusEnum = pgEnum("status", ["new", "contacted", "completed", "cancelled"]);
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: roleEnum("role").default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    leads = pgTable("leads", {
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
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    amocrmTokens = pgTable("amocrm_tokens", {
      id: serial("id").primaryKey(),
      subdomain: varchar("subdomain", { length: 100 }).notNull(),
      accessToken: text("accessToken").notNull(),
      refreshToken: text("refreshToken").notNull(),
      expiresAt: timestamp("expiresAt").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/amocrm.ts
var amocrm_exports = {};
__export(amocrm_exports, {
  createAmoCrmLead: () => createAmoCrmLead,
  exchangeCodeForTokens: () => exchangeCodeForTokens,
  hasAmoCrmTokens: () => hasAmoCrmTokens,
  isAmoCrmConfigured: () => isAmoCrmConfigured,
  testAmoCrmConnection: () => testAmoCrmConnection
});
import { desc, eq as eq2 } from "drizzle-orm";
function getConfig() {
  return {
    subdomain: process.env.AMO_SUBDOMAIN || "",
    clientId: process.env.AMO_CLIENT_ID || "",
    clientSecret: process.env.AMO_CLIENT_SECRET || "",
    redirectUri: process.env.AMO_REDIRECT_URI || ""
  };
}
function isAmoCrmConfigured() {
  const cfg = getConfig();
  return !!(cfg.subdomain && cfg.clientId && cfg.clientSecret);
}
function getBaseUrl(subdomain) {
  const cfg = getConfig();
  const sub = subdomain || cfg.subdomain;
  const baseDomain = process.env.AMO_BASE_DOMAIN || "amocrm.ru";
  return `https://${sub}.${baseDomain}`;
}
async function loadTokensFromDb() {
  try {
    const cfg = getConfig();
    if (!cfg.subdomain) return false;
    const db = await getDb();
    if (!db) return false;
    const rows = await db.select().from(amocrmTokens).where(eq2(amocrmTokens.subdomain, cfg.subdomain)).orderBy(desc(amocrmTokens.updatedAt)).limit(1);
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
async function ensureRefreshTokenFromDb() {
  if (cachedRefreshToken) return;
  const cfg = getConfig();
  if (!cfg.subdomain) return;
  try {
    const db = await getDb();
    if (!db) return;
    const rows = await db.select({ refreshToken: amocrmTokens.refreshToken }).from(amocrmTokens).where(eq2(amocrmTokens.subdomain, cfg.subdomain)).orderBy(desc(amocrmTokens.updatedAt)).limit(1);
    if (rows[0]?.refreshToken) {
      cachedRefreshToken = rows[0].refreshToken;
      console.log("[amoCRM] Loaded refresh token from DB (env access token without refresh)");
    }
  } catch (err) {
    console.warn("[amoCRM] ensureRefreshTokenFromDb:", err);
  }
}
async function saveTokensToDb(tokens) {
  try {
    const cfg = getConfig();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1e3);
    const db = await getDb();
    if (!db) {
      console.warn("[amoCRM] DB not available, tokens not persisted");
      return;
    }
    const existing = await db.select({ id: amocrmTokens.id }).from(amocrmTokens).where(eq2(amocrmTokens.subdomain, cfg.subdomain)).limit(1);
    if (existing.length > 0) {
      await db.update(amocrmTokens).set({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt
      }).where(eq2(amocrmTokens.subdomain, cfg.subdomain));
    } else {
      await db.insert(amocrmTokens).values({
        subdomain: cfg.subdomain,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt
      });
    }
    console.log("[amoCRM] Tokens saved to DB");
  } catch (err) {
    console.warn("[amoCRM] Failed to save tokens to DB:", err);
  }
}
async function exchangeCodeForTokens(code) {
  const cfg = getConfig();
  const response = await fetch(`${getBaseUrl()}/oauth2/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: cfg.redirectUri
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`amoCRM token exchange failed: ${response.status} ${err}`);
  }
  const tokens = await response.json();
  cachedAccessToken = tokens.access_token;
  cachedRefreshToken = tokens.refresh_token;
  tokenExpiresAt = Date.now() + (tokens.expires_in - 60) * 1e3;
  await saveTokensToDb(tokens);
  console.log("[amoCRM] Authorization code exchanged for tokens successfully");
  return tokens;
}
async function refreshAccessToken() {
  const cfg = getConfig();
  const refreshToken = cachedRefreshToken;
  if (!refreshToken) {
    throw new Error("amoCRM: no refresh token available");
  }
  const response = await fetch(`${getBaseUrl()}/oauth2/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: cfg.redirectUri
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`amoCRM token refresh failed: ${response.status} ${err}`);
  }
  const tokens = await response.json();
  cachedAccessToken = tokens.access_token;
  cachedRefreshToken = tokens.refresh_token;
  tokenExpiresAt = Date.now() + (tokens.expires_in - 60) * 1e3;
  await saveTokensToDb(tokens);
  console.log("[amoCRM] Access token refreshed successfully");
  return tokens.access_token;
}
async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }
  const envAccessToken = process.env.AMO_ACCESS_TOKEN;
  const envRefreshToken = process.env.AMO_REFRESH_TOKEN;
  if (envAccessToken) {
    cachedAccessToken = envAccessToken;
    if (envRefreshToken) cachedRefreshToken = envRefreshToken;
    await ensureRefreshTokenFromDb();
    tokenExpiresAt = Date.now() + 86400 * 1e3;
    return envAccessToken;
  }
  if (!cachedAccessToken) {
    const loaded = await loadTokensFromDb();
    if (loaded && cachedAccessToken && Date.now() < tokenExpiresAt) {
      return cachedAccessToken;
    }
  }
  if (cachedRefreshToken) {
    return refreshAccessToken();
  }
  throw new Error("amoCRM: no tokens available. Please complete OAuth2 authorization.");
}
async function amoRequest(method, path, body, retry = true) {
  const token = await getAccessToken();
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : void 0
  });
  if (response.status === 401 && retry) {
    console.log("[amoCRM] Got 401, refreshing token...");
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
async function createAmoCrmLead(input) {
  if (!isAmoCrmConfigured()) {
    console.log("[amoCRM] Not configured, skipping CRM push");
    return null;
  }
  const serviceLabel = input.service ? serviceLabels[input.service] || input.service : null;
  const propertyLabel = input.propertyType ? propertyLabels[input.propertyType] || input.propertyType : null;
  const parts = [serviceLabel, propertyLabel, input.area ? `${input.area} \u043C\xB2` : null].filter(Boolean);
  const leadName = parts.length > 0 ? parts.join(" | ") : "\u0417\u0430\u044F\u0432\u043A\u0430 \u0441 \u0441\u0430\u0439\u0442\u0430";
  const price = input.priceMin || void 0;
  const noteParts = [];
  if (input.method) noteParts.push(`\u041C\u0435\u0442\u043E\u0434: ${input.method}`);
  if (input.source) noteParts.push(`\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A: ${input.source}`);
  if (input.message) noteParts.push(`\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435: ${input.message}`);
  const contactFields = [
    {
      field_code: "PHONE",
      values: [{ value: input.phone, enum_code: "WORK" }]
    }
  ];
  if (input.email) {
    contactFields.push({
      field_code: "EMAIL",
      values: [{ value: input.email, enum_code: "WORK" }]
    });
  }
  const payload = [
    {
      name: leadName,
      price,
      _embedded: {
        contacts: [
          {
            first_name: input.name,
            custom_fields_values: contactFields
          }
        ]
      }
    }
  ];
  try {
    const result = await amoRequest(
      "POST",
      "/api/v4/leads/complex",
      payload
    );
    const leadId = Array.isArray(result) ? result[0]?.id : result?._embedded?.leads?.[0]?.id;
    console.log(`[amoCRM] Lead created successfully, ID: ${leadId}`);
    if (noteParts.length > 0 && leadId) {
      try {
        await amoRequest("POST", `/api/v4/leads/${leadId}/notes`, [
          {
            note_type: "common",
            params: { text: noteParts.join("\n") }
          }
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
  if (!isAmoCrmConfigured()) {
    return { ok: false, error: "amoCRM \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D. \u0423\u043A\u0430\u0436\u0438\u0442\u0435 AMO_SUBDOMAIN, AMO_CLIENT_ID, AMO_CLIENT_SECRET." };
  }
  try {
    const result = await amoRequest("GET", "/api/v4/account");
    return { ok: true, account: result.name || result.subdomain };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
async function hasAmoCrmTokens() {
  try {
    const cfg = getConfig();
    if (!cfg.subdomain) return false;
    const db = await getDb();
    if (!db) return false;
    const rows = await db.select({ id: amocrmTokens.id }).from(amocrmTokens).where(eq2(amocrmTokens.subdomain, cfg.subdomain)).limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}
var cachedAccessToken, cachedRefreshToken, tokenExpiresAt, serviceLabels, propertyLabels;
var init_amocrm = __esm({
  "server/amocrm.ts"() {
    "use strict";
    init_db();
    init_schema();
    cachedAccessToken = null;
    cachedRefreshToken = null;
    tokenExpiresAt = 0;
    serviceLabels = {
      klopov: "\u0423\u043D\u0438\u0447\u0442\u043E\u0436\u0435\u043D\u0438\u0435 \u043A\u043B\u043E\u043F\u043E\u0432",
      tarakanov: "\u0423\u043D\u0438\u0447\u0442\u043E\u0436\u0435\u043D\u0438\u0435 \u0442\u0430\u0440\u0430\u043A\u0430\u043D\u043E\u0432",
      gryzunov: "\u0423\u043D\u0438\u0447\u0442\u043E\u0436\u0435\u043D\u0438\u0435 \u0433\u0440\u044B\u0437\u0443\u043D\u043E\u0432",
      pleseni: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043F\u043B\u0435\u0441\u0435\u043D\u0438",
      kleshchey: "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043E\u0442 \u043A\u043B\u0435\u0449\u0435\u0439",
      dezinfektsii: "\u0414\u0435\u0437\u0438\u043D\u0444\u0435\u043A\u0446\u0438\u044F",
      zapahov: "\u0411\u043E\u0440\u044C\u0431\u0430 \u0441 \u0437\u0430\u043F\u0430\u0445\u0430\u043C\u0438",
      nasekomyh: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043D\u0430\u0441\u0435\u043A\u043E\u043C\u044B\u0435"
    };
    propertyLabels = {
      apartment: "\u041A\u0432\u0430\u0440\u0442\u0438\u0440\u0430",
      house: "\u0427\u0430\u0441\u0442\u043D\u044B\u0439 \u0434\u043E\u043C",
      office: "\u041E\u0444\u0438\u0441/\u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
      hostel: "\u041E\u0431\u0449\u0435\u0436\u0438\u0442\u0438\u0435/\u0433\u043E\u0441\u0442\u0438\u043D\u0438\u0446\u0430",
      warehouse: "\u0421\u043A\u043B\u0430\u0434/\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E"
    };
  }
});

// api/_index.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/chat.ts
init_env();
import { streamText, stepCountIs } from "ai";
import { tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod/v4";

// server/_core/patchedFetch.ts
function createPatchedFetch(originalFetch) {
  return async (input, init) => {
    const response = await originalFetch(input, init);
    if (!response.body) return response;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    const stream = new ReadableStream({
      async pull(controller) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer.length > 0) {
              const fixed = buffer.replace(/"type":""/g, '"type":"function"');
              controller.enqueue(encoder.encode(fixed));
            }
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const eventSeparator = "\n\n";
          let separatorIndex;
          while ((separatorIndex = buffer.indexOf(eventSeparator)) !== -1) {
            const completeEvent = buffer.slice(
              0,
              separatorIndex + eventSeparator.length
            );
            buffer = buffer.slice(separatorIndex + eventSeparator.length);
            const fixedEvent = completeEvent.replace(
              /"type":""/g,
              '"type":"function"'
            );
            controller.enqueue(encoder.encode(fixedEvent));
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });
    return new Response(stream, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText
    });
  };
}

// server/_core/chat.ts
function createLLMProvider() {
  const baseURL = ENV.forgeApiUrl.endsWith("/v1") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/v1`;
  return createOpenAI({
    baseURL,
    apiKey: ENV.forgeApiKey,
    fetch: createPatchedFetch(fetch)
  });
}
var tools = {
  getWeather: tool({
    description: "Get the current weather for a location",
    inputSchema: z.object({
      location: z.string().describe("The city and country, e.g. 'Tokyo, Japan'"),
      unit: z.enum(["celsius", "fahrenheit"]).optional().default("celsius")
    }),
    execute: async ({ location, unit }) => {
      const temp = Math.floor(Math.random() * 30) + 5;
      const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"][Math.floor(Math.random() * 4)];
      return {
        location,
        temperature: unit === "fahrenheit" ? Math.round(temp * 1.8 + 32) : temp,
        unit,
        conditions,
        humidity: Math.floor(Math.random() * 50) + 30
      };
    }
  }),
  calculate: tool({
    description: "Perform a mathematical calculation",
    inputSchema: z.object({
      expression: z.string().describe("The math expression to evaluate, e.g. '2 + 2'")
    }),
    execute: async ({ expression }) => {
      try {
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
        const result = Function(
          `"use strict"; return (${sanitized})`
        )();
        return { expression, result };
      } catch {
        return { expression, error: "Invalid expression" };
      }
    }
  })
};
function registerChatRoutes(app2) {
  const openai = createLLMProvider();
  app2.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }
      const result = streamText({
        model: openai.chat("gpt-4o"),
        system: "You are a helpful assistant. You have access to tools for getting weather and doing calculations. Use them when appropriate.",
        messages,
        tools,
        stopWhen: stepCountIs(5)
      });
      result.pipeUIMessageStreamToResponse(res);
    } catch (error) {
      console.error("[/api/chat] Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });
}

// server/amocrmOAuth.ts
init_amocrm();
function registerAmoCrmOAuthRoutes(app2) {
  app2.get("/api/amocrm/oauth", async (req, res) => {
    const { code, referer, platform } = req.query;
    console.log("[amoCRM OAuth] Callback received", { code: code ? "present" : "missing", referer, platform });
    if (!code) {
      return res.status(400).send(renderPage(false, "\u041E\u0448\u0438\u0431\u043A\u0430: \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 code \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0432 \u0437\u0430\u043F\u0440\u043E\u0441\u0435."));
    }
    try {
      const tokens = await exchangeCodeForTokens(code);
      console.log("[amoCRM OAuth] Authorization successful, tokens saved to DB");
      return res.send(renderPage(true, "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F \u043F\u0440\u043E\u0448\u043B\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E! \u0422\u043E\u043A\u0435\u043D\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B. \u0422\u0435\u043F\u0435\u0440\u044C \u0432\u0441\u0435 \u0437\u0430\u044F\u0432\u043A\u0438 \u0441 \u0441\u0430\u0439\u0442\u0430 \u0431\u0443\u0434\u0443\u0442 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043F\u0435\u0440\u0435\u0434\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0432 amoCRM.", tokens.expires_in));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[amoCRM OAuth] Token exchange failed:", errorMessage);
      return res.status(500).send(renderPage(false, `\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043C\u0435\u043D\u0435 \u043A\u043E\u0434\u0430 \u043D\u0430 \u0442\u043E\u043A\u0435\u043D\u044B: ${errorMessage}`));
    }
  });
}
function renderPage(success, message, expiresIn) {
  const icon = success ? "\u2705" : "\u274C";
  const title = success ? "amoCRM \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D" : "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F amoCRM";
  const bgColor = success ? "#0A0F1E" : "#1a0505";
  const accentColor = success ? "#D0021B" : "#cc4400";
  const expiryInfo = expiresIn ? `<p style="color:#888;font-size:14px;margin-top:8px;">\u0422\u043E\u043A\u0435\u043D \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u0435\u043D ${Math.round(expiresIn / 3600)} \u0447\u0430\u0441\u043E\u0432. \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.</p>` : "";
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: ${bgColor};
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 40px;
      max-width: 480px;
      width: 100%;
      text-align: center;
    }
    .icon { font-size: 56px; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
    .accent { color: ${accentColor}; }
    p { color: #ccc; line-height: 1.6; margin-bottom: 8px; }
    .btn {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 28px;
      background: ${accentColor};
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
    }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1 class="accent">${title}</h1>
    <p>${message}</p>
    ${expiryInfo}
    ${success ? `
    <p style="margin-top:16px;color:#aaa;font-size:14px;">\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u0432 \u043F\u0430\u043D\u0435\u043B\u044C \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435\xBB \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F.</p>
    <a href="/admin/leads" class="btn">\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043F\u0430\u043D\u0435\u043B\u044C \u043B\u0438\u0434\u043E\u0432 \u2192</a>
    ` : `
    <a href="/" class="btn">\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a>
    `}
  </div>
</body>
</html>`;
}

// server/routers.ts
import { z as z3 } from "zod";

// server/_core/systemRouter.ts
import { z as z2 } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn(
      "[Notification] Skipped: BUILT_IN_FORGE_API_URL / BUILT_IN_FORGE_API_KEY not set"
    );
    return false;
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z2.object({
      timestamp: z2.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z2.object({
      title: z2.string().min(1, "title is required"),
      content: z2.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db();
init_schema();
import { eq as eq3, desc as desc2 } from "drizzle-orm";
init_amocrm();
var serviceLabels2 = {
  klopov: "\u041A\u043B\u043E\u043F\u044B",
  tarakanov: "\u0422\u0430\u0440\u0430\u043A\u0430\u043D\u044B",
  gryzunov: "\u041A\u0440\u044B\u0441\u044B/\u043C\u044B\u0448\u0438",
  pleseni: "\u041F\u043B\u0435\u0441\u0435\u043D\u044C/\u0433\u0440\u0438\u0431\u043E\u043A",
  kleshchey: "\u041A\u043B\u0435\u0449\u0438",
  dezinfektsii: "\u0414\u0435\u0437\u0438\u043D\u0444\u0435\u043A\u0446\u0438\u044F",
  zapahov: "\u0411\u043E\u0440\u044C\u0431\u0430 \u0441 \u0437\u0430\u043F\u0430\u0445\u0430\u043C\u0438",
  nasekomyh: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043D\u0430\u0441\u0435\u043A\u043E\u043C\u044B\u0435"
};
var propertyLabels2 = {
  apartment: "\u041A\u0432\u0430\u0440\u0442\u0438\u0440\u0430",
  house: "\u0427\u0430\u0441\u0442\u043D\u044B\u0439 \u0434\u043E\u043C",
  office: "\u041E\u0444\u0438\u0441/\u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F",
  hostel: "\u041E\u0431\u0449\u0435\u0436\u0438\u0442\u0438\u0435/\u0433\u043E\u0441\u0442\u0438\u043D\u0438\u0446\u0430",
  warehouse: "\u0421\u043A\u043B\u0430\u0434/\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E"
};
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  leads: router({
    // Create a new lead from any form on the site
    create: publicProcedure.input(
      z3.object({
        name: z3.string().min(1).max(255),
        phone: z3.string().min(6).max(50),
        email: z3.string().email().optional().or(z3.literal("")),
        service: z3.string().optional(),
        propertyType: z3.string().optional(),
        area: z3.string().optional(),
        method: z3.string().optional(),
        source: z3.string().optional().default("website"),
        priceMin: z3.number().optional(),
        priceMax: z3.number().optional(),
        message: z3.string().optional()
      })
    ).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error(`Database unavailable. DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
      try {
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
          status: "new"
        });
      } catch (dbErr) {
        console.error("[leads.create] DB insert failed:", dbErr);
        throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435 \u0438\u043B\u0438 \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u043D\u0430\u043C.");
      }
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
          message: input.message || null
        });
        amoCrmLeadId = amoResult?.id || null;
      } catch (err) {
        console.error("[leads.create] amoCRM push failed (non-fatal):", err);
      }
      const serviceLabel = input.service ? serviceLabels2[input.service] || input.service : "\u2014";
      const propertyLabel = input.propertyType ? propertyLabels2[input.propertyType] || input.propertyType : "\u2014";
      const priceStr = input.priceMin ? `${input.priceMin.toLocaleString()} \u2013 ${(input.priceMax || Math.round(input.priceMin * 1.2)).toLocaleString()} \u20BD` : "\u2014";
      try {
        await notifyOwner({
          title: `\u{1F195} \u041D\u043E\u0432\u0430\u044F \u0437\u0430\u044F\u0432\u043A\u0430 \u043E\u0442 ${input.name}`,
          content: [
            `**\u0418\u043C\u044F:** ${input.name}`,
            `**\u0422\u0435\u043B\u0435\u0444\u043E\u043D:** ${input.phone}`,
            input.email ? `**Email:** ${input.email}` : null,
            `**\u0423\u0441\u043B\u0443\u0433\u0430:** ${serviceLabel}`,
            `**\u0422\u0438\u043F \u043E\u0431\u044A\u0435\u043A\u0442\u0430:** ${propertyLabel}`,
            `**\u041F\u043B\u043E\u0449\u0430\u0434\u044C:** ${input.area || "\u2014"}`,
            `**\u041C\u0435\u0442\u043E\u0434:** ${input.method || "\u2014"}`,
            `**\u0420\u0430\u0441\u0447\u0451\u0442\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C:** ${priceStr}`,
            `**\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A:** ${input.source || "\u0441\u0430\u0439\u0442"}`,
            input.message ? `**\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435:** ${input.message}` : null,
            amoCrmLeadId ? `**amoCRM \u043B\u0438\u0434 ID:** ${amoCrmLeadId}` : null
          ].filter(Boolean).join("\n")
        });
      } catch (notifyErr) {
        console.warn("[leads.create] Notification failed (non-fatal):", notifyErr);
      }
      return { success: true, amoCrmLeadId };
    }),
    // List all leads (admin only)
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Forbidden");
      }
      const db = await getDb();
      if (!db) return [];
      return db.select().from(leads).orderBy(desc2(leads.createdAt)).limit(100);
    }),
    // Update lead status (admin only)
    updateStatus: protectedProcedure.input(
      z3.object({
        id: z3.number(),
        status: z3.enum(["new", "contacted", "completed", "cancelled"])
      })
    ).mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(leads).set({ status: input.status }).where(eq3(leads.id, input.id));
      return { success: true };
    }),
    // Test amoCRM connection (admin only)
    testAmoCrm: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      return testAmoCrmConnection();
    }),
    // Exchange authorization code manually (admin only)
    // User copies the code from amoCRM integration settings and pastes it here
    exchangeCode: protectedProcedure.input(z3.object({ code: z3.string().min(10) })).mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      const { exchangeCodeForTokens: exchangeCodeForTokens2 } = await Promise.resolve().then(() => (init_amocrm(), amocrm_exports));
      const tokens = await exchangeCodeForTokens2(input.code);
      return { success: true, expiresIn: tokens.expires_in };
    }),
    // Get amoCRM configuration status (admin only)
    amoCrmStatus: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      const configured = isAmoCrmConfigured();
      const hasTokensInDb = await hasAmoCrmTokens();
      const subdomain = process.env.AMO_SUBDOMAIN || null;
      const clientId = process.env.AMO_CLIENT_ID || null;
      const redirectUri = process.env.AMO_REDIRECT_URI || "";
      const oauthUrl = clientId && redirectUri ? `https://www.amocrm.ru/oauth?client_id=${encodeURIComponent(clientId)}&state=admin&mode=popup&redirect_uri=${encodeURIComponent(redirectUri)}` : null;
      return {
        configured,
        subdomain,
        hasClientId: !!process.env.AMO_CLIENT_ID,
        hasClientSecret: !!process.env.AMO_CLIENT_SECRET,
        hasAccessToken: !!process.env.AMO_ACCESS_TOKEN || hasTokensInDb,
        hasRefreshToken: !!process.env.AMO_REFRESH_TOKEN || hasTokensInDb,
        hasTokensInDb,
        oauthUrl,
        redirectUri: process.env.AMO_REDIRECT_URI || null
      };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// api/_index.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerOAuthRoutes(app);
registerAmoCrmOAuthRoutes(app);
registerChatRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var index_default = app;
export {
  index_default as default
};
