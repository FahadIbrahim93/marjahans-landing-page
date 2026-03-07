import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TrpcContext } from './_core/context';

const mockState = {
  conversationCounter: 0,
  messageCounter: 0,
  conversations: new Map<string, any>(),
  messages: [] as any[],
};

vi.mock('./chat-db', () => {
  const reset = () => {
    mockState.conversationCounter = 0;
    mockState.messageCounter = 0;
    mockState.conversations.clear();
    mockState.messages = [];
  };

  const createConversation = async (data: any) => {
    const id = `conv-${++mockState.conversationCounter}`;
    const now = new Date();
    const conversation = { id, ...data, createdAt: now, updatedAt: now };
    mockState.conversations.set(id, conversation);
    return conversation;
  };

  const getConversation = async (conversationId: string) => {
    return mockState.conversations.get(conversationId);
  };

  const getVisitorConversations = async (visitorId: string) => {
    return Array.from(mockState.conversations.values())
      .filter(c => c.visitorId === visitorId)
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  };

  const getActiveConversations = async () => {
    return Array.from(mockState.conversations.values()).filter(c => c.status === 'active');
  };

  const updateConversationStatus = async (conversationId: string, status: string) => {
    const existing = mockState.conversations.get(conversationId);
    if (!existing) return;
    mockState.conversations.set(conversationId, {
      ...existing,
      status,
      updatedAt: new Date(),
    });
  };

  const addMessage = async (data: any) => {
    const id = `msg-${++mockState.messageCounter}`;
    const message = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockState.messages.push(message);
    return message;
  };

  const getConversationMessages = async (conversationId: string, limit = 50) => {
    return mockState.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
      .slice(0, limit);
  };

  const markMessagesAsRead = async (conversationId: string) => {
    mockState.messages = mockState.messages.map(m =>
      m.conversationId === conversationId ? { ...m, isRead: true } : m
    );
  };

  const getChatSettings = async () => null;
  const updateChatSettings = async () => true;
  const recordChatAnalytics = async () => true;

  const getUnreadCount = async (conversationId: string) => {
    return mockState.messages.filter(m => m.conversationId === conversationId && !m.isRead).length;
  };

  const getRecentConversationsWithUnread = async (limit: number) => {
    return Array.from(mockState.conversations.values())
      .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
      .slice(0, limit)
      .map(c => ({
        ...c,
        unreadCount: mockState.messages.filter(m => m.conversationId === c.id && !m.isRead).length,
      }));
  };

  return {
    __resetMockState: reset,
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
  };
});

import { appRouter } from './routers';

/**
 * Chat Router Tests
 * Tests for all chat functionality including conversations, messages, and settings
 */

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('Chat Router', () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    mockState.conversationCounter = 0;
    mockState.messageCounter = 0;
    mockState.conversations.clear();
    mockState.messages = [];
    ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe('startConversation', () => {
    it('should start a new conversation with visitor info', async () => {
      const result = await caller.chat.startConversation({
        visitorId: 'visitor-123',
        visitorName: 'John Doe',
        visitorEmail: 'john@example.com',
        cartValue: 5000,
      });

      expect(result.success).toBe(true);
      expect(result.conversationId).toBeDefined();
      expect(typeof result.conversationId).toBe('string');
    });

    it('should start conversation without email', async () => {
      const result = await caller.chat.startConversation({
        visitorId: 'visitor-456',
        visitorName: 'Jane Doe',
      });

      expect(result.success).toBe(true);
      expect(result.conversationId).toBeDefined();
    });

    it('should start conversation with cart items', async () => {
      const result = await caller.chat.startConversation({
        visitorId: 'visitor-789',
        visitorName: 'Bob Smith',
        cartValue: 15000,
        cartItems: [{ id: '1', name: 'Ring', price: 5000, quantity: 3 }],
      });

      expect(result.success).toBe(true);
      expect(result.conversationId).toBeDefined();
    });
  });

  describe('sendMessage', () => {
    let conversationId: string;

    beforeEach(async () => {
      const result = await caller.chat.startConversation({
        visitorId: 'visitor-msg-test',
        visitorName: 'Test User',
      });
      conversationId = result.conversationId;
    });

    it('should send a message to conversation', async () => {
      const result = await caller.chat.sendMessage({
        conversationId,
        content: 'Hello, I need help with my order',
        senderType: 'visitor',
        senderName: 'Test User',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });

    it('should reject empty messages', async () => {
      try {
        await caller.chat.sendMessage({
          conversationId,
          content: '',
          senderType: 'visitor',
        });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Too small');
      }
    });

    it('should reject messages exceeding max length', async () => {
      const longMessage = 'a'.repeat(5001);
      try {
        await caller.chat.sendMessage({
          conversationId,
          content: longMessage,
          senderType: 'visitor',
        });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Too big');
      }
    });

    it('should send agent message', async () => {
      const result = await caller.chat.sendMessage({
        conversationId,
        content: 'Thanks for reaching out! How can I help?',
        senderType: 'agent',
        senderName: 'Support Agent',
        senderId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send system message', async () => {
      const result = await caller.chat.sendMessage({
        conversationId,
        content: 'Conversation started',
        senderType: 'system',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe('getMessages', () => {
    let conversationId: string;

    beforeEach(async () => {
      const convResult = await caller.chat.startConversation({
        visitorId: 'visitor-get-msg-test',
        visitorName: 'Test User',
      });
      conversationId = convResult.conversationId;

      await caller.chat.sendMessage({
        conversationId,
        content: 'First message',
        senderType: 'visitor',
      });

      await caller.chat.sendMessage({
        conversationId,
        content: 'Second message',
        senderType: 'agent',
      });
    });

    it('should retrieve messages for conversation', async () => {
      const messages = await caller.chat.getMessages({ conversationId });
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
    });

    it('should respect limit parameter', async () => {
      const messages = await caller.chat.getMessages({ conversationId, limit: 1 });
      expect(messages.length).toBeLessThanOrEqual(1);
    });

    it('should reject invalid limit', async () => {
      try {
        await caller.chat.getMessages({ conversationId, limit: 101 });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Too big');
      }
    });
  });

  describe('closeConversation', () => {
    let conversationId: string;

    beforeEach(async () => {
      const result = await caller.chat.startConversation({
        visitorId: 'visitor-close-test',
        visitorName: 'Test User',
      });
      conversationId = result.conversationId;
    });

    it('should close a conversation', async () => {
      const result = await caller.chat.closeConversation({ conversationId });
      expect(result.success).toBe(true);
    });
  });

  describe('getSettings', () => {
    it('should retrieve chat settings', async () => {
      const settings = await caller.chat.getSettings();
      expect(settings).toBeDefined();
      expect(settings.widgetTitle).toBeDefined();
      expect(settings.widgetColor).toBeDefined();
      expect(settings.enableAbandonmentDetection).toBeDefined();
    });

    it('should have default values', async () => {
      const settings = await caller.chat.getSettings();
      expect(settings.widgetColor).toBe('#F59E0B');
      expect(settings.widgetPosition).toBe('bottom-right');
      expect(settings.showWhenOffline).toBe(true);
      expect(settings.enableAbandonmentDetection).toBe(true);
      expect(settings.abandonmentDelay).toBe(120000);
    });
  });

  describe('recordAnalytics', () => {
    let conversationId: string;

    beforeEach(async () => {
      const result = await caller.chat.startConversation({
        visitorId: 'visitor-analytics-test',
        visitorName: 'Test User',
      });
      conversationId = result.conversationId;
    });

    it('should record chat analytics', async () => {
      const result = await caller.chat.recordAnalytics({
        conversationId,
        messageCount: 5,
        responseTime: 1000,
        resolutionTime: 5000,
        rating: 5,
        feedback: 'Great support!',
        cartValueAtStart: 10000,
        cartValueAtEnd: 10000,
        orderPlaced: true,
      });

      expect(result.success).toBe(true);
    });

    it('should validate rating range', async () => {
      try {
        await caller.chat.recordAnalytics({
          conversationId,
          messageCount: 1,
          rating: 6,
        });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Too big');
      }
    });
  });

  describe('getUnreadCount', () => {
    let conversationId: string;

    beforeEach(async () => {
      const result = await caller.chat.startConversation({
        visitorId: 'visitor-unread-test',
        visitorName: 'Test User',
      });
      conversationId = result.conversationId;

      await caller.chat.sendMessage({
        conversationId,
        content: 'Test message',
        senderType: 'agent',
      });
    });

    it('should get unread message count', async () => {
      const result = await caller.chat.getUnreadCount({ conversationId });
      expect(result.unreadCount).toBeDefined();
      expect(typeof result.unreadCount).toBe('number');
    });
  });

  describe('getVisitorConversations', () => {
    it('should get all conversations for a visitor', async () => {
      const visitorId = 'visitor-history-test';

      await caller.chat.startConversation({ visitorId, visitorName: 'Test User' });
      await caller.chat.startConversation({ visitorId, visitorName: 'Test User' });

      const conversations = await caller.chat.getVisitorConversations({ visitorId });
      expect(Array.isArray(conversations)).toBe(true);
      expect(conversations.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getActiveConversations', () => {
    it('should retrieve active conversations', async () => {
      const conversations = await caller.chat.getActiveConversations();
      expect(Array.isArray(conversations)).toBe(true);
    });
  });

  describe('getRecentConversations', () => {
    it('should retrieve recent conversations with unread count', async () => {
      const result = await caller.chat.getRecentConversations({ limit: 10 });
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('unreadCount');
      }
    });

    it('should respect limit parameter', async () => {
      const result = await caller.chat.getRecentConversations({ limit: 5 });
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });
});
