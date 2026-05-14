import { test, expect } from '../../fixtures/index';

test('visual test for 1st product details page', async ({ page, productDetailsPage }) => {
    await page.goto('/product_details/1');
    await productDetailsPage.dismissOverlays();
    await expect(page).toHaveScreenshot({ fullPage: true });
});

test('visual test for login/signup page', async ({ page, loginPage }) => {
    await loginPage.goto();
    await expect(page).toHaveScreenshot({ fullPage: true });
});

test('visual test for contact us page', async ({ page, contactPage }) => {
    await contactPage.goto();
    await expect(page).toHaveScreenshot({ fullPage: true });
});

test('visual test for empty cart', async ({ page, cartPage }) => {
    await cartPage.goto();
    await expect(page).toHaveScreenshot({ fullPage: true });
});

test('visual test for cart with 1st product', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.addFirstProductToCart();
    await homePage.navigateToCartFromModal();
    await expect(page).toHaveScreenshot({ fullPage: true });
});