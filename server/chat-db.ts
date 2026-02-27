import { eq, and, desc, asc } from "drizzle-orm";
import { getDb } from "./db";
import {
  conversations,
  messages,
  chatSettings,
  chatAnalytics,
  type InsertConversation,
  type InsertMessage,
  type Conversation,
  type Message,
  type ChatSettings,
} from "../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * Create a new conversation
 */
export async function createConversation(data: Omit<InsertConversation, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conversationId = nanoid();
  const result = await db.insert(conversations).values({
    ...data,
    id: conversationId,
  });

  return { id: conversationId, ...data };
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  return result[0];
}

/**
 * Get all conversations for a visitor
 */
export async function getVisitorConversations(visitorId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.visitorId, visitorId))
    .orderBy(desc(conversations.createdAt));
}

/**
 * Get all active conversations (for admin dashboard)
 */
export async function getActiveConversations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.status, "active"))
    .orderBy(desc(conversations.updatedAt));
}

/**
 * Update conversation status
 */
export async function updateConversationStatus(conversationId: string, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(conversations)
    .set({ status: status as any })
    .where(eq(conversations.id, conversationId));
}

/**
 * Add a message to conversation
 */
export async function addMessage(data: Omit<InsertMessage, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const messageId = nanoid();
  await db.insert(messages).values({
    ...data,
    id: messageId,
  });

  return { id: messageId, ...data };
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(conversationId: string, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
    .limit(limit);
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(messages)
    .set({ isRead: true })
    .where(and(eq(messages.conversationId, conversationId), eq(messages.isRead, false)));
}

/**
 * Get chat settings
 */
export async function getChatSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(chatSettings).limit(1);
  return result[0];
}

/**
 * Update chat settings
 */
export async function updateChatSettings(data: Partial<ChatSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(chatSettings).limit(1);
  const settingsId = result[0]?.id || 1;

  if (result.length === 0) {
    await db.insert(chatSettings).values({ id: settingsId, ...data });
  } else {
    await db.update(chatSettings).set(data).where(eq(chatSettings.id, settingsId));
  }
}

/**
 * Record chat analytics
 */
export async function recordChatAnalytics(conversationId: string, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(chatAnalytics).values({
    conversationId,
    ...data,
  });
}

/**
 * Get unread message count for a conversation
 */
export async function getUnreadCount(conversationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(messages)
    .where(and(eq(messages.conversationId, conversationId), eq(messages.isRead, false)));

  return result.length;
}

/**
 * Get recent conversations with unread count
 */
export async function getRecentConversationsWithUnread(limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const convos = await db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .limit(limit);

  // For each conversation, count unread messages
  const withUnread = await Promise.all(
    convos.map(async (convo) => {
      const unreadCount = await getUnreadCount(convo.id);
      return { ...convo, unreadCount };
    })
  );

  return withUnread;
}
