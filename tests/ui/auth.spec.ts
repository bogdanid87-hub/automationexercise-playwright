// tests/ui/auth.spec.ts
// UI tests covering login, signup, and logout flows

import { test, expect } from '../../fixtures';
import { USERS } from '../../data/testData';


test.describe('Authentication', () => {
  //TC1
  test.describe('Registration', () => {
    test('should register a new user, delete it and land on home page', async ({
      loginPage,
      signupPage,
      accountDeletedPage,
      
    }) => {
      
      const user = USERS.newUser();
      await loginPage.loginViaHome();
      await loginPage.startSignup(user.name, user.email);

      // Fill out the account detail form (next page)
      await signupPage.fillAccountDetails(user);
      await signupPage.acceptNewsletter();
      await signupPage.acceptSpecialOffers();
      await signupPage.submitAndConfirm();

      // After continuing, should be logged in
      await expect(signupPage.loggedInAsText).toBeVisible();

      // Cleanup — delete the created account
      await signupPage.navDeleteAccount.click();
      await accountDeletedPage.expectAccountDeleted();
      await accountDeletedPage.continueToHome();
    });

//TC2 uses pre-existing user from test data, to avoid race conditions between create and login in parallel test runs
  test.describe('Login', () => {
    test('should log in with valid credentials', async ({ loginPage }) => {
      await loginPage.loginViaHome();
      await loginPage.login(USERS.existing.email, USERS.existing.password);

      await expect(loginPage.loggedInAsText).toBeVisible();
      //Skipping account deletion as this is a pre-existing user and deleting it would cause other tests to fail
    });
//TC3
    test('should show error for invalid credentials', async ({ loginPage }) => {
      await loginPage.loginViaHome();
      await loginPage.login('wrong@email.com', 'wrongpassword');

      await loginPage.expectLoginError();
    });
//TC4
    test('should log out successfully', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.loggedInAsText).toBeVisible();

      await authenticatedPage.logout();

      await expect(authenticatedPage.navSignupLogin).toBeVisible();
      await authenticatedPage.expectOnLoginPage(); // Should be back on home page after logout
    });
  });

//TC5
    test('should show error when registering with an existing email', async ({
      loginPage,
    }) => {
      await loginPage.loginViaHome();
      await loginPage.startSignup('Any Name', USERS.existing.email);

      await loginPage.expectSignupEmailExistsError();
    });
  });
});