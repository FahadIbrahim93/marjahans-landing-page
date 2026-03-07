import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { fetchFacebookProducts, fetchFacebookShopInfo } from "./_core/facebook";
import { fetchMockFacebookProducts, fetchMockFacebookShopInfo, USE_MOCK_FACEBOOK } from "./_core/facebook-mock";
import { getDb } from "./db";
import { products, categories, productImages } from "../drizzle/schema";

/**
 * Facebook Shop Sync Router
 * Handles syncing products from Facebook Shop to the e-commerce database
 */

export const facebookSyncRouter = router({
  /**
   * Fetch and sync products from Facebook Shop
   */
  syncProducts: publicProcedure.mutation(async () => {
    try {
      // Use mock data if configured, otherwise use real Facebook API
      const facebookProducts = USE_MOCK_FACEBOOK 
        ? await fetchMockFacebookProducts() 
        : await fetchFacebookProducts();
      const shopInfo = USE_MOCK_FACEBOOK
        ? await fetchMockFacebookShopInfo()
        : await fetchFacebookShopInfo();

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      let syncedCount = 0;

      for (const fbProduct of facebookProducts) {
        try {
          // Extract category from Facebook product
          const categoryName = fbProduct.category || "Uncategorized";

          // Get or create category
          const existingCategory = await db
            .select()
            .from(categories)
            .where(eq(categories.name, categoryName))
            .limit(1);

          let categoryId: number;
          if (existingCategory.length > 0) {
            categoryId = existingCategory[0].id;
          } else {
            const categorySlug = categoryName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .substring(0, 100);
            const newCategory = await db
              .insert(categories)
              .values({
                name: categoryName,
                slug: categorySlug,
                description: `${categoryName} from Facebook Shop`,
              });
            categoryId = (newCategory as any).insertId;
          }

          // Create slug and SKU
          const slug = fbProduct.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .substring(0, 255);
          const sku = `FB-${fbProduct.id}`.substring(0, 100);
          const priceInCents = Math.round((fbProduct.price || 0) * 100);

          // Insert product
          const productResult = await db.insert(products).values({
            name: fbProduct.name,
            slug: slug,
            description: fbProduct.description || "",
            price: priceInCents,
            categoryId: categoryId,
            material: "Gold", // Default material
            stock: 100, // Default stock
            sku: sku,
            isActive: fbProduct.availability !== "unavailable",
          });

          const productId = (productResult as any).insertId;

          // Insert product image if available
          if (fbProduct.image_url && productId) {
            await db.insert(productImages).values({
              productId: productId,
              imageUrl: fbProduct.image_url,
              altText: fbProduct.name,
              isMain: true,
            });
          }

          syncedCount++;
        } catch (error) {
          console.error(`[Facebook Sync] Error syncing product ${fbProduct.id}:`, error);
        }
      }

      return {
        success: true,
        syncedCount,
        totalProducts: facebookProducts.length,
        shopName: shopInfo.shop_name,
        message: `Successfully synced ${syncedCount} products from Facebook Shop`,
      };
    } catch (error) {
      console.error("[Facebook Sync] Error syncing products:", error);
      throw new Error(`Failed to sync Facebook products: ${error}`);
    }
  }),

  /**
   * Get Facebook Shop info
   */
  getShopInfo: publicProcedure.query(async () => {
    try {
      const shopInfo = await fetchFacebookShopInfo();
      return {
        success: true,
        data: shopInfo,
      };
    } catch (error) {
      console.error("[Facebook Sync] Error fetching shop info:", error);
      throw new Error(`Failed to fetch shop info: ${error}`);
    }
  }),

  /**
   * Get sync status
   */
  getSyncStatus: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const productCount = await db.select().from(products);

      return {
        success: true,
        totalProducts: productCount.length,
        lastSyncTime: new Date().toISOString(),
        status: "ready",
      };
    } catch (error) {
      console.error("[Facebook Sync] Error getting sync status:", error);
      throw new Error(`Failed to get sync status: ${error}`);
    }
  }),
});
