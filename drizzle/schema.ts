import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

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
  status: mysqlEnum("status", ["active", "waiting", "closed", "archived"])
    .default("active")
    .notNull(),
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
  type: mysqlEnum("type", ["text", "image", "file", "system"])
    .default("text")
    .notNull(),
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
  widgetPosition: mysqlEnum("widgetPosition", ["bottom-right", "bottom-left"])
    .default("bottom-right")
    .notNull(),
  showWhenOffline: boolean("showWhenOffline").default(true).notNull(),
  offlineMessage: text("offlineMessage"),
  enableAbandonmentDetection: boolean("enableAbandonmentDetection")
    .default(true)
    .notNull(),
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
/**
 * Product categories table
 * Stores jewelry categories (Rings, Necklaces, Bracelets, etc.)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table
 * Stores jewelry products with pricing and inventory
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  price: int("price").notNull(), // Price in cents
  originalPrice: int("originalPrice"), // Original price for discounts
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  material: varchar("material", { length: 100 }), // Gold, Silver, Diamond, etc.
  weight: varchar("weight", { length: 50 }), // Weight in grams
  purity: varchar("purity", { length: 50 }), // 18K, 22K, etc.
  stock: int("stock").default(0).notNull(),
  minStock: int("minStock").default(5),
  rating: int("rating").default(0), // Average rating 0-5
  reviewCount: int("reviewCount").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false),
  tags: json("tags"), // Array of tags for filtering
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: varchar("seoDescription", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product images table
 * Stores multiple images for each product
 */
export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  altText: varchar("altText", { length: 255 }),
  displayOrder: int("displayOrder").default(0),
  isMain: boolean("isMain").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;

/**
 * Product variants table
 * Stores size, color, and other variant options
 */
export const productVariants = mysqlTable("productVariants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  size: varchar("size", { length: 50 }), // Ring size, necklace length, etc.
  color: varchar("color", { length: 50 }),
  material: varchar("material", { length: 100 }),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: int("price"), // Override product price if different
  stock: int("stock").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

/**
 * Product reviews table
 * Stores customer reviews and ratings
 */
export const productReviews = mysqlTable("productReviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 100 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  rating: int("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isVerified: boolean("isVerified").default(false),
  isApproved: boolean("isApproved").default(false),
  helpfulCount: int("helpfulCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;

/**
 * Orders table
 * Stores customer orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  shippingAddress: text("shippingAddress").notNull(),
  billingAddress: text("billingAddress"),
  subtotal: int("subtotal").notNull(),
  shippingCost: int("shippingCost").default(0),
  tax: int("tax").default(0),
  total: int("total").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ])
    .default("pending")
    .notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentStatus: mysqlEnum("paymentStatus", [
    "pending",
    "completed",
    "failed",
    "refunded",
  ])
    .default("pending")
    .notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  items: json("items").notNull(), // Array of order items
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  shippedAt: timestamp("shippedAt"),
  deliveredAt: timestamp("deliveredAt"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Wishlist items table
 * Stores customer wishlist items
 */
export const wishlistItems = mysqlTable("wishlistItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  visitorId: varchar("visitorId", { length: 64 }),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = typeof wishlistItems.$inferInsert;
