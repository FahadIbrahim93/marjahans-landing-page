import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  createConversation,
  getConversation,
  getVisitorConversations,
  getActiveConversations,
  updateConversationStatus,
  addMessage,
  getConversationMessages,
  markMessagesAsRead,
  getChatSettings,
  updateChatSettings,
  recordChatAnalytics,
  getUnreadCount,
  getRecentConversationsWithUnread,
} from "./chat-db";

const toInternalError = (message: string, error: unknown) => {
  if (error instanceof TRPCError) return error;
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
    cause: error instanceof Error ? error : undefined,
  });
};

/**
 * Chat Router - All procedures for chat functionality
 */
export const chatRouter = router({
  /**
   * Start a new chat conversation
   */
  startConversation: publicProcedure
    .input(
      z.object({
        visitorId: z.string(),
        visitorName: z.string().optional(),
        visitorEmail: z.string().email().optional(),
        cartValue: z.number().default(0),
        cartItems: z.array(z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          quantity: z.number(),
        })).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const conversation = await createConversation({
          visitorId: input.visitorId,
          visitorName: input.visitorName,
          visitorEmail: input.visitorEmail,
          cartValue: input.cartValue,
          cartItems: input.cartItems as any,
          status: "active",
          source: "widget",
        });

        return {
          success: true,
          conversationId: conversation.id,
        };
      } catch (error: any) {
        console.error("[Chat] Failed to start conversation:", error);
        throw toInternalError("Failed to start conversation", error);
      }
    }),

  /**
   * Get conversation details
   */
  getConversation: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      try {
        const conversation = await getConversation(input.conversationId);
        if (!conversation) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" });
        }
        return conversation;
      } catch (error: any) {
        console.error("[Chat] Failed to get conversation:", error);
        throw toInternalError("Failed to get conversation", error);
      }
    }),

  /**
   * Get visitor's conversation history
   */
  getVisitorConversations: publicProcedure
    .input(z.object({ visitorId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getVisitorConversations(input.visitorId);
      } catch (error: any) {
        console.error("[Chat] Failed to get visitor conversations:", error);
        throw toInternalError("Failed to get conversations", error);
      }
    }),

  /**
   * Send a message
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().min(1).max(5000),
        senderType: z.enum(["visitor", "agent", "system"]),
        senderName: z.string().optional(),
        senderId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const message = await addMessage({
          conversationId: input.conversationId,
          content: input.content,
          senderType: input.senderType,
          senderName: input.senderName,
          senderId: input.senderId,
          type: "text",
          isRead: false,
        });

        return {
          success: true,
          messageId: message.id,
          createdAt: new Date(),
        };
      } catch (error: any) {
        console.error("[Chat] Failed to send message:", error);
        throw toInternalError("Failed to send message", error);
      }
    }),

  /**
   * Get conversation messages
   */
  getMessages: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        limit: z.number().max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      try {
        return await getConversationMessages(input.conversationId, input.limit);
      } catch (error: any) {
        console.error("[Chat] Failed to get messages:", error);
        throw toInternalError("Failed to get messages", error);
      }
    }),

  /**
   * Mark messages as read
   */
  markAsRead: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await markMessagesAsRead(input.conversationId);
        return { success: true };
      } catch (error: any) {
        console.error("[Chat] Failed to mark as read:", error);
        throw toInternalError("Failed to mark messages as read", error);
      }
    }),

  /**
   * Get unread count for conversation
   */
  getUnreadCount: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      try {
        const count = await getUnreadCount(input.conversationId);
        return { unreadCount: count };
      } catch (error: any) {
        console.error("[Chat] Failed to get unread count:", error);
        throw toInternalError("Failed to get unread count", error);
      }
    }),

  /**
   * Close conversation
   */
  closeConversation: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await updateConversationStatus(input.conversationId, "closed");
        return { success: true };
      } catch (error: any) {
        console.error("[Chat] Failed to close conversation:", error);
        throw toInternalError("Failed to close conversation", error);
      }
    }),

  /**
   * Get chat widget settings
   */
  getSettings: publicProcedure.query(async () => {
    try {
      const settings = await getChatSettings();
      return settings || {
        widgetTitle: "Chat with us",
        widgetSubtitle: "We're here to help",
        widgetColor: "#F59E0B",
        widgetPosition: "bottom-right",
        showWhenOffline: true,
        enableAbandonmentDetection: true,
        abandonmentDelay: 120000,
      };
    } catch (error: any) {
      console.error("[Chat] Failed to get settings:", error);
      throw toInternalError("Failed to get settings", error);
    }
  }),

  /**
   * Record chat analytics
   */
  recordAnalytics: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        messageCount: z.number(),
        responseTime: z.number().optional(),
        resolutionTime: z.number().optional(),
        rating: z.number().min(1).max(5).optional(),
        feedback: z.string().optional(),
        cartValueAtStart: z.number().optional(),
        cartValueAtEnd: z.number().optional(),
        orderPlaced: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await recordChatAnalytics(input.conversationId, {
          messageCount: input.messageCount,
          responseTime: input.responseTime,
          resolutionTime: input.resolutionTime,
          rating: input.rating,
          feedback: input.feedback,
          cartValueAtStart: input.cartValueAtStart,
          cartValueAtEnd: input.cartValueAtEnd,
          orderPlaced: input.orderPlaced,
        });

        return { success: true };
      } catch (error: any) {
        console.error("[Chat] Failed to record analytics:", error);
        throw toInternalError("Failed to record analytics", error);
      }
    }),

  /**
   * Get active conversations (admin only)
   */
  getActiveConversations: publicProcedure.query(async () => {
    try {
      return await getActiveConversations();
    } catch (error: any) {
      console.error("[Chat] Failed to get active conversations:", error);
      throw toInternalError("Failed to get active conversations", error);
    }
  }),

  /**
   * Get recent conversations with unread count (admin only)
   */
  getRecentConversations: publicProcedure
    .input(z.object({ limit: z.number().max(100).default(20) }))
    .query(async ({ input }) => {
      try {
        return await getRecentConversationsWithUnread(input.limit);
      } catch (error: any) {
        console.error("[Chat] Failed to get recent conversations:", error);
        throw toInternalError("Failed to get recent conversations", error);
      }
    }),
});
