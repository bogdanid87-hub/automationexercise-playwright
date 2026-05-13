import { Page, Locator } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';


export class CategoryProductsPage extends ProductListingPage {


    constructor(page: Page) {
        super(page);
    }

}