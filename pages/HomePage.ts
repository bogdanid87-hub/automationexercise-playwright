import { Page, Locator, expect } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';

export class HomePage extends ProductListingPage {

  readonly homeCarousel: Locator;

  constructor(page: Page) {
    super(page);

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

