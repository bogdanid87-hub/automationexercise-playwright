// tests/bugs/bugs.spec.ts
// Documented defects found during exploratory testing
// Each test reproduces the bug and asserts the actual (broken) behaviour
// These tests are expected to PASS — they document what the app does, not what it should do
import { test, expect } from '../../fixtures';


test.describe('Known Bugs', () => {
  
  test('[BUG] reloading the cart page restores the removed products', async ({ productsPage, cartPage }) => {
    //Expected: cart should remain empty after reload
    //Actual (bug): navigating back to cart restores the removed item
    await productsPage.goto();
    //adds 1 product to cart and navigates there
    await productsPage.addFirstProductToCart();
    await productsPage.navigateToCartFromModal();
    //return the number of products in cart - 1
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);
    //remove the product from the cart and verifies the cart is empty message is displayed
    //create another constant and check that indeed no products are present
    await cartPage.removeItem();
    await cartPage.expectCartIsEmpty();
    const noItems = await cartPage.getItemCount();
    expect(noItems).toBe(0);
    //reload the cart page (same behaviour if we use direct url)
    await cartPage.navCart.click();
    //get the new item count after reload
    const itemCountAfterReload = await cartPage.getItemCount();
    expect(itemCountAfterReload).toBe(1); //bug: item was restored

  });

});