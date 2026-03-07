import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { extractAllProductsFromFacebook } from "./_core/facebook-data-extractor";
import { getDb } from "./db";
import { products, categories, productImages } from "../drizzle/schema";
import { storagePut } from "./storage";

/**
 * Facebook Product Extraction Router
 * Extracts products from Facebook posts and populates the database
 */

export const facebookExtractionRouter = router({
  /**
   * Extract products from Facebook posts and messenger
   * Populate the database with extracted products
   */
  extractAndPopulate: publicProcedure.mutation(async () => {
    try {
      console.log("[Extraction] Starting Facebook product extraction...");

      // Extract products from Facebook
      const extractedProducts = await extractAllProductsFromFacebook();

      if (extractedProducts.length === 0) {
        console.warn("[Extraction] No products extracted from Facebook");
        return {
          success: true,
          message: "No products found to extract",
          extracted: 0,
          synced: 0,
        };
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      let syncedCount = 0;
      const syncedProducts = [];

      for (const fbProduct of extractedProducts) {
        try {
          // Get or create category
          const categoryName = fbProduct.category || "Uncategorized";
          const categorySlug = categoryName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .substring(0, 100);

          let existingCategory = await db
            .select()
            .from(categories)
            .where(eq(categories.name, categoryName))
            .limit(1);

          let categoryId: number;
          if (existingCategory.length > 0) {
            categoryId = existingCategory[0].id;
          } else {
            const newCategory = await db
              .insert(categories)
              .values({
                name: categoryName,
                slug: categorySlug,
                description: `${categoryName} jewelry collection`,
              })
              .$returningId();
            categoryId = newCategory[0].id;
          }

          // Create product
          const productSlug = fbProduct.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .substring(0, 255);

          const productData = {
            name: fbProduct.name,
            slug: productSlug,
            description: fbProduct.description,
            price: Math.round(fbProduct.price * 100), // Convert to cents
            categoryId,
            material: fbProduct.material || null,
            stock: 10, // Default stock
            sku: `FB-${fbProduct.source_post_id.substring(0, 20)}`,
            isActive: true,
            isFeatured: fbProduct.engagement_count > 5,
            tags: JSON.stringify(["facebook", fbProduct.category]),
          };

          const newProduct = await db
            .insert(products)
            .values([productData])
            .$returningId();

          const productId = newProduct[0].id;

          // Download and store product images
          for (const imageUrl of fbProduct.images || []) {
            try {
              // Fetch image from Facebook
              const imageResponse = await fetch(imageUrl);
              if (!imageResponse.ok) continue;

              const imageBuffer = await imageResponse.arrayBuffer();
              const fileName = `product-${productId}-${Date.now()}.jpg`;

              // Upload to S3
              const { url: storedUrl } = await storagePut(
                `products/${fileName}`,
                Buffer.from(imageBuffer),
                "image/jpeg"
              );

              // Store image reference in database
              await db.insert(productImages).values({
                productId,
                imageUrl: storedUrl,
                altText: fbProduct.name,
                displayOrder: 0,
              });

              console.log(`[Extraction] Stored image for product ${productId}`);
            } catch (error) {
              console.error(`[Extraction] Error storing image for product ${productId}:`, error);
            }
          }

          syncedCount++;
          syncedProducts.push({
            id: productId,
            name: fbProduct.name,
            price: fbProduct.price,
            images: fbProduct.images?.length || 0,
          });

          console.log(`[Extraction] Synced product: ${fbProduct.name}`);
        } catch (error) {
          console.error(`[Extraction] Error syncing product ${fbProduct.name}:`, error);
        }
      }

      console.log(`[Extraction] Successfully synced ${syncedCount} products`);

      return {
        success: true,
        message: `Extracted and synced ${syncedCount} products from Facebook`,
        extracted: extractedProducts.length,
        synced: syncedCount,
        products: syncedProducts,
      };
    } catch (error) {
      console.error("[Extraction] Error:", error);
      throw error;
    }
  }),

  /**
   * Get extraction status and statistics
   */
  getStatus: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const productCount = await db.select().from(products);
      const categoryCount = await db.select().from(categories);

      return {
        totalProducts: productCount.length,
        totalCategories: categoryCount.length,
        lastSync: new Date(),
      };
    } catch (error) {
      console.error("[Extraction] Error getting status:", error);
      throw error;
    }
  }),
});
