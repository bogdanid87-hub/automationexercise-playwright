import {Page, Locator, expect} from '@playwright/test';
import {BasePage} from './BasePage';

export class PaymentPage extends BasePage {
    readonly paymentDetailsSection: Locator;
    readonly payButton: Locator;

constructor(page: Page) {
    super(page);
    this.paymentDetailsSection = page.locator('.payment-information');
    this.payButton = page.locator('[data-qa="pay-button"]');
}

async goto() {
    await this.navigate('/payment');
    await this.dismissOverlays();
    await expect(this.page).toHaveURL('/payment');
    await expect(this.paymentDetailsSection).toBeVisible();
    await expect(this.payButton).toBeVisible();
}
}