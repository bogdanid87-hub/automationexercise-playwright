import { Page, Locator, expect } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';

export class HomePage extends ProductListingPage {

  readonly homeCarousel: Locator;
  readonly recommendedCarousel: Locator;
  readonly recommendedTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.homeCarousel = page.locator('#slider-carousel');
    this.recommendedTitle = page.getByRole('heading', { name: 'recommended items' });
    this.recommendedCarousel = page.locator('#recommended-item-carousel');
  }
  //loads the Home page and verifies it loaded correctly
  async goto() {
    await this.navigate('/');
    await this.dismissOverlays();
    await expect(this.homeCarousel).toBeVisible();
    await expect(this.page).toHaveURL('/');
  }
  async addRecommendedProductToCart() {
    const activeItem = this.page.locator('.recommended_items .item.active .add-to-cart').first();
    await activeItem.click();
  }
  async getRecommendedProductName(): Promise<string> {
    return await this.page.locator('.recommended_items .item.active p').first().innerText();
  }

}

