import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { useCartAbandonmentDetection } from "@/hooks/useCartAbandonmentDetection";

interface CartAbandonmentPromptProps {
  onChatClick?: () => void;
  chatColor?: string;
}

/**
 * CartAbandonmentPrompt Component
 * Shows a recovery prompt when customer has items in cart but hasn't checked out
 * Encourages them to start a chat with support
 */
export function CartAbandonmentPrompt({
  onChatClick,
  chatColor = "#F59E0B",
}: CartAbandonmentPromptProps) {
  const { isAbandonedCart, cartValue, itemCount, resetAbandonmentState } =
    useCartAbandonmentDetection();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isAbandonedCart || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    resetAbandonmentState();
  };

  const handleChatClick = () => {
    setIsDismissed(true);
    onChatClick?.();
  };

  // Format currency
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(cartValue / 100);

  return (
    <div className="fixed bottom-4 right-4 z-30 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div
        className="bg-white rounded-lg shadow-2xl overflow-hidden border-l-4"
        style={{ borderColor: chatColor }}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
              <p className="text-sm text-gray-600 mt-1">
                You have {itemCount} item{itemCount !== 1 ? "s" : ""} in your
                cart worth {formattedValue}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition p-1"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <p className="text-sm text-gray-700 mb-4">
            Have any questions about your order? Our support team is here to
            help! Chat with us to get instant answers.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleChatClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
              style={{ backgroundColor: chatColor }}
            >
              <MessageCircle className="w-4 h-4" />
              Chat Now
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              Later
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
          <p>✓ Instant responses • ✓ Expert help • ✓ 24/7 available</p>
        </div>
      </div>
    </div>
  );
}
