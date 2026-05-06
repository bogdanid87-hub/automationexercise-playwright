// pages/ProductsPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly searchedProductsHeader: Locator;
  readonly firstProductViewButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.productinfo');
    this.searchedProductsHeader = page.locator('h2:has-text("Searched Products")');
    this.firstProductViewButton = page.locator('a:has-text("View Product")').first();
  }

  async goto() {
    await this.navigate('/products');
    await this.dismissOverlays();
    await expect(this.searchInput).toBeVisible();
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await expect(this.searchedProductsHeader).toBeVisible();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

async addFirstProductToCart() {
  // scroll past the heading first
  await this.searchedProductsHeader.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(500);
  
  // now hover and click
  await this.productCards.first().hover();
  const addToCartBtn = this.page
    .locator('.overlay-content a:has-text("Add to cart")')
    .first();
  await addToCartBtn.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(500);
  await addToCartBtn.click();
}

  async viewFirstProduct() {
    await this.firstProductViewButton.click();
  }

async dismissAddedToCartModal() {
  const continueBtn = this.page.locator('button:has-text("Continue Shopping")');
  await continueBtn.click();
}
}