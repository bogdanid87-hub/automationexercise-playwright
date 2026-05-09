import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OrderPlacedPage extends BasePage {
    readonly orderConfirmationTitle: Locator;  
    readonly orderConfirmationMessage: Locator;
    readonly continueButton: Locator;
    readonly downloadInvoiceButton: Locator;

    constructor(page: Page) {
        super(page);
        this.orderConfirmationTitle = page.locator('[data-qa="order-placed"]');
        this.orderConfirmationMessage = page.locator('p:has-text("Congratulations! Your order has been confirmed!")');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.downloadInvoiceButton = page.locator('a:has-text("Download Invoice")');
    }

    async orderConfirmation() {
        await expect(this.orderConfirmationTitle).toBeVisible();
        await expect(this.orderConfirmationMessage).toBeVisible();
        await expect(this.page).toHaveURL(/\/payment_done\//);
    }

    async continueShopping() {
        await this.continueButton.click();
        await expect(this.page).toHaveURL('/');
    }

    async downloadInvoice() {
        await this.downloadInvoiceButton.click();
    }
}