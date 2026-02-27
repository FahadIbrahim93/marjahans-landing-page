import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Chat conversations table
 * Stores individual chat sessions between customers and support team
 */
export const conversations = mysqlTable("conversations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  visitorName: text("visitorName"),
  visitorEmail: varchar("visitorEmail", { length: 320 }),
  assignedAgentId: int("assignedAgentId"),
  cartValue: int("cartValue").default(0),
  cartItems: json("cartItems"),
  status: mysqlEnum("status", ["active", "waiting", "closed", "archived"]).default("active").notNull(),
  source: varchar("source", { length: 50 }).default("widget").notNull(),
  tags: json("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  closedAt: timestamp("closedAt"),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Chat messages table
 * Stores individual messages within conversations
 */
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  conversationId: varchar("conversationId", { length: 64 }).notNull(),
  senderId: int("senderId"),
  senderType: mysqlEnum("senderType", ["visitor", "agent", "system"]).notNull(),
  senderName: text("senderName"),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["text", "image", "file", "system"]).default("text").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Chat settings table
 * Stores configuration for chat widget and support team
 */
export const chatSettings = mysqlTable("chatSettings", {
  id: int("id").autoincrement().primaryKey(),
  widgetTitle: text("widgetTitle"),
  widgetSubtitle: text("widgetSubtitle"),
  widgetColor: varchar("widgetColor", { length: 7 }).default("#F59E0B"),
  widgetPosition: mysqlEnum("widgetPosition", ["bottom-right", "bottom-left"]).default("bottom-right").notNull(),
  showWhenOffline: boolean("showWhenOffline").default(true).notNull(),
  offlineMessage: text("offlineMessage"),
  enableAbandonmentDetection: boolean("enableAbandonmentDetection").default(true).notNull(),
  abandonmentDelay: int("abandonmentDelay").default(120000),
  abandonmentMessage: text("abandonmentMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatSettings = typeof chatSettings.$inferSelect;
export type InsertChatSettings = typeof chatSettings.$inferInsert;

/**
 * Chat analytics table
 * Tracks chat metrics and performance
 */
export const chatAnalytics = mysqlTable("chatAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: varchar("conversationId", { length: 64 }).notNull(),
  messageCount: int("messageCount").default(0).notNull(),
  responseTime: int("responseTime"),
  resolutionTime: int("resolutionTime"),
  rating: int("rating"),
  feedback: text("feedback"),
  cartValueAtStart: int("cartValueAtStart"),
  cartValueAtEnd: int("cartValueAtEnd"),
  orderPlaced: boolean("orderPlaced").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatAnalytics = typeof chatAnalytics.$inferSelect;
export type InsertChatAnalytics = typeof chatAnalytics.$inferInsert;