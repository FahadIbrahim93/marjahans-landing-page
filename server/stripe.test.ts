import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { updateOrderPaymentStatusByIntent } = vi.hoisted(() => ({
  updateOrderPaymentStatusByIntent: vi.fn(),
}));

vi.mock("./product-db", () => ({
  updateOrderPaymentStatusByIntent,
}));

import { appRouter } from "./routers";

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Stripe Router - Webhook handling", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    updateOrderPaymentStatusByIntent.mockReset();
    updateOrderPaymentStatusByIntent.mockResolvedValue(true);
    caller = appRouter.createCaller(createMockContext());
  });

  it("updates order status for payment_intent.succeeded", async () => {
    const result = await caller.stripe.handleWebhook({
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_123",
        },
      },
    });

    expect(result).toEqual({ success: true });
    expect(updateOrderPaymentStatusByIntent).toHaveBeenCalledWith({
      stripePaymentIntentId: "pi_123",
      paymentStatus: "completed",
      status: "processing",
    });
  });

  it("updates order status for payment_intent.payment_failed", async () => {
    await caller.stripe.handleWebhook({
      type: "payment_intent.payment_failed",
      data: {
        object: {
          id: "pi_124",
        },
      },
    });

    expect(updateOrderPaymentStatusByIntent).toHaveBeenCalledWith({
      stripePaymentIntentId: "pi_124",
      paymentStatus: "failed",
      status: "cancelled",
    });
  });

  it("updates order status for charge.refunded using payment_intent fallback", async () => {
    await caller.stripe.handleWebhook({
      type: "charge.refunded",
      data: {
        object: {
          payment_intent: "pi_125",
        },
      },
    });

    expect(updateOrderPaymentStatusByIntent).toHaveBeenCalledWith({
      stripePaymentIntentId: "pi_125",
      paymentStatus: "refunded",
      status: "refunded",
    });
  });

  it("does not update order status when payment intent id is missing", async () => {
    const result = await caller.stripe.handleWebhook({
      type: "payment_intent.succeeded",
      data: {
        object: {},
      },
    });

    expect(result).toEqual({ success: true });
    expect(updateOrderPaymentStatusByIntent).not.toHaveBeenCalled();
  });
});
