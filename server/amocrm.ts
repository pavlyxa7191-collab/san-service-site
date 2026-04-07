/**
 * amoCRM (Kommo) API v4 Integration
 *
 * Handles OAuth2 token management and lead/contact creation.
 * Credentials stored in environment variables:
 *   AMO_SUBDOMAIN     — your amoCRM subdomain (e.g. "mycompany" → mycompany.kommo.com)
 *   AMO_CLIENT_ID     — integration client_id
 *   AMO_CLIENT_SECRET — integration client_secret
 *   AMO_REDIRECT_URI  — redirect URI registered in integration settings
 *
 * Tokens are stored in the `amocrm_tokens` DB table and refreshed automatically.
 */

import { getDb } from "./db";
import { amocrmTokens } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";

interface AmoTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface AmoContact {
  /** В API v4 для контакта в complex используется first_name (не name). */
  first_name: string;
  custom_fields_values?: Array<{
    field_code: string;
    values: Array<{ value: string; enum_code?: string }>;
  }>;
}

interface AmoLead {
  name: string;
  price?: number;
  pipeline_id?: number;
  status_id?: number;
  custom_fields_values?: Array<{
    field_code: string;
    values: Array<{ value: string }>;
  }>;
  _embedded?: {
    contacts?: AmoContact[];
  };
}

export interface AmoLeadInput {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  propertyType?: string | null;
  area?: string | null;
  method?: string | null;
  source?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  message?: string | null;
}

// In-memory token cache (persists for process lifetime)
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let tokenExpiresAt: number = 0;

function getConfig() {
  return {
    subdomain: process.env.AMO_SUBDOMAIN || "",
    clientId: process.env.AMO_CLIENT_ID || "",
    clientSecret: process.env.AMO_CLIENT_SECRET || "",
    redirectUri: process.env.AMO_REDIRECT_URI || "",
  };
}

export function isAmoCrmConfigured(): boolean {
  const cfg = getConfig();
  return !!(cfg.subdomain && cfg.clientId && cfg.clientSecret);
}

function getBaseUrl(subdomain?: string): string {
  const cfg = getConfig();
  const sub = subdomain || cfg.subdomain;
  // Use amocrm.ru for Russian accounts, kommo.com is the international domain
  // The subdomain env var determines which base domain to use
  // If AMO_BASE_DOMAIN is set, use it; otherwise default to amocrm.ru
  const baseDomain = process.env.AMO_BASE_DOMAIN || "amocrm.ru";
  return `https://${sub}.${baseDomain}`;
}

/**
 * Load tokens from DB into memory cache.
 */
async function loadTokensFromDb(): Promise<boolean> {
  try {
    const cfg = getConfig();
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

/**
 * When AMO_ACCESS_TOKEN is set in env but AMO_REFRESH_TOKEN is not, pair it with
 * the refresh token from OAuth stored in DB — otherwise 401 recovery fails.
 */
async function ensureRefreshTokenFromDb(): Promise<void> {
  if (cachedRefreshToken) return;
  const cfg = getConfig();
  if (!cfg.subdomain) return;
  try {
    const db = await getDb();
    if (!db) return;
    const rows = await db
      .select({ refreshToken: amocrmTokens.refreshToken })
      .from(amocrmTokens)
      .where(eq(amocrmTokens.subdomain, cfg.subdomain))
      .orderBy(desc(amocrmTokens.updatedAt))
      .limit(1);
    if (rows[0]?.refreshToken) {
      cachedRefreshToken = rows[0].refreshToken;
      console.log("[amoCRM] Loaded refresh token from DB (env access token without refresh)");
    }
  } catch (err) {
    console.warn("[amoCRM] ensureRefreshTokenFromDb:", err);
  }
}

/**
 * Save tokens to DB.
 */
async function saveTokensToDb(tokens: AmoTokens): Promise<void> {
  try {
    const cfg = getConfig();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    const db = await getDb();
    if (!db) {
      console.warn("[amoCRM] DB not available, tokens not persisted");
      return;
    }

    // Check if row exists
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

/**
 * Exchange authorization code for access + refresh tokens (first-time OAuth2 flow).
 */
export async function exchangeCodeForTokens(code: string): Promise<AmoTokens> {
  const cfg = getConfig();

  const response = await fetch(`${getBaseUrl()}/oauth2/access_token`, {
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

  const tokens: AmoTokens = await response.json();

  // Cache in memory
  cachedAccessToken = tokens.access_token;
  cachedRefreshToken = tokens.refresh_token;
  tokenExpiresAt = Date.now() + (tokens.expires_in - 60) * 1000;

  // Persist to DB
  await saveTokensToDb(tokens);

  console.log("[amoCRM] Authorization code exchanged for tokens successfully");
  return tokens;
}

async function refreshAccessToken(): Promise<string> {
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
      redirect_uri: cfg.redirectUri,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`amoCRM token refresh failed: ${response.status} ${err}`);
  }

  const tokens: AmoTokens = await response.json();
  cachedAccessToken = tokens.access_token;
  cachedRefreshToken = tokens.refresh_token;
  tokenExpiresAt = Date.now() + (tokens.expires_in - 60) * 1000;

  await saveTokensToDb(tokens);
  console.log("[amoCRM] Access token refreshed successfully");
  return tokens.access_token;
}

async function getAccessToken(): Promise<string> {
  // Check in-memory cache first
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  // Check env vars (for backward compatibility / testing)
  const envAccessToken = process.env.AMO_ACCESS_TOKEN;
  const envRefreshToken = process.env.AMO_REFRESH_TOKEN;
  if (envAccessToken) {
    cachedAccessToken = envAccessToken;
    if (envRefreshToken) cachedRefreshToken = envRefreshToken;
    await ensureRefreshTokenFromDb();
    tokenExpiresAt = Date.now() + 86400 * 1000; // assume 24h
    return envAccessToken;
  }

  // Try loading from DB
  if (!cachedAccessToken) {
    const loaded = await loadTokensFromDb();
    if (loaded && cachedAccessToken && Date.now() < tokenExpiresAt) {
      return cachedAccessToken;
    }
  }

  // Refresh using refresh token
  if (cachedRefreshToken) {
    return refreshAccessToken();
  }

  throw new Error("amoCRM: no tokens available. Please complete OAuth2 authorization.");
}

async function amoRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  retry = true
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh on 401
  if (response.status === 401 && retry) {
    console.log("[amoCRM] Got 401, refreshing token...");
    cachedAccessToken = null;
    tokenExpiresAt = 0;
    await refreshAccessToken();
    return amoRequest<T>(method, path, body, false);
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`amoCRM API error ${response.status}: ${err}`);
  }

  // 204 No Content
  if (response.status === 204) return {} as T;

  return response.json();
}

const serviceLabels: Record<string, string> = {
  klopov: "Уничтожение клопов",
  tarakanov: "Уничтожение тараканов",
  gryzunov: "Уничтожение грызунов",
  pleseni: "Удаление плесени",
  kleshchey: "Обработка от клещей",
  dezinfektsii: "Дезинфекция",
  zapahov: "Борьба с запахами",
  nasekomyh: "Другие насекомые",
};

const propertyLabels: Record<string, string> = {
  apartment: "Квартира",
  house: "Частный дом",
  office: "Офис/организация",
  hostel: "Общежитие/гостиница",
  warehouse: "Склад/производство",
};

/**
 * Create a lead in amoCRM with embedded contact.
 * Uses "Complex addition" endpoint: POST /api/v4/leads/complex
 */
export async function createAmoCrmLead(input: AmoLeadInput): Promise<{ id: number } | null> {
  if (!isAmoCrmConfigured()) {
    console.log("[amoCRM] Not configured, skipping CRM push");
    return null;
  }

  const serviceLabel = input.service ? (serviceLabels[input.service] || input.service) : null;
  const propertyLabel = input.propertyType ? (propertyLabels[input.propertyType] || input.propertyType) : null;

  // Build lead name
  const parts = [serviceLabel, propertyLabel, input.area ? `${input.area} м²` : null].filter(Boolean);
  const leadName = parts.length > 0 ? parts.join(" | ") : "Заявка с сайта";

  // Build price
  const price = input.priceMin || undefined;

  // Build notes/tags for the lead
  const noteParts: string[] = [];
  if (input.method) noteParts.push(`Метод: ${input.method}`);
  if (input.source) noteParts.push(`Источник: ${input.source}`);
  if (input.message) noteParts.push(`Сообщение: ${input.message}`);

  // Build contact custom fields
  const contactFields: AmoContact["custom_fields_values"] = [
    {
      field_code: "PHONE",
      values: [{ value: input.phone, enum_code: "WORK" }],
    },
  ];
  if (input.email) {
    contactFields.push({
      field_code: "EMAIL",
      values: [{ value: input.email, enum_code: "WORK" }],
    });
  }

  const payload: AmoLead[] = [
    {
      name: leadName,
      price,
      _embedded: {
        contacts: [
          {
            first_name: input.name,
            custom_fields_values: contactFields,
          },
        ],
      },
    },
  ];

  try {
    const result = await amoRequest<Array<{ id: number }>>(
      "POST",
      "/api/v4/leads/complex",
      payload
    );

    const leadId = Array.isArray(result) ? result[0]?.id : (result as any)?._embedded?.leads?.[0]?.id;
    console.log(`[amoCRM] Lead created successfully, ID: ${leadId}`);

    // Add note if there are additional details
    if (noteParts.length > 0 && leadId) {
      try {
        await amoRequest("POST", `/api/v4/leads/${leadId}/notes`, [
          {
            note_type: "common",
            params: { text: noteParts.join("\n") },
          },
        ]);
      } catch (noteErr) {
        console.warn("[amoCRM] Failed to add note:", noteErr);
      }
    }

    return { id: leadId };
  } catch (err) {
    console.error("[amoCRM] Failed to create lead:", err);
    // Don't throw — CRM failure should not block form submission
    return null;
  }
}

/**
 * Test amoCRM connection by fetching account info.
 */
export async function testAmoCrmConnection(): Promise<{ ok: boolean; account?: string; error?: string }> {
  if (!isAmoCrmConfigured()) {
    return { ok: false, error: "amoCRM не настроен. Укажите AMO_SUBDOMAIN, AMO_CLIENT_ID, AMO_CLIENT_SECRET." };
  }

  try {
    const result = await amoRequest<{ name: string; subdomain: string }>("GET", "/api/v4/account");
    return { ok: true, account: result.name || result.subdomain };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Check if tokens are stored in DB (OAuth2 was completed).
 */
export async function hasAmoCrmTokens(): Promise<boolean> {
  try {
    const cfg = getConfig();
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
