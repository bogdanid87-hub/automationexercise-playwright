// tests/api/products.api.spec.ts
// Pure API tests — no browser, just Playwright's request context

import { test, expect } from '../../fixtures/index';
import { PRODUCTS } from '../../data/testData';

test.describe('API — Products', () => {

  test('GET /api/productsList should return 200 and a non-empty products array', async ({
    apiClient,
  }) => {
    const products = await apiClient.getAllProducts();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('each product should have required fields', async ({ apiClient }) => {
    const products = await apiClient.getAllProducts();

    for (const product of products) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('category');
    }
  });

  test('GET /api/brandsList should return 200 and a non-empty brands array', async ({
    apiClient,
  }) => {
    const brands = await apiClient.getAllBrands();

    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
  });

  test('POST /api/searchProduct should return matching products', async ({
    apiClient,
  }) => {
    const result = await apiClient.searchProduct(PRODUCTS.searchTerms.valid);

    expect(result.responseCode).toBe(200);
    expect(Array.isArray(result.products)).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);
  });

  test('POST /api/searchProduct with no search term should return 400', async ({
    request,
  }) => {
    const response = await request.post('/api/searchProduct', { form: {} });
    const body = await response.json();

    expect(body.responseCode).toBe(400);
  });

  test('PUT /api/brandsList should return 405 (method not allowed)', async ({
    request,
  }) => {
    const response = await request.put('/api/brandsList');
    const body = await response.json();

    expect(body.responseCode).toBe(405);
  });
});
