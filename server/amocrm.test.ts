import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Mock fetch globally ────────────────────────────────────────────────────
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// ─── Import after stubbing ──────────────────────────────────────────────────
import { createAmoCrmLead, testAmoCrmConnection, isAmoCrmConfigured } from "./amocrm";

// ─── Helper ─────────────────────────────────────────────────────────────────
function setEnv(overrides: Record<string, string | undefined> = {}) {
  const defaults: Record<string, string> = {
    AMO_SUBDOMAIN: "testcompany",
    AMO_CLIENT_ID: "test-client-id",
    AMO_CLIENT_SECRET: "test-client-secret",
    AMO_REDIRECT_URI: "https://example.com/callback",
    AMO_ACCESS_TOKEN: "test-access-token",
    AMO_REFRESH_TOKEN: "test-refresh-token",
  };
  for (const [k, v] of Object.entries({ ...defaults, ...overrides })) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

function clearEnv() {
  for (const k of ["AMO_SUBDOMAIN", "AMO_CLIENT_ID", "AMO_CLIENT_SECRET", "AMO_REDIRECT_URI", "AMO_ACCESS_TOKEN", "AMO_REFRESH_TOKEN"]) {
    delete process.env[k];
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────
describe("amoCRM module", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearEnv();
  });

  afterEach(() => {
    clearEnv();
  });

  describe("isAmoCrmConfigured", () => {
    it("returns false when env vars are missing", () => {
      expect(isAmoCrmConfigured()).toBe(false);
    });

    it("returns true when all required env vars are set", () => {
      setEnv();
      expect(isAmoCrmConfigured()).toBe(true);
    });

    it("returns false when only subdomain is set", () => {
      process.env.AMO_SUBDOMAIN = "testcompany";
      expect(isAmoCrmConfigured()).toBe(false);
    });
  });

  describe("createAmoCrmLead", () => {
    it("returns null and does not call fetch when not configured", async () => {
      const result = await createAmoCrmLead({
        name: "Иван Иванов",
        phone: "+79001234567",
      });
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("calls amoCRM API and returns lead id on success", async () => {
      setEnv();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [{ id: 12345, name: "Уничтожение клопов" }],
      });

      const result = await createAmoCrmLead({
        name: "Иван Иванов",
        phone: "+79001234567",
        service: "klopov",
        propertyType: "apartment",
        area: "45",
      });

      expect(result).toEqual({ id: 12345 });
      expect(mockFetch).toHaveBeenCalledOnce();

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain("testcompany.kommo.com");
      expect(url).toContain("/api/v4/leads/complex");
      expect(options.method).toBe("POST");
      expect(options.headers["Authorization"]).toBe("Bearer test-access-token");

      const body = JSON.parse(options.body);
      expect(body[0].name).toContain("Уничтожение клопов");
      expect(body[0]._embedded.contacts[0].name).toBe("Иван Иванов");
    });

    it("returns null (non-fatal) when API returns error", async () => {
      setEnv();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        text: async () => "Unprocessable Entity",
      });

      const result = await createAmoCrmLead({
        name: "Иван Иванов",
        phone: "+79001234567",
      });

      // Should not throw — CRM failure is non-fatal
      expect(result).toBeNull();
    });

    it("refreshes token on 401 and retries", async () => {
      setEnv();

      // First call → 401
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 401, text: async () => "Unauthorized" })
        // Token refresh call
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            access_token: "new-access-token",
            refresh_token: "new-refresh-token",
            expires_in: 86400,
            token_type: "Bearer",
          }),
        })
        // Retry lead creation
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [{ id: 99999 }],
        });

      const result = await createAmoCrmLead({
        name: "Тест",
        phone: "+79001234567",
      });

      expect(result).toEqual({ id: 99999 });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("builds correct lead name from service and property type", async () => {
      setEnv();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [{ id: 111 }],
      });

      await createAmoCrmLead({
        name: "Тест",
        phone: "+79001234567",
        service: "tarakanov",
        propertyType: "office",
        area: "200",
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body[0].name).toContain("Уничтожение тараканов");
      expect(body[0].name).toContain("Офис/организация");
      expect(body[0].name).toContain("200 м²");
    });

    it("includes email in contact custom fields when provided", async () => {
      setEnv();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [{ id: 222 }],
      });

      await createAmoCrmLead({
        name: "Тест",
        phone: "+79001234567",
        email: "test@example.com",
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      const contact = body[0]._embedded.contacts[0];
      const emailField = contact.custom_fields_values.find((f: any) => f.field_code === "EMAIL");
      expect(emailField).toBeDefined();
      expect(emailField.values[0].value).toBe("test@example.com");
    });
  });

  describe("testAmoCrmConnection", () => {
    it("returns ok: false with error message when not configured", async () => {
      const result = await testAmoCrmConnection();
      expect(result.ok).toBe(false);
      expect(result.error).toContain("AMO_SUBDOMAIN");
    });

    it("returns ok: true with account name on success", async () => {
      setEnv();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ name: "Мой аккаунт", subdomain: "testcompany" }),
      });

      const result = await testAmoCrmConnection();
      expect(result.ok).toBe(true);
      expect(result.account).toBe("Мой аккаунт");
    });

    it("returns ok: false with error on API failure", async () => {
      setEnv();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => "Forbidden",
      });

      const result = await testAmoCrmConnection();
      expect(result.ok).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
