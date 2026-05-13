import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  //category
  readonly categoryTitle: Locator;
  readonly categoryWomen: Locator;
  readonly categoryMen: Locator;
  readonly categoryKids: Locator;
  //brands
  readonly brandsTitle: Locator;
  readonly brandPolo: Locator;
  readonly brandHM: Locator;
  //women sub-category
  readonly womenDress: Locator;
  //men sub-category
  readonly menJeans: Locator;




  constructor(private readonly page: Page) {
    this.categoryTitle = page.locator('.left-sidebar h2:has-text("Category")');
    this.categoryWomen = page.getByRole('link', { name: 'Women' })
    this.categoryMen = page.getByRole('link', { name: 'Men', exact: true })
    this.categoryKids = page.locator('.left-sidebar a:has-text("Kids")');
    this.brandsTitle = page.locator('.left-sidebar a:has-text("Brands")');
    this.brandPolo = page.locator('.brands-name a:has-text("Polo")');
    this.brandHM = page.locator('.brands-name a:has-text("H&M")');
    this.womenDress = page.locator('#Women a:has-text("Dress")');
    this.menJeans = page.locator('#Men a:has-text("Jeans")');
  }

  async clickCategory(name: string) {
    await this.page.locator(`.left-sidebar a:has-text("${name}")`).click();
  }

  async clickBrand(name: string) {
    await this.page.locator(`.brands-name a:has-text("${name}")`).click();
  }
}