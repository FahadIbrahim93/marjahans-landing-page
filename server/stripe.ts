import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';

/**
 * Stripe Integration Procedures
 * 
 * Setup required:
 * 1. Install Stripe: pnpm add stripe
 * 2. Add STRIPE_SECRET_KEY to environment variables
 * 3. Configure Stripe webhook endpoint
 */

// Initialize Stripe (lazy load)
let stripe: any = null;

function getStripe() {
  if (!stripe) {
    const Stripe = require('stripe');
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripe = new Stripe(secretKey);
  }
  return stripe;
}

/**
 * Cart item schema
 */
const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive().int(),
  image: z.string().optional(),
});

/**
 * Create payment intent
 */
export const stripeRouter = router({
  createPaymentIntent: publicProcedure
    .input(
      z.object({
        items: z.array(CartItemSchema),
        customerEmail: z.string().email(),
        taxRate: z.number().default(0.15),
        shippingCost: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const stripe = getStripe();

        // Calculate total
        const subtotal = input.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const tax = Math.round(subtotal * input.taxRate * 100); // Convert to cents
        const shipping = Math.round(input.shippingCost * 100);
        const total = Math.round((subtotal + subtotal * input.taxRate + input.shippingCost) * 100);

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: total,
          currency: 'bdt', // Bangladesh Taka
          receipt_email: input.customerEmail,
          metadata: {
            itemCount: input.items.length,
            itemNames: input.items.map((i) => i.name).join(', '),
          },
          description: `Marjahans Jewellery - ${input.items.length} item(s)`,
        });

        return {
          clientSecret: paymentIntent.client_secret,
          amount: total,
          currency: 'bdt',
        };
      } catch (error: any) {
        console.error('[Stripe] Payment intent creation error:', error);
        throw new Error('Failed to create payment intent');
      }
    }),

  /**
   * Retrieve payment status
   */
  getPaymentStatus: publicProcedure
    .input(z.object({ clientSecret: z.string() }))
    .query(async ({ input }) => {
      try {
        const stripe = getStripe();

        // Extract payment intent ID from client secret
        const paymentIntentId = input.clientSecret.split('_secret_')[0];

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return {
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          receiptEmail: paymentIntent.receipt_email,
          metadata: paymentIntent.metadata,
        };
      } catch (error: any) {
        console.error('[Stripe] Payment status retrieval error:', error);
        throw new Error('Failed to retrieve payment status');
      }
    }),

  /**
   * Handle webhook events (called from backend webhook handler)
   */
  handleWebhook: publicProcedure
    .input(
      z.object({
        type: z.string(),
        data: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        switch (input.type) {
          case 'payment_intent.succeeded':
            console.log('[Stripe] Payment succeeded:', input.data);
            // TODO: Update order status in database
            // TODO: Send confirmation email
            break;

          case 'payment_intent.payment_failed':
            console.log('[Stripe] Payment failed:', input.data);
            // TODO: Update order status in database
            // TODO: Send failure notification
            break;

          case 'charge.refunded':
            console.log('[Stripe] Charge refunded:', input.data);
            // TODO: Update order status in database
            // TODO: Send refund notification
            break;

          default:
            console.log('[Stripe] Unhandled webhook event:', input.type);
        }

        return { success: true };
      } catch (error: any) {
        console.error('[Stripe] Webhook handling error:', error);
        throw new Error('Failed to handle webhook');
      }
    }),
});
