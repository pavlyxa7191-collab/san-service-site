import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { leads } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { createAmoCrmLead, testAmoCrmConnection, isAmoCrmConfigured, hasAmoCrmTokens } from "./amocrm";

const serviceLabels: Record<string, string> = {
  klopov: "Клопы",
  tarakanov: "Тараканы",
  gryzunov: "Крысы/мыши",
  pleseni: "Плесень/грибок",
  kleshchey: "Клещи",
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  leads: router({
    // Create a new lead from any form on the site
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
        if (!db) throw new Error(`Database unavailable. DATABASE_URL set: ${!!process.env.DATABASE_URL}`);

        // 1. Save to local database
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
            status: "new",
          });
        } catch (dbErr: any) {
          const cause = dbErr?.cause;
          const causeMsg = cause?.message || cause?.detail || cause?.code || String(cause);
          throw new Error(`DB_INSERT_ERROR: ${dbErr.message} | CAUSE: ${causeMsg} | DB_URL_SET: ${!!process.env.DATABASE_URL}`);
        }

        // 2. Push to amoCRM (non-blocking — failure doesn't break form submission)
        let amoCrmLeadId: number | null = null;
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

        // 3. Notify owner
        const serviceLabel = input.service ? (serviceLabels[input.service] || input.service) : "—";
        const propertyLabel = input.propertyType ? (propertyLabels[input.propertyType] || input.propertyType) : "—";
        const priceStr = input.priceMin
          ? `${input.priceMin.toLocaleString()} – ${(input.priceMax || Math.round(input.priceMin * 1.2)).toLocaleString()} ₽`
          : "—";

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

        return { success: true, amoCrmLeadId };
      }),

    // List all leads (admin only)
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Forbidden");
      }
      const db = await getDb();
      if (!db) return [];
      return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100);
    }),

    // Update lead status (admin only)
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
        await db.update(leads).set({ status: input.status }).where(eq(leads.id, input.id));
        return { success: true };
      }),

    // Test amoCRM connection (admin only)
    testAmoCrm: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      return testAmoCrmConnection();
    }),

    // Exchange authorization code manually (admin only)
    // User copies the code from amoCRM integration settings and pastes it here
    exchangeCode: protectedProcedure
      .input(z.object({ code: z.string().min(10) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Forbidden");
        const { exchangeCodeForTokens } = await import("./amocrm");
        const tokens = await exchangeCodeForTokens(input.code);
        return { success: true, expiresIn: tokens.expires_in };
      }),

    // Get amoCRM configuration status (admin only)
    amoCrmStatus: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Forbidden");
      const configured = isAmoCrmConfigured();
      const hasTokensInDb = await hasAmoCrmTokens();
      const subdomain = process.env.AMO_SUBDOMAIN || null;
      const clientId = process.env.AMO_CLIENT_ID || null;

      // Build OAuth2 authorization URL
      // Use mode=popup so amoCRM does a real redirect to our callback URL
      // (post_message sends code via window.postMessage which we can't intercept server-side)
      const redirectUri = process.env.AMO_REDIRECT_URI || "";
      const oauthUrl = subdomain && clientId
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

export type AppRouter = typeof appRouter;
