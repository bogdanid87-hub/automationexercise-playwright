// pages/ProductsPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';

export class ProductsPage extends ProductListingPage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeader: Locator;
  readonly advertisement: Locator;


  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeader = page.locator('h2:has-text("Searched Products")');
    this.advertisement = page.locator('#advertisement');
  }

  async goto() {
    await this.navigate('/products');
    await this.dismissOverlays();
    await expect(this.searchInput).toBeVisible();
  }

  async searchFor(term: string) {
    await this.waitForPageLoad();
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await expect(this.searchedProductsHeader).toBeVisible();
  }
}