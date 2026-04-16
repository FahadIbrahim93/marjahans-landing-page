import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { trpc } from "@/lib/trpc";

interface AbandonmentConfig {
  delay?: number; // milliseconds before showing abandonment prompt
  minCartValue?: number; // minimum cart value to trigger abandonment
  enabled?: boolean;
}

/**
 * Hook to detect cart abandonment and trigger chat prompts
 * Monitors cart state and shows recovery message after configured delay
 */
export function useCartAbandonmentDetection(config: AbandonmentConfig = {}) {
  const {
    delay = 120000, // 2 minutes default
    minCartValue = 0,
    enabled = true,
  } = config;

  const cartItems = useCartStore(state => state.items);
  const cartTotal = useCartStore(state => state.getTotalPrice());
  const [hasShownPrompt, setHasShownPrompt] = useState(false);
  const [isAbandonedCart, setIsAbandonedCart] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch chat settings to get abandonment configuration
  const { data: chatSettings } = trpc.chat.getSettings.useQuery();

  // Monitor cart for abandonment
  useEffect(() => {
    if (!enabled || !chatSettings?.enableAbandonmentDetection) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Check if cart has items and meets minimum value
    const hasItems = cartItems.length > 0;
    const meetsMinimumValue = cartTotal >= minCartValue;

    if (hasItems && meetsMinimumValue && !hasShownPrompt) {
      // Set timeout to show abandonment prompt
      const abandonmentDelay = chatSettings?.abandonmentDelay || delay;

      timeoutRef.current = setTimeout(() => {
        setIsAbandonedCart(true);
        setHasShownPrompt(true);

        // Trigger analytics event
        console.log("[Abandonment] Cart abandoned detected", {
          cartValue: cartTotal,
          itemCount: cartItems.length,
          timestamp: new Date().toISOString(),
        });
      }, abandonmentDelay);
    } else if (!hasItems) {
      // Reset when cart is empty
      setHasShownPrompt(false);
      setIsAbandonedCart(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    cartItems,
    cartTotal,
    enabled,
    chatSettings,
    minCartValue,
    hasShownPrompt,
    delay,
  ]);

  // Reset abandonment state when cart is updated
  const resetAbandonmentState = () => {
    setIsAbandonedCart(false);
    setHasShownPrompt(false);
  };

  return {
    isAbandonedCart,
    hasShownPrompt,
    cartValue: cartTotal,
    itemCount: cartItems.length,
    resetAbandonmentState,
  };
}
