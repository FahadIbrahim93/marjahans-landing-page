import { describe, it, expect, beforeEach } from 'vitest';
import { fetchFacebookProducts } from './_core/facebook';

describe('Facebook Product Sync', () => {
  it('should fetch products from Facebook Shop', async () => {
    const products = await fetchFacebookProducts();
    
    // Should return an array
    expect(Array.isArray(products)).toBe(true);
    
    // If products exist, verify structure
    if (products.length > 0) {
      const product = products[0];
      
      // Verify product has required fields
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('image_url');
      
      // Verify field types
      expect(typeof product.id).toBe('string');
      expect(typeof product.name).toBe('string');
      expect(typeof product.price).toBe('number');
      
      console.log(`✓ Successfully fetched ${products.length} products from Facebook`);
      console.log(`✓ Sample product: ${product.name} - Price: ${product.price}`);
    }
  });

  it('should have valid product data structure', async () => {
    const products = await fetchFacebookProducts();
    
    if (products.length > 0) {
      products.forEach((product, index) => {
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.price).toBeGreaterThanOrEqual(0);
        expect(typeof product.name).toBe('string');
        expect(product.name.length).toBeGreaterThan(0);
      });
    }
  });
});
