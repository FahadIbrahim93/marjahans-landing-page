import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { stripeRouter } from "./stripe";
import { chatRouter } from "./chat-router";
import { productRouter } from "./product-router";
import { facebookSyncRouter } from "./facebook-sync-router";
import { facebookExtractionRouter } from "./facebook-extraction-router";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Stripe payment integration
  stripe: stripeRouter,

  // Chat widget integration
  chat: chatRouter,

  // Product catalog
  products: productRouter,

  // Facebook Shop integration
  facebookSync: facebookSyncRouter,

  // Facebook data extraction
  facebookExtraction: facebookExtractionRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
