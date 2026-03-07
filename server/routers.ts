import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { leads } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

const serviceLabels: Record<string, string> = {
  klopov: "Клопы",
  tarakanov: "Тараканы",
  gryzunov: "Крысы/мыши",
  pleseni: "Плесень/грибок",
  kleshchey: "Клещи",
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
    // Create a new lead from calculator or contact form
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

        // Notify owner
        const serviceLabel = input.service ? (serviceLabels[input.service] || input.service) : "—";
        const propertyLabel = input.propertyType ? (propertyLabels[input.propertyType] || input.propertyType) : "—";
        const priceStr = input.priceMin
          ? `${input.priceMin.toLocaleString()} – ${(input.priceMax || input.priceMin * 1.2).toLocaleString()} ₽`
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
          ]
            .filter(Boolean)
            .join("\n"),
        });

        return { success: true };
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
  }),
});

export type AppRouter = typeof appRouter;
