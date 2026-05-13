import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  readonly categoryMenuTitle: Locator;
  readonly brandMenuTitle: Locator;

  constructor(private readonly page: Page) {
    this.categoryMenuTitle = page.locator('.left-sidebar h2:has-text("Category")');
    this.brandMenuTitle = page.locator('.brands_products h2:has-text("Brands")');
  }

  async clickCategory(name: string) {
    await this.page.locator(`a[href="#${name}"]`).click();
    // wait for subcategory panel to expand
    await this.page.locator(`.panel-collapse.in`).waitFor({ state: 'visible' });
  }
  async clickSubcategory(name: string) {
    await this.page.locator(`.panel-collapse.in a:has-text("${name}")`).click();
  }

  async clickBrand(name: string) {
    await this.page.locator(`.brands-name a:has-text("${name}")`).click();
  }
}