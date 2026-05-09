// tests/e2e/user-journey.spec.ts
//
// ★ Portfolio showpiece ★
//
// Full end-to-end journey that crosses UI and API layers in a single test:
//   1. Create a user via API (fast, no UI overhead)
//   2. Log in via the UI
//   3. Search and add a product to cart via the UI
//   4. Verify the product exists in the API's product list
//   5. Confirm the logged-in state matches the API user record
//   6. Cleanup via API
//
// This pattern (API setup → UI journey → API assertion → API teardown) is
// exactly what senior QA engineers do in production fintech test suites.

import { test, expect } from '../../fixtures';
import { USERS } from '../../data/testData';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';

test.describe('E2E — Full User Journey (UI + API cross-validation)', () => {

  test('create user via API → browse & shop via UI → validate via API → teardown', async ({
    page,
    apiClient,
  }) => {
    const user = USERS.newUser();

    // ── Step 1: API setup — create account ─────────────────────────────────────
    const created = await apiClient.createAccount({
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.birth_date,
      birth_month: user.birth_month,
      birth_year: user.birth_year,
      firstname: user.firstname,
      lastname: user.lastname,
      company: user.company,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobile_number,
    });
    expect(created.responseCode).toBe(201);

    // ── Step 2: UI — log in ─────────────────────────────────────────────────────
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await expect(loginPage.loggedInAsText).toBeVisible();
    await expect(loginPage.loggedInAsText).toContainText(user.firstname);

    // ── Step 3: UI — search and add product to cart ─────────────────────────────
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.searchFor('top');

    const uiResultCount = await productsPage.getProductCount();
    expect(uiResultCount).toBeGreaterThan(0);

    // scroll past search heading first since we just did a search
    await productsPage.searchedProductsHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await productsPage.addFirstProductToCart();
    const continueBtn = page.locator('button:has-text("Continue Shopping")');
    await continueBtn.click();

    const cartPage = new CartPage(page);
    await cartPage.goto();
    const cartItemCount = await cartPage.getItemCount();
    expect(cartItemCount).toBeGreaterThanOrEqual(1);

    // ── Step 4: UI checkout and address validation ─────────────────────────────────────
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await expect(checkoutPage.deliveryAddressSection).toBeVisible();
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.firstname);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.lastname);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.address1);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.address2);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.city);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.zipcode);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.state);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.country);
    await expect(checkoutPage.deliveryAddressSection).toContainText(user.mobile_number);
    await expect(checkoutPage.billingAddressSection).toBeVisible();
    await expect(checkoutPage.billingAddressSection).toContainText(user.firstname);
    await expect(checkoutPage.billingAddressSection).toContainText(user.lastname);
    await expect(checkoutPage.billingAddressSection).toContainText(user.address1);
    await expect(checkoutPage.billingAddressSection).toContainText(user.address2);
    await expect(checkoutPage.billingAddressSection).toContainText(user.city);
    await expect(checkoutPage.billingAddressSection).toContainText(user.zipcode);
    await expect(checkoutPage.billingAddressSection).toContainText(user.state);
    await expect(checkoutPage.billingAddressSection).toContainText(user.country);
    await expect(checkoutPage.billingAddressSection).toContainText(user.mobile_number);
    

    await checkoutPage.enterOrderMessage('Please deliver between 9 AM and 5 PM.');
    await checkoutPage.placeOrder();

    await checkoutPage.expectPaymentPage();
   

    // ── Step 5: API cross-validation — confirm same search term returns results ─
    const apiSearchResult = await apiClient.searchProduct('top');
    expect(apiSearchResult.responseCode).toBe(200);
    expect(apiSearchResult.products.length).toBeGreaterThan(0);

    // UI and API counts should agree (both searching the same dataset)
    expect(uiResultCount).toBe(apiSearchResult.products.length);

    // ── Step 6: API — verify user details match what we registered ──────────────
    const userDetail = await apiClient.getUserDetailByEmail(user.email);
    expect(userDetail.responseCode).toBe(200);
    expect(userDetail.user.email).toBe(user.email);
    expect(userDetail.user.name).toBe(user.name);

    // ── Step 7: API teardown — delete test account ──────────────────────────────
    const deleted = await apiClient.deleteAccount(user.email, user.password);
    expect(deleted.responseCode).toBe(200);
  });

  test('product data consistency — API product count matches UI display', async ({
    page,
    apiClient,
  }) => {
    // Get total product count from API
    const apiProducts = await apiClient.getAllProducts();

    // Navigate UI and count displayed products
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    const uiCount = await productsPage.getProductCount();

    // Both should report the same number of products
    expect(uiCount).toBe(apiProducts.length);
  });
});
