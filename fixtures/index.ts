// fixtures/index.ts
// Extends Playwright's base test with pre-wired page objects and API client

import { test as base, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { ApiClient } from '../api/ApiClient';
import { USERS } from '../data/testData';
import { ContactPage } from '../pages/ContactPage';
import { PaymentPage } from '../pages/PaymentPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type Fixtures = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  apiClient: ApiClient;
  authenticatedPage: LoginPage; // loginPage with user already logged in
  contactPage: ContactPage;
  paymentPage: PaymentPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  // Ready-to-use fixture: navigates to login page and logs in with the test user
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.existing.email, USERS.existing.password);
    await use(loginPage);
  },

  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },

  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  }
});

export { expect } from '@playwright/test';
