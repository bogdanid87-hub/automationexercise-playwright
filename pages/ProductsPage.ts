// pages/ProductsPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly productOverlays: Locator;
  readonly searchedProductsHeader: Locator;
  readonly firstProductViewButton: Locator;
  readonly secondProductViewButton: Locator;
  readonly addToCartButton: Locator;
  readonly productsPageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.productinfo');
    this.productOverlays = page.locator('.product-overlay');
    this.searchedProductsHeader = page.locator('h2:has-text("Searched Products")');
    this.firstProductViewButton = page.locator('a:has-text("View Product")').first();
    this.secondProductViewButton = page.locator('a:has-text("View Product")').nth(1);
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.productsPageTitle = page.locator('.title.text-center');
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
  async getFirstProductName(): Promise<string> {
  return await this.productOverlays.first().locator('p').innerText();
}
  async getFirstProductPrice(): Promise<string> {
  return await this.productOverlays.first().locator('h2').innerText();
}

async getSecondProductName(): Promise<string> {
  return await this.productOverlays.nth(1).locator('p').innerText();
}
  async getSecondProductPrice(): Promise<string> {
  return await this.productOverlays.nth(1).locator('h2').innerText();
}

async addFirstProductToCart() {
  const addToCartBtn = this.page
    .locator('.overlay-content a:has-text("Add to cart")')
    .first();
  
  await this.productCards.first().hover();
  await addToCartBtn.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(500);
  await addToCartBtn.click();
}
async addSecondProductToCart() {
  const addToCartBtn = this.page
    .locator('.overlay-content a:has-text("Add to cart")')
    .nth(1);
  
  await this.productCards.nth(1).hover();
  await addToCartBtn.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(500);
  await addToCartBtn.click();
}

async viewFirstProduct() {
  await this.firstProductViewButton.click();
  await this.waitForPageLoad();
  await this.dismissOverlays();
}

async expectAddToCartVisible() {
  await expect(this.addToCartButton).toBeVisible(); 
}

async getProductNames(): Promise<string[]> {
  const names = await this.productCards.locator('p').allInnerTexts();
  return names;
}
}