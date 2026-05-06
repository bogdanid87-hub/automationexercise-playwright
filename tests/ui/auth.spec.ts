// tests/ui/auth.spec.ts
// UI tests covering login, signup, and logout flows

import { test, expect } from '../../fixtures';
import { USERS } from '../../data/testData';

test.describe('Authentication', () => {

  test.describe('Login', () => {
    test('should log in with valid credentials', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(USERS.existing.email, USERS.existing.password);

      await expect(loginPage.loggedInAsText).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login('wrong@email.com', 'wrongpassword');

      await loginPage.expectLoginError();
    });

    test('should log out successfully', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.loggedInAsText).toBeVisible();

      await authenticatedPage.logout();

      await expect(authenticatedPage.navSignupLogin).toBeVisible();
    });
  });

  test.describe('Registration', () => {
    test('should register a new user and land on home page', async ({
      loginPage,
      signupPage,
    }) => {
      const user = USERS.newUser();

      await loginPage.goto();
      await loginPage.startSignup(user.name, user.email);

      // Fill out the account detail form (next page)
      await signupPage.fillAccountDetails(user);
      await signupPage.submitAndConfirm();

      // After continuing, should be logged in
      await expect(signupPage.loggedInAsText).toBeVisible();

      // Cleanup — delete the created account
      await signupPage.navDeleteAccount.click();
    });

    test('should show error when registering with an existing email', async ({
      loginPage,
    }) => {
      await loginPage.goto();
      await loginPage.startSignup('Any Name', USERS.existing.email);

      await loginPage.expectSignupEmailExistsError();
    });
  });
});