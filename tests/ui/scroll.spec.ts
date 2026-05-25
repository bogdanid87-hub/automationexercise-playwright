import { test, expect } from '../../fixtures/index';

test.describe('Scroll Functionality', () => {
    //TC25 Verify Scroll Up using 'Arrow' button and Scroll Down functionality
    test('should scroll up using Arrow button', async ({ page, homePage }) => {
        await homePage.goto();
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(homePage.subscriptionWidget).toBeInViewport();
        await homePage.scrollUp.click();
        await expect(homePage.homeCarousel).toBeInViewport();
        await expect(homePage.homeHeading).toBeInViewport();
    })
    //TC26 Verify Scroll Up without 'Arrow' button and Scroll Down functionality
    test('should scroll up using Home button', async ({ page, homePage }) => {
        await homePage.goto();
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(homePage.subscriptionWidget).toBeInViewport();
        await page.keyboard.press('Home');
        await expect(homePage.homeCarousel).toBeInViewport();
        await expect(homePage.homeHeading).toBeInViewport();
    })
})