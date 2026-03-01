import { eq, and, like, inArray, desc, asc } from "drizzle-orm";
import { getDb } from "./db";
import { categories, products, productImages, productVariants, productReviews, orders, wishlistItems } from "../drizzle/schema";

/**
 * Product Database Helpers
 * All database queries for product catalog operations
 */

// ============ CATEGORIES ============

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.displayOrder));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============ PRODUCTS ============

export async function getProducts(filters?: {
  categoryId?: number;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(products).where(eq(products.isActive, true));

  if (filters?.categoryId) {
    query = query.where(eq(products.categoryId, filters.categoryId));
  }

  if (filters?.search) {
    query = query.where(
      like(products.name, `%${filters.search}%`)
    );
  }

  if (filters?.featured) {
    query = query.where(eq(products.isFeatured, true));
  }

  query = query.orderBy(desc(products.createdAt));

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.offset(filters.offset);
  }

  return await query;
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getProductsByIds(ids: number[]) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(products)
    .where(inArray(products.id, ids));
}

// ============ PRODUCT IMAGES ============

export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.displayOrder));
}

// ============ PRODUCT VARIANTS ============

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(productVariants)
    .where(and(
      eq(productVariants.productId, productId),
      eq(productVariants.isActive, true)
    ));
}

export async function getProductVariantById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============ PRODUCT REVIEWS ============

export async function getProductReviews(productId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(productReviews)
    .where(and(
      eq(productReviews.productId, productId),
      eq(productReviews.isApproved, true)
    ))
    .orderBy(desc(productReviews.createdAt))
    .limit(limit);
}

export async function getProductRating(productId: number) {
  const db = await getDb();
  if (!db) return { rating: 0, count: 0 };

  const product = await getProductById(productId);
  if (!product) return { rating: 0, count: 0 };

  return {
    rating: product.rating,
    count: product.reviewCount,
  };
}

// ============ ORDERS ============

export async function createOrder(orderData: {
  orderNumber: string;
  userId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  billingAddress?: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  items: any;
  paymentMethod?: string;
  stripePaymentIntentId?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(orders).values(orderData);
    return orderData.orderNumber;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    return null;
  }
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getOrdersByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orders)
    .where(eq(orders.customerEmail, email))
    .orderBy(desc(orders.createdAt));
}

// ============ WISHLIST ============

export async function addToWishlist(productId: number, visitorId?: string, userId?: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(wishlistItems).values({
      productId,
      visitorId,
      userId,
    });
    return true;
  } catch (error) {
    console.error("[Database] Failed to add to wishlist:", error);
    return false;
  }
}

export async function removeFromWishlist(productId: number, visitorId?: string, userId?: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(wishlistItems).where(
      and(
        eq(wishlistItems.productId, productId),
        visitorId ? eq(wishlistItems.visitorId, visitorId) : undefined,
        userId ? eq(wishlistItems.userId, userId) : undefined
      )
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to remove from wishlist:", error);
    return false;
  }
}

export async function getWishlistItems(visitorId?: string, userId?: number) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(wishlistItems);

  if (visitorId) {
    query = query.where(eq(wishlistItems.visitorId, visitorId));
  } else if (userId) {
    query = query.where(eq(wishlistItems.userId, userId));
  }

  return await query;
}

export async function isInWishlist(productId: number, visitorId?: string, userId?: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(wishlistItems)
    .where(
      and(
        eq(wishlistItems.productId, productId),
        visitorId ? eq(wishlistItems.visitorId, visitorId) : undefined,
        userId ? eq(wishlistItems.userId, userId) : undefined
      )
    )
    .limit(1);

  return result.length > 0;
}
