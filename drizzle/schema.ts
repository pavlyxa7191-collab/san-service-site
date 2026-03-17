import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("status", ["new", "contacted", "completed", "cancelled"]);

export const users = pgTable("users", {
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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Leads table — stores all form submissions from calculator and contact forms
export const leads = pgTable("leads", {
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

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// amoCRM OAuth2 tokens — stores access/refresh tokens persistently
export const amocrmTokens = pgTable("amocrm_tokens", {
  id: serial("id").primaryKey(),
  subdomain: varchar("subdomain", { length: 100 }).notNull(),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AmocrmToken = typeof amocrmTokens.$inferSelect;
export type InsertAmocrmToken = typeof amocrmTokens.$inferInsert;
