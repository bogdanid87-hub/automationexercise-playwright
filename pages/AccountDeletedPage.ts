import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  readonly accountDeletedHeader: Locator;
  readonly continueButton: Locator;
  readonly permanentDeletionMessage: Locator;
  readonly additionalInfoMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.accountDeletedHeader = page.locator('h2[data-qa="account-deleted"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.permanentDeletionMessage = page.locator('p:has-text("Your account has been permanently deleted")');
    this.additionalInfoMessage = page.locator('p:has-text("You can create new account to take advantage of member privileges to enhance your online shopping experience with us.")');
}

    async expectAccountDeleted() {
        await expect(this.accountDeletedHeader).toBeVisible();
        await expect(this.accountDeletedHeader).toHaveText('Account Deleted!');
        await expect(this.permanentDeletionMessage).toBeVisible();
        await expect(this.additionalInfoMessage).toBeVisible();
    }

    async continueToHome() {
        await this.continueButton.click();
        await expect(this.page).toHaveURL('/');
    }
}