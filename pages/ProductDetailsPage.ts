import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly quantityInput: Locator;
    readonly availability: Locator;
    readonly condition: Locator;
    readonly brand: Locator;
    readonly addToCartButton: Locator;
    readonly writeReviewTab: Locator;
    readonly reviewName: Locator;
    readonly reviewEmail: Locator;
    readonly reviewText: Locator;
    readonly reviewSubmitButton: Locator;
    readonly reviewSuccessMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.locator('.product-information h2'); 
        this.productCategory = page.locator('p:has-text("Category:")');
        this.productPrice = page.locator('.product-information span span');
        this.quantityInput = page.locator('#quantity');
        this.availability = page.locator('b:has-text("Availability:")');
        this.condition = page.locator('b:has-text("Condition:")');
        this.brand = page.locator('b:has-text("Brand:")');
        this.addToCartButton = page.locator('button:has-text("Add to cart")');
        this.writeReviewTab = page.locator('a:has-text("Write Your Review")');
        this.reviewName = page.locator('#name');
        this.reviewEmail = page.locator('#email');
        this.reviewText = page.locator('#review');  
        this.reviewSubmitButton = page.locator('#button-review');
        this.reviewSuccessMessage = page.locator('#review-section .alert-success');
    }

async setQuantity(quantity: number) {
  await this.quantityInput.fill(quantity.toString());
}

async incrementQuantity() {
    await this.quantityInput.press('ArrowUp');
}

async decrementQuantity() {
    await this.quantityInput.press('ArrowDown');
}

async addToCart() {
    await expect(this.addToCartButton).toBeVisible();
  await this.addToCartButton.click();
}

async writeReview(name: string, email: string, text: string) {
    await this.writeReviewTab.click();
    await this.reviewName.fill(name);
    await this.reviewEmail.fill(email);
    await this.reviewText.fill(text);
    await this.reviewSubmitButton.click();
}
}