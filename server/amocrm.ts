/**
 * amoCRM (Kommo) API v4 Integration
 *
 * Handles OAuth2 token management and lead/contact creation.
 * Credentials are stored in environment variables:
 *   AMO_SUBDOMAIN     — your amoCRM subdomain (e.g. "mycompany" → mycompany.kommo.com)
 *   AMO_CLIENT_ID     — integration client_id
 *   AMO_CLIENT_SECRET — integration client_secret
 *   AMO_REDIRECT_URI  — redirect URI registered in integration settings
 *   AMO_ACCESS_TOKEN  — current access token (auto-refreshed)
 *   AMO_REFRESH_TOKEN — current refresh token (auto-refreshed)
 *
 * Token refresh is handled automatically on 401 responses.
 */

interface AmoTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface AmoContact {
  name: string;
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

interface AmoLeadInput {
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
    accessToken: process.env.AMO_ACCESS_TOKEN || "",
    refreshToken: process.env.AMO_REFRESH_TOKEN || "",
  };
}

function isConfigured(): boolean {
  const cfg = getConfig();
  return !!(cfg.subdomain && cfg.clientId && cfg.clientSecret && (cfg.accessToken || cachedAccessToken));
}

function getBaseUrl(): string {
  const cfg = getConfig();
  return `https://${cfg.subdomain}.kommo.com`;
}

async function refreshAccessToken(): Promise<string> {
  const cfg = getConfig();
  const refreshToken = cachedRefreshToken || cfg.refreshToken;

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
  tokenExpiresAt = Date.now() + (tokens.expires_in - 60) * 1000; // refresh 1 min early

  console.log("[amoCRM] Access token refreshed successfully");
  return tokens.access_token;
}

async function getAccessToken(): Promise<string> {
  // Check in-memory cache first
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  // Try env token (first run)
  const cfg = getConfig();
  if (cfg.accessToken && !cachedAccessToken) {
    cachedAccessToken = cfg.accessToken;
    cachedRefreshToken = cfg.refreshToken;
    // Assume env token is valid; will refresh on 401
    tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000; // assume 23h
    return cfg.accessToken;
  }

  // Refresh using refresh token
  return refreshAccessToken();
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
  if (!isConfigured()) {
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
            name: input.name,
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
  if (!isConfigured()) {
    return { ok: false, error: "amoCRM не настроен. Укажите AMO_SUBDOMAIN, AMO_CLIENT_ID, AMO_CLIENT_SECRET, AMO_ACCESS_TOKEN." };
  }

  try {
    const result = await amoRequest<{ name: string; subdomain: string }>("GET", "/api/v4/account");
    return { ok: true, account: result.name || result.subdomain };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export { isConfigured as isAmoCrmConfigured };
