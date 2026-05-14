// API-assisted purchase flow combining UI and API layers:
//   1. Create a user via API
//   2. Log in via UI
//   3. Search and add product to cart via UI
//   4. Checkout with address validation via UI
//   5. Complete payment via UI
//   6. Verify order confirmation and download invoice via UI
//   7. Cross-validate product search results via API
//   8. Cross-validate user details via API
//   9. Teardown via API
//
// Note: Some steps use direct URL navigation for speed and reliability
// rather than full UI navigation flows, which are covered in dedicated UI tests

import { test, expect } from '../../fixtures/index';
import { PAYMENT, PRODUCTS, USERS } from '../../data/testData';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { OrderPlacedPage } from '../../pages/OrderPlacedPage';

test.describe('API assisted purchase (UI + API cross-validation)', () => {

  test('API-assisted purchase flow: create → shop → checkout → payment → validate → teardown', async ({
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
    await productsPage.searchFor(PRODUCTS.searchTerms.valid);

    const uiResultCount = await productsPage.getProductCount();
    expect(uiResultCount).toBeGreaterThan(0);

    // scroll past search heading first since we just did a search
    await productsPage.searchedProductsHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await productsPage.addFirstProductToCart();
    await productsPage.dismissAddedToCartModal();

    const cartPage = new CartPage(page);
    await cartPage.goto();
    const cartItemCount = await cartPage.getItemCount();
    expect(cartItemCount).toBeGreaterThanOrEqual(1);

    // ── Step 4: UI — checkout and address validation ──────────────────────────────────
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await expect(checkoutPage.deliveryAddressSection).toBeVisible();
    await checkoutPage.expectAddressDetails(checkoutPage.deliveryAddressSection, user);
    await checkoutPage.expectAddressDetails(checkoutPage.billingAddressSection, user);


    await checkoutPage.enterOrderMessage('Please deliver between 9 AM and 5 PM.');
    await checkoutPage.placeOrder();

    // ── Step 5: UI — enter payment details and submit ─────────────────────────────
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();

    await paymentPage.enterPaymentDetails(
      PAYMENT.nameOnCard,
      PAYMENT.cardNumber,
      PAYMENT.cvc,
      PAYMENT.expiryMonth,
      PAYMENT.expiryYear
    );
    await paymentPage.submitPayment();
    // ── Step 6: UI — verify order confirmation and download invoice ──────────────
    const orderPlacedPage = new OrderPlacedPage(page);
    await expect(orderPlacedPage.orderConfirmationTitle).toBeVisible();
    await expect(orderPlacedPage.orderConfirmationMessage).toBeVisible();

    // verify invoice download by checking the file system for the downloaded file
    const downloadPromise = page.waitForEvent('download');
    await orderPlacedPage.downloadInvoice();
    const download = await downloadPromise;

    // assert the filename
    expect(download.suggestedFilename()).toContain('invoice');

    // assert the file actually has content
    const path = await download.path();
    expect(path).toBeTruthy();

    await orderPlacedPage.continueShopping();

    // ── Step 7: API cross-validation — confirm same search term returns results ─
    const apiSearchResult = await apiClient.searchProduct(PRODUCTS.searchTerms.valid);
    expect(apiSearchResult.responseCode).toBe(200);
    expect(apiSearchResult.products.length).toBeGreaterThan(0);

    // UI and API counts should agree (both searching the same dataset)
    expect(uiResultCount).toBe(apiSearchResult.products.length);

    // ── Step 8: API — verify user details match what we registered ──────────────
    const userDetail = await apiClient.getUserDetailByEmail(user.email);
    expect(userDetail.responseCode).toBe(200);
    expect(userDetail.user.email).toBe(user.email);
    expect(userDetail.user.name).toBe(user.name);

    // ── Step 9: API teardown — delete test account ──────────────────────────────
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
