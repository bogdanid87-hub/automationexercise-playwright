import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  //category
  readonly categoryWomen: Locator;
  readonly categoryMen: Locator;
  readonly categoryKids: Locator;
  //brands
  readonly brandPolo: Locator;
  readonly brandHM: Locator;


  

  constructor(private readonly page: Page) {
    this.categoryWomen = page.locator('.left-sidebar a:has-text("Women")');
    this.categoryMen = page.locator('.left-sidebar a:has-text("Men")');
    this.categoryKids = page.locator('.left-sidebar a:has-text("Kids")');
    this.brandPolo = page.locator('.brands-name a:has-text("Polo")');
    this.brandHM = page.locator('.brands-name a:has-text("H&M")');
  }

  async clickCategory(name: string) {
    await this.page.locator(`.left-sidebar a:has-text("${name}")`).click();
  }

  async clickBrand(name: string) {
    await this.page.locator(`.brands-name a:has-text("${name}")`).click();
  }
}