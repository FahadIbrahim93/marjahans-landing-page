import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./_core/env', () => ({
  ENV: {
    facebookPageAccessToken: 'test-token',
  },
}));

import { fetchFacebookProducts } from './_core/facebook';

describe('Facebook Product Sync', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches products from catalog and returns normalized array', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{ id: 'catalog_1' }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: 'prod_1',
              name: 'Gold Ring',
              description: 'Handcrafted ring',
              price: 12000,
              currency: 'BDT',
              image_url: 'https://example.com/ring.jpg',
              category: 'rings',
              availability: 'in stock',
            },
          ],
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const products = await fetchFacebookProducts();

    expect(Array.isArray(products)).toBe(true);
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: 'prod_1',
      name: 'Gold Ring',
      price: 12000,
      image_url: 'https://example.com/ring.jpg',
    });
  });

  it('returns an empty array when no catalogs exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      })
    );

    const products = await fetchFacebookProducts();
    expect(products).toEqual([]);
  });
});
