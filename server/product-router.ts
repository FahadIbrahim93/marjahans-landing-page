import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getProductBySlug,
  getProductById,
  getProductImages,
  getProductVariants,
  getProductReviews,
  getProductRating,
  addToWishlist,
  removeFromWishlist,
  getWishlistItems,
  isInWishlist,
} from "./product-db";

/**
 * Product Router
 * Handles all product catalog operations
 */

export const productRouter = router({
  // Get all categories
  getCategories: publicProcedure.query(async () => {
    return await getCategories();
  }),

  // Get category by slug
  getCategoryBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      return await getCategoryBySlug(input.slug);
    }),

  // Get products with filtering
  getProducts: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      return await getProducts(input);
    }),

  // Get product by slug
  getProductBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const product = await getProductBySlug(input.slug);
      if (!product) return null;

      const images = await getProductImages(product.id);
      const variants = await getProductVariants(product.id);
      const reviews = await getProductReviews(product.id, 5);
      const rating = await getProductRating(product.id);

      return {
        ...product,
        images,
        variants,
        reviews,
        rating,
      };
    }),

  // Get product by ID
  getProductById: publicProcedure
    .input(z.object({ id: z.number().min(1) }))
    .query(async ({ input }) => {
      const product = await getProductById(input.id);
      if (!product) return null;

      const images = await getProductImages(product.id);
      const variants = await getProductVariants(product.id);
      const reviews = await getProductReviews(product.id, 5);
      const rating = await getProductRating(product.id);

      return {
        ...product,
        images,
        variants,
        reviews,
        rating,
      };
    }),

  // Get product images
  getProductImages: publicProcedure
    .input(z.object({ productId: z.number().min(1) }))
    .query(async ({ input }) => {
      return await getProductImages(input.productId);
    }),

  // Get product variants
  getProductVariants: publicProcedure
    .input(z.object({ productId: z.number().min(1) }))
    .query(async ({ input }) => {
      return await getProductVariants(input.productId);
    }),

  // Get product reviews
  getProductReviews: publicProcedure
    .input(
      z.object({
        productId: z.number().min(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      return await getProductReviews(input.productId, input.limit);
    }),

  // Get product rating
  getProductRating: publicProcedure
    .input(z.object({ productId: z.number().min(1) }))
    .query(async ({ input }) => {
      return await getProductRating(input.productId);
    }),

  // ============ WISHLIST ============

  // Add to wishlist
  addToWishlist: publicProcedure
    .input(
      z.object({
        productId: z.number().min(1),
        visitorId: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await addToWishlist(
        input.productId,
        input.visitorId,
        input.userId
      );
      return { success };
    }),

  // Remove from wishlist
  removeFromWishlist: publicProcedure
    .input(
      z.object({
        productId: z.number().min(1),
        visitorId: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await removeFromWishlist(
        input.productId,
        input.visitorId,
        input.userId
      );
      return { success };
    }),

  // Get wishlist items
  getWishlistItems: publicProcedure
    .input(
      z.object({
        visitorId: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const items = await getWishlistItems(input.visitorId, input.userId);
      const productIds = items.map((item: any) => item.productId);
      if (productIds.length === 0) return [];

      const products = await Promise.all(
        productIds.map((id: number) => getProductById(id))
      );

      return items.map((item: any, index: number) => ({
        ...item,
        product: products[index],
      }));
    }),

  // Check if product is in wishlist
  isInWishlist: publicProcedure
    .input(
      z.object({
        productId: z.number().min(1),
        visitorId: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const inWishlist = await isInWishlist(
        input.productId,
        input.visitorId,
        input.userId
      );
      return { inWishlist };
    }),
});
