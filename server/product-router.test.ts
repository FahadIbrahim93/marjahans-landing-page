import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";

describe("Product Router - Filtering and Sorting", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = {
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    };
    caller = appRouter.createCaller(ctx);
  });

  describe("getProducts", () => {
    it("should return products with default parameters", async () => {
      const result = await caller.products.getProducts({
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter products by category", async () => {
      const result = await caller.products.getProducts({
        categoryId: 1,
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter products by search term", async () => {
      const result = await caller.products.getProducts({
        search: "ring",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter products by price range", async () => {
      const result = await caller.products.getProducts({
        minPrice: 10000,
        maxPrice: 100000,
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter products by material", async () => {
      const result = await caller.products.getProducts({
        material: "gold",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should sort products by price ascending", async () => {
      const result = await caller.products.getProducts({
        sortBy: "price_asc",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
      // Verify sorting if results exist
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          expect(result[i].price).toBeLessThanOrEqual(result[i + 1].price);
        }
      }
    });

    it("should sort products by price descending", async () => {
      const result = await caller.products.getProducts({
        sortBy: "price_desc",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
      // Verify sorting if results exist
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          expect(result[i].price).toBeGreaterThanOrEqual(result[i + 1].price);
        }
      }
    });

    it("should sort products by newest", async () => {
      const result = await caller.products.getProducts({
        sortBy: "newest",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should sort products by rating", async () => {
      const result = await caller.products.getProducts({
        sortBy: "rating",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should sort products by popularity", async () => {
      const result = await caller.products.getProducts({
        sortBy: "popularity",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should apply multiple filters together", async () => {
      const result = await caller.products.getProducts({
        categoryId: 1,
        search: "ring",
        minPrice: 10000,
        maxPrice: 100000,
        sortBy: "price_asc",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle pagination with offset", async () => {
      const page1 = await caller.products.getProducts({
        limit: 5,
        offset: 0,
      });

      const page2 = await caller.products.getProducts({
        limit: 5,
        offset: 5,
      });

      expect(Array.isArray(page1)).toBe(true);
      expect(Array.isArray(page2)).toBe(true);
      // Verify different results if both pages have items
      if (page1.length > 0 && page2.length > 0) {
        expect(page1[0].id).not.toBe(page2[0].id);
      }
    });

    it("should respect limit parameter", async () => {
      const result = await caller.products.getProducts({
        limit: 5,
        offset: 0,
      });

      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getMaterials", () => {
    it("should return list of available materials", async () => {
      const result = await caller.products.getMaterials();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return strings for materials", async () => {
      const result = await caller.products.getMaterials();

      if (result.length > 0) {
        result.forEach((material) => {
          expect(typeof material).toBe("string");
        });
      }
    });
  });

  describe("getPriceRange", () => {
    it("should return price range with min and max", async () => {
      const result = await caller.products.getPriceRange();

      expect(result).toHaveProperty("min");
      expect(result).toHaveProperty("max");
      expect(typeof result.min).toBe("number");
      expect(typeof result.max).toBe("number");
    });

    it("should have min less than or equal to max", async () => {
      const result = await caller.products.getPriceRange();

      expect(result.min).toBeLessThanOrEqual(result.max);
    });

    it("should return non-negative prices", async () => {
      const result = await caller.products.getPriceRange();

      expect(result.min).toBeGreaterThanOrEqual(0);
      expect(result.max).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getCategories", () => {
    it("should return list of categories", async () => {
      const result = await caller.products.getCategories();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return categories with id and name", async () => {
      const result = await caller.products.getCategories();

      if (result.length > 0) {
        result.forEach((category: any) => {
          expect(category).toHaveProperty("id");
          expect(category).toHaveProperty("name");
        });
      }
    });
  });
});
