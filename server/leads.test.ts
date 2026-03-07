import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database and notification modules
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  }),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("leads.create", () => {
  it("creates a lead with minimal required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.create({
      name: "Иван Иванов",
      phone: "+79300354841",
    });

    expect(result).toEqual({ success: true });
  });

  it("creates a lead with all fields from calculator", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.create({
      name: "Мария Петрова",
      phone: "+79161234567",
      email: "maria@example.com",
      service: "klopov",
      propertyType: "apartment",
      area: "medium",
      method: "cold_fog",
      source: "calculator",
      priceMin: 2500,
      priceMax: 3000,
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects lead with empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.create({
        name: "",
        phone: "+79300354841",
      })
    ).rejects.toThrow();
  });

  it("rejects lead with too short phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.create({
        name: "Иван",
        phone: "123",
      })
    ).rejects.toThrow();
  });

  it("rejects lead with invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.create({
        name: "Иван",
        phone: "+79300354841",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

describe("leads.list", () => {
  it("allows admin to list leads", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("blocks non-admin from listing leads", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.leads.list()).rejects.toThrow();
  });
});

describe("leads.updateStatus", () => {
  it("allows admin to update lead status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.updateStatus({
      id: 1,
      status: "contacted",
    });

    expect(result).toEqual({ success: true });
  });

  it("blocks non-admin from updating lead status", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.updateStatus({
        id: 1,
        status: "contacted",
      })
    ).rejects.toThrow();
  });
});
