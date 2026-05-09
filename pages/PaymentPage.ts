import {Page, Locator, expect} from '@playwright/test';
import {BasePage} from './BasePage';

export class PaymentPage extends BasePage {
    readonly paymentDetailsSection: Locator;
    readonly payButton: Locator;
    readonly nameOnCard: Locator;
    readonly cardNumber: Locator;
    readonly cvc: Locator;
    readonly expiryMonth: Locator;
    readonly expiryYear: Locator;

constructor(page: Page) {
    super(page);
    this.paymentDetailsSection = page.locator('.payment-information');
    this.payButton = page.locator('[data-qa="pay-button"]');
    this.nameOnCard = page.locator('[data-qa="name-on-card"]');
    this.cardNumber = page.locator('[data-qa="card-number"]');
    this.cvc = page.locator('[data-qa="cvc"]');
    this.expiryMonth = page.locator('[data-qa="expiry-month"]');
    this.expiryYear = page.locator('[data-qa="expiry-year"]');
}

async goto() {
    await this.navigate('/payment');
    await this.dismissOverlays();
    await expect(this.page).toHaveURL('/payment');
    await expect(this.paymentDetailsSection).toBeVisible();
    await expect(this.payButton).toBeVisible();
}

async enterPaymentDetails(name: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string) {
    await this.nameOnCard.fill(name);
    await this.cardNumber.fill(cardNumber);
    await this.cvc.fill(cvc);
    await this.expiryMonth.fill(expiryMonth);
    await this.expiryYear.fill(expiryYear); 
} 

async submitPayment() {
    await this.payButton.click();
}

}
