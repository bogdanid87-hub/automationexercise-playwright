import {test, expect} from '@playwright/test';
import { BasePage } from '../../pages/BasePage';
import { USERS } from '../../data/testData';
import { CONTACT_US } from '../../data/testData';

test.describe('Subscription', () => {
  test('should subscribe to newsletter successfully', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigate();
    await basePage.dismissOverlays();

    

    await basePage.subscribeToNewsletter(USERS.existing.email);
    await expect(basePage.subscriptionSuccessMessage).toBeVisible();
  });

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