import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


export class CheckoutPage extends BasePage {
    readonly deliveryAddressSection: Locator;
    readonly billingAddressSection: Locator;
    readonly placeOrderButton: Locator;
    readonly cartInfoSection: Locator;
    readonly orderMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.deliveryAddressSection = page.locator('#address_delivery');
        this.billingAddressSection = page.locator('#address_invoice');
        this.placeOrderButton = page.locator('a:has-text("Place Order")');
        this.cartInfoSection = page.locator('#cart_info');
        this.orderMessage = page.locator('.form-control');
    }

    async goto() {
        await this.navigate('/checkout');
        await this.dismissOverlays();
        await expect(this.deliveryAddressSection).toBeVisible();
    }

    async enterOrderMessage(message: string) {
        await this.orderMessage.fill(message);
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }
    
    async expectPaymentPage() {
        await expect(this.page).toHaveURL('/payment');
    }
}