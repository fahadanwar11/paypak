import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  cnicNumber: text("cnic_number"),
  kycLevel: integer("kyc_level").default(0),
  isVerified: boolean("is_verified").default(false),
  preferredLanguage: text("preferred_language").default("en"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const balances = pgTable("balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  currency: text("currency").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'send', 'receive', 'exchange', 'add_money'
  fromCurrency: text("from_currency"),
  toCurrency: text("to_currency"),
  fromAmount: decimal("from_amount", { precision: 18, scale: 8 }),
  toAmount: decimal("to_amount", { precision: 18, scale: 8 }),
  fee: decimal("fee", { precision: 18, scale: 8 }).default("0"),
  status: text("status").default("pending"), // 'pending', 'completed', 'failed'
  recipientName: text("recipient_name"),
  recipientCountry: text("recipient_country"),
  exchangeRate: decimal("exchange_rate", { precision: 18, scale: 8 }),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const recipients = pgTable("recipients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  accountDetails: text("account_details"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const exchangeRates = pgTable("exchange_rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  rate: decimal("rate", { precision: 18, scale: 8 }).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  phoneNumber: true,
  firstName: true,
  lastName: true,
  cnicNumber: true,
  preferredLanguage: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  type: true,
  fromCurrency: true,
  toCurrency: true,
  fromAmount: true,
  toAmount: true,
  fee: true,
  recipientName: true,
  recipientCountry: true,
  exchangeRate: true,
});

export const insertRecipientSchema = createInsertSchema(recipients).pick({
  name: true,
  country: true,
  accountDetails: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Balance = typeof balances.$inferSelect;
export type Recipient = typeof recipients.$inferSelect;
export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertRecipient = z.infer<typeof insertRecipientSchema>;
