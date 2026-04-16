import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import {
  categories,
  products,
  productImages,
  productVariants,
} from "./drizzle/schema";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedDataPath = path.join(__dirname, "seed-products.json");
const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

const DATABASE_URL =
  process.env.DATABASE_URL || "mysql://root:@localhost/marjahans";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Create connection
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    // Seed categories
    console.log("📁 Seeding categories...");
    for (const category of seedData.categories) {
      await db
        .insert(categories)
        .values({
          name: category.name,
          slug: category.slug,
          description: category.description,
        })
        .onDuplicateKeyUpdate({
          set: {
            description: category.description,
          },
        });
    }
    console.log(`✅ ${seedData.categories.length} categories seeded`);

    // Seed products
    console.log("🛍️ Seeding products...");
    let productCount = 0;

    for (const product of seedData.products) {
      // Use categoryId directly from seed data
      const categoryId = product.categoryId;

      // Insert product
      const productResult = await db
        .insert(products)
        .values({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          categoryId: categoryId,
          isFeatured: product.featured || false,
          sku: `SKU-${product.slug.toUpperCase().replace(/-/g, "_")}`,
          stock: 100,
        })
        .onDuplicateKeyUpdate({
          set: {
            description: product.description,
            price: product.price,
            isFeatured: product.featured || false,
          },
        });

      // Extract product ID from insert result
      let productId = null;
      if (productResult && productResult[0] && productResult[0].insertId) {
        productId = productResult[0].insertId;
      } else {
        // Fallback: query for the product
        const result = await db
          .select()
          .from(products)
          .where(eq(products.slug, product.slug))
          .limit(1);
        productId = result[0]?.id;
      }

      if (!productId) {
        console.warn(`⚠️ Could not get ID for product: ${product.name}`);
        continue;
      }

      // Insert product images
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          await db
            .insert(productImages)
            .values({
              productId: productId,
              imageUrl: image.url,
              altText: image.alt,
            })
            .onDuplicateKeyUpdate({
              set: {
                altText: image.alt,
              },
            });
        }
      }

      // Insert product variants
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          await db
            .insert(productVariants)
            .values({
              productId: productId,
              name: variant.name,
              material: variant.material || null,
              size: variant.size || null,
              color: variant.color || null,
              sku: variant.sku,
            })
            .onDuplicateKeyUpdate({
              set: {
                name: variant.name,
                material: variant.material || null,
                size: variant.size || null,
                color: variant.color || null,
              },
            });
        }
      }

      productCount++;
    }

    console.log(`✅ ${productCount} products seeded with variants and images`);

    // Get statistics
    const categoryCount = await db.select().from(categories);
    const productCount2 = await db.select().from(products);
    const variantCount = await db.select().from(productVariants);
    const imageCount = await db.select().from(productImages);

    console.log("\n📊 Database Seeding Summary:");
    console.log(`   Categories: ${categoryCount.length}`);
    console.log(`   Products: ${productCount2.length}`);
    console.log(`   Variants: ${variantCount.length}`);
    console.log(`   Images: ${imageCount.length}`);

    console.log("\n✨ Database seeding completed successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
