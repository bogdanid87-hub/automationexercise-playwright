import { Page, Locator, expect } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';

export class HomePage extends ProductListingPage {
  readonly pageTitle: Locator;
  readonly homeCarousel: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h2:has-text("Features Items")');
    this.homeCarousel = page.locator('#slider-carousel');
  }
  //loads the Home page and verifies it loaded correctly
  async goto() {
    await this.navigate('/');
    await this.dismissOverlays();
    await expect(this.homeCarousel).toBeVisible();
    await expect(this.page).toHaveURL('/');
  }
}

