import { test, expect } from '../../fixtures/index';
import { BasePage } from '../../pages/BasePage';
import { USERS } from '../../data/testData';


//TC 10
test.describe('Subscription from Home page', () => {
  test('should subscribe to newsletter successfully', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigate();
    await basePage.dismissOverlays();

    await expect(basePage.subscriptionWidget).toBeVisible();
    await basePage.subscribeToNewsletter(USERS.existing.email);
    await expect(basePage.subscriptionSuccessMessage).toBeVisible();
  });
});
//TC 11
test.describe('Subscription from Cart page', () => {
  test('should subscribe to newsletter successfully', async ({ page, cartPage }) => {
    const basePage = new BasePage(page);
    await basePage.navigate();
    await basePage.dismissOverlays();
    await basePage.navCart.click();
    await basePage.waitForPageLoad();

    await expect(cartPage.subscriptionWidget).toBeVisible();
    await cartPage.subscribeToNewsletter(USERS.existing.email);
    await expect(cartPage.subscriptionSuccessMessage).toBeVisible();
  });


  // extra negative test
  test('should show error for missing email', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigate();
    await basePage.dismissOverlays();

    await basePage.subscribeToNewsletter('');
    await basePage.expectSubscriptionMissingEmailError();
  });

  test('should show error for invalid email', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigate();
    await basePage.dismissOverlays();

    await basePage.subscribeToNewsletter('invalid-email');
    await basePage.expectSubscriptionInvalidEmailError();
  });
});