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
    //to verify delivery and billing details
    async expectAddressDetails(section: Locator, user: {
        firstname: string;
        lastname: string;
        address1: string;
        address2: string;
        city: string;
        zipcode: string;
        state: string;
        country: string;
        mobile_number: string;
    }) {
        await expect(section).toContainText(user.firstname);
        await expect(section).toContainText(user.lastname);
        await expect(section).toContainText(user.address1);
        await expect(section).toContainText(user.address2);
        await expect(section).toContainText(user.city);
        await expect(section).toContainText(user.zipcode);
        await expect(section).toContainText(user.state);
        await expect(section).toContainText(user.country);
        await expect(section).toContainText(user.mobile_number);
    }
}