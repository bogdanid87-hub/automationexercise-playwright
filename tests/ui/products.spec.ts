// tests/ui/products.spec.ts
// UI tests covering product listing, search, and cart interactions

import { test, expect } from '../../fixtures';
import { PRODUCTS } from '../../data/testData';

test.describe('Products', () => {

  test('should display all products on the products page', async ({ productsPage }) => {
    await productsPage.goto();

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should return results for a valid search term', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.searchFor(PRODUCTS.searchTerms.valid);

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should show product detail page when clicking View Product', async ({
    productsPage,
    page,
  }) => {
    await productsPage.goto();
    await productsPage.viewFirstProduct();

    // Product detail page has a quantity input and Add to Cart button
    await expect(page.locator('#quantity')).toBeVisible();
    await expect(page.locator('button:has-text("Add to cart")')).toBeVisible();
  });

  test('should add a product to cart', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();

    // Dismiss the success modal
    
    await productsPage.dismissAddedToCartModal();

    await cartPage.goto();
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });
});
