import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SidebarComponent } from './components/SidebarComponent';

export class HomePage extends BasePage {
  readonly sidebar: SidebarComponent;
  readonly featuresItems: Locator;
  readonly productCards: Locator;
  readonly productOverlays: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarComponent(page)
    this.featuresItems = page.locator('h2:has-text("Features Items")');
    this.productCards = page.locator('.productinfo');
    this.productOverlays = page.locator('.product-overlay');
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
  //loads the Home page and verifies it loaded correctly
  async goto() {
    await this.navigate('/');
    await this.dismissOverlays();
    await expect(this.homeCarousel).toBeVisible();
    await expect(this.page).toHaveURL('/');
  }

}

