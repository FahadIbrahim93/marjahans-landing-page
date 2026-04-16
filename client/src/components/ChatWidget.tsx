import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { nanoid } from "nanoid";

interface Message {
  id: string;
  content: string;
  senderType: "visitor" | "agent" | "system";
  senderName?: string;
  createdAt: Date;
}

/**
 * ChatWidget Component
 * Floating chat widget with message interface and cart abandonment detection
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visitorId] = useState(() => nanoid());
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNameForm, setShowNameForm] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch chat settings
  const { data: settings } = trpc.chat.getSettings.useQuery();

  // tRPC mutations and queries
  const startConversationMutation = trpc.chat.startConversation.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const getMessagesMutation = trpc.chat.getMessages.useQuery(
    conversationId ? { conversationId, limit: 50 } : (null as any),
    { enabled: !!conversationId }
  );
  const getUnreadCountQuery = trpc.chat.getUnreadCount.useQuery(
    conversationId ? { conversationId } : (null as any),
    { enabled: !!conversationId }
  );

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when conversation is loaded
  useEffect(() => {
    if (getMessagesMutation.data) {
      setMessages(getMessagesMutation.data as Message[]);
    }
  }, [getMessagesMutation.data]);

  // Update unread count
  useEffect(() => {
    if (getUnreadCountQuery.data) {
      setUnreadCount(getUnreadCountQuery.data.unreadCount);
    }
  }, [getUnreadCountQuery.data]);

  // Start conversation with visitor info
  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await startConversationMutation.mutateAsync({
        visitorId,
        visitorName: visitorName || "Anonymous",
        visitorEmail: visitorEmail || undefined,
        cartValue: 0, // TODO: Get from cart store
        cartItems: [], // TODO: Get from cart store
      });

      setConversationId(result.conversationId);
      setShowNameForm(false);

      // Add welcome message
      const welcomeMessage: Message = {
        id: nanoid(),
        content:
          settings?.widgetSubtitle ||
          "We're here to help! How can we assist you today?",
        senderType: "system",
        senderName: "Support",
        createdAt: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversationId) return;

    const userMessage: Message = {
      id: nanoid(),
      content: inputValue,
      senderType: "visitor",
      senderName: visitorName || "You",
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        content: inputValue,
        senderType: "visitor",
        senderName: visitorName,
      });

      // Simulate agent response (in production, this would come from WebSocket)
      setTimeout(() => {
        const agentMessage: Message = {
          id: nanoid(),
          content:
            "Thanks for your message! A team member will respond shortly.",
          senderType: "agent",
          senderName: "Support Agent",
          createdAt: new Date(),
        };
        setMessages(prev => [...prev, agentMessage]);
      }, 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close widget
  const handleClose = () => {
    setIsOpen(false);
  };

  // Widget color from settings
  const widgetColor = settings?.widgetColor || "#F59E0B";
  const widgetPosition = settings?.widgetPosition || "bottom-right";
  const positionClass = widgetPosition === "bottom-left" ? "left-4" : "right-4";

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClass} bottom-4 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center`}
          style={{ backgroundColor: widgetColor }}
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed ${positionClass} bottom-4 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh] bg-white rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden`}
        >
          {/* Header */}
          <div
            className="p-4 text-white flex justify-between items-center"
            style={{ backgroundColor: widgetColor }}
          >
            <div>
              <h3 className="font-semibold">
                {settings?.widgetTitle || "Chat with us"}
              </h3>
              <p className="text-sm opacity-90">
                {settings?.widgetSubtitle || "We're here to help"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {showNameForm ? (
              <form onSubmit={handleStartConversation} className="space-y-3">
                <p className="text-sm text-gray-600">
                  Please provide your details to start chatting:
                </p>
                <input
                  type="text"
                  placeholder="Your name"
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": widgetColor } as any}
                  required
                />
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={visitorEmail}
                  onChange={e => setVisitorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": widgetColor } as any}
                />
                <button
                  type="submit"
                  disabled={isLoading || !visitorName.trim()}
                  className="w-full py-2 rounded-lg text-white font-medium disabled:opacity-50 transition"
                  style={{ backgroundColor: widgetColor }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Start Chat"
                  )}
                </button>
              </form>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === "visitor" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderType === "visitor"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {message.senderType !== "visitor" && (
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: widgetColor }}
                        >
                          {message.senderName}
                        </p>
                      )}
                      <p className="text-sm break-words">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.createdAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          {!showNameForm && (
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": widgetColor } as any}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2 rounded-lg text-white disabled:opacity-50 transition"
                  style={{ backgroundColor: widgetColor }}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
