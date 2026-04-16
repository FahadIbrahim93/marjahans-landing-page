/**
 * Stripe Integration Helper
 * Handles payment processing for jewelry e-commerce
 *
 * Setup required:
 * 1. Create Stripe account at https://stripe.com
 * 2. Get publishable key from Stripe Dashboard
 * 3. Add VITE_STRIPE_PUBLISHABLE_KEY to environment variables
 * 4. Create backend endpoint at /api/create-payment-intent
 */

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutSession {
  clientSecret: string;
  publishableKey: string;
}

/**
 * Initialize Stripe
 */
export async function initializeStripe() {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error("[Stripe] Publishable key not configured");
    return null;
  }

  // Load Stripe.js
  const script = document.createElement("script");
  script.src = "https://js.stripe.com/v3/";
  script.async = true;
  document.head.appendChild(script);

  return new Promise(resolve => {
    script.onload = () => {
      const stripe = (window as any).Stripe(publishableKey);
      resolve(stripe);
    };
  });
}

/**
 * Create payment intent on backend
 */
export async function createPaymentIntent(
  items: CheckoutItem[],
  customerEmail: string
): Promise<CheckoutSession | null> {
  try {
    const response = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        customerEmail,
      }),
    });

    if (!response.ok) {
      throw new Error(`Payment intent creation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      clientSecret: data.clientSecret,
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    };
  } catch (error) {
    console.error("[Stripe] Payment intent creation error:", error);
    return null;
  }
}

/**
 * Handle payment confirmation
 */
export async function confirmPayment(
  stripe: any,
  elements: any,
  clientSecret: string
) {
  try {
    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (result.error) {
      console.error("[Stripe] Payment error:", result.error.message);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[Stripe] Confirmation error:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Retrieve payment status
 */
export async function retrievePaymentStatus(clientSecret: string) {
  try {
    const response = await fetch(
      `/api/stripe/payment-status?clientSecret=${clientSecret}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Stripe] Status retrieval error:", error);
    return null;
  }
}

/**
 * Calculate total with tax and shipping
 */
export function calculateTotal(
  items: CheckoutItem[],
  taxRate = 0.15,
  shippingCost = 0
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  return {
    subtotal,
    tax,
    shipping: shippingCost,
    total,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency = "BDT") {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Validate payment form
 */
export function validatePaymentForm(formData: {
  email: string;
  name: string;
  phone: string;
  address: string;
}) {
  const errors: Record<string, string> = {};

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Valid email is required";
  }

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = "Name is required";
  }

  if (!formData.phone || !/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
    errors.phone = "Valid phone number is required";
  }

  if (!formData.address || formData.address.trim().length < 5) {
    errors.address = "Valid address is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Extend window type for Stripe
 */
declare global {
  interface Window {
    Stripe?: (publishableKey: string) => any;
  }
}
