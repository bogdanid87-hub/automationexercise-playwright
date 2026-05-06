// pages/CartPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartTable: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.emptyCartMessage = page.locator('p:has-text("Cart is empty")');
    this.cartTable = page.locator('#cart_info_table');
  }

  async goto() {
    await this.navigate('/view_cart');
    await this.dismissOverlays();

  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async removeItem(index: number = 0) {
    const deleteButtons = this.page.locator('.cart_quantity_delete');
    await deleteButtons.nth(index).click();
  }

  async expectCartIsEmpty() {
    await expect(this.emptyCartMessage).toBeVisible();
  }
}
