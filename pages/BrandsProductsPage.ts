import { Page, Locator } from '@playwright/test';
import { ProductListingPage } from './ProductListingPage';


export class BrandsProductsPage extends ProductListingPage {


    constructor(page: Page) {
        super(page);
    }

}