import { Page, Locator, expect } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';


export class BrandsProductsPage extends ProductListingPage {
    readonly breadcrumbLink: Locator;
    readonly breadcrumb: Locator;

    constructor(page: Page) {
        super(page);
        this.breadcrumbLink = page.locator('.breadcrumb a[href="/products"]');
        this.breadcrumb = page.locator('.breadcrumb li:last-child');
    }

    async expectBreadcrumb(brandName: string) {
        await expect(this.breadcrumb).toContainText(brandName);
    }
}