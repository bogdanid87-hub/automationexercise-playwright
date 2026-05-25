// tests/ui/products.spec.ts
// UI tests covering product listing, search, and cart interactions

import { test, expect } from '../../fixtures/index';
import { PRODUCTS } from '../../data/testData';
// import { USERS } from '../../data/testData';
// import { HomePage } from '../../pages/HomePage';

test.describe('Products', () => {
  // TC8: Verify All Products and product detail page
  // Split into two focused tests for better failure isolation —
  // if product listing breaks and detail page breaks independently,
  // each failure is immediately identifiable without investigating a combined test
  test('should display all products on the products page', async ({ homePage, productsPage }) => {
    await homePage.goto();
    await homePage.navProducts.click();

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should show product detail page when clicking View Product', async ({
    productsPage,
    productDetailsPage,
    homePage
  }) => {
    await homePage.goto();
    await homePage.navProducts.click();
    await expect(productsPage.pageTitle).toBeVisible();
    await expect(productsPage.pageTitle).toHaveText('All Products'); // Ensure we're on the products page before interacting
    //check the correct ad is up
    await expect(productsPage.advertisement).toBeVisible();
    await expect(productsPage.advertisement.locator('img')).toHaveAttribute('src', '/static/images/shop/sale.jpg');
    const productName = await productsPage.getFirstProductName(); // Capture the name of the first product to verify on the detail page
    const productPrice = await productsPage.getFirstProductPrice(); // Capture the price of the first product to verify on the detail page
    await productsPage.viewFirstProduct();

    await expect(productDetailsPage.productName).toBeVisible();
    await expect(productDetailsPage.productName).toHaveText(productName);
    await expect(productDetailsPage.productPrice).toHaveText(productPrice);
    await expect(productDetailsPage.productCategory).toBeVisible();
    await expect(productDetailsPage.availability).toBeVisible();
    await expect(productDetailsPage.condition).toBeVisible();
    await expect(productDetailsPage.brand).toBeVisible();
  });

  //TC9
  test('should return results for a valid search term', async ({ homePage, productsPage }) => {
    await homePage.goto();
    await homePage.navProducts.click();
    await productsPage.searchFor(PRODUCTS.searchTerms.anotherValid);

    await expect(productsPage.pageTitle).toBeVisible();
    await expect(productsPage.pageTitle).toHaveText('Searched Products');

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    const productNames = await productsPage.getProductNames();
    productNames.forEach(name => {
      expect(name.toLowerCase()).toContain(PRODUCTS.searchTerms.anotherValid);
    });
  });

  //TC12 - compared to the example test, this adds 2 same products to verify price total 
  test('should add products to cart and verify totals', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    const firstProductName = await productsPage.getFirstProductName();
    const firstProductPrice = await productsPage.getFirstProductPrice();
    const secondProductName = await productsPage.getSecondProductName();
    const secondProductPrice = await productsPage.getSecondProductPrice();
    await productsPage.addFirstProductToCart();

    // Dismiss the success modal
    await productsPage.dismissAddedToCartModal();
    // Add a second product
    await productsPage.addSecondProductToCart();
    await productsPage.dismissAddedToCartModal();
    await productsPage.addSecondProductToCart();
    // instead of dismissing the modal, we use it to navigate to cart
    await productsPage.navigateToCartFromModal();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(2);

    const cartItems = await cartPage.getCartItemDetails();
    expect(cartItems[0].name).toBe(firstProductName);
    expect(cartItems[0].price).toBe(firstProductPrice);
    expect(cartItems[0].quantity).toBe('1');
    expect(cartItems[0].total).toBe(firstProductPrice);
    expect(cartItems[1].name).toBe(secondProductName);
    expect(cartItems[1].price).toBe(secondProductPrice);
    expect(cartItems[1].quantity).toBe('2');
    const secondItemTotal = parseFloat(secondProductPrice.replace('Rs.', '')) * 2;
    expect(cartItems[1].total).toBe(`Rs. ${secondItemTotal}`);
  });
  //TC13
  test('should add product to cart from detail page and verify quantity', async ({ productsPage, cartPage, productDetailsPage }) => {
    await productsPage.goto();
    await productsPage.viewFirstProduct();
    await expect(productDetailsPage.addToCartButton).toBeVisible();
    await productDetailsPage.expectURL(/\/product_details\//); // Ensure we're on a product detail page

    await productDetailsPage.setQuantity(4); // Set quantity to 4

    await productDetailsPage.addToCartButton.click();

    // Dismiss the success modal
    await productDetailsPage.dismissAddedToCartModal();

    await cartPage.navCart.click()
    await cartPage.waitForPageLoad();
    const cartItems = await cartPage.getCartItemDetails();
    expect(cartItems[0].quantity).toBe('4');
  });
  //TC17
  test('should add product to cart and then remove it', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addFirstProductToCart();

    // instead of dismissing the modal, we use it to navigate to cart
    await productsPage.navigateToCartFromModal();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);

    await cartPage.removeItem();

    await cartPage.expectCartIsEmpty();
  });
  //TC18 view category products
  test('view category products', async ({ homePage, categoryProductsPage }) => {
    await homePage.goto();
    await expect(homePage.sidebar.categoryMenuTitle).toBeVisible();
    await homePage.sidebar.clickCategory('Women');
    await homePage.sidebar.clickSubcategory('Dress');
    await expect(categoryProductsPage.pageTitle).toHaveText("Women - Dress Products");
    await expect(categoryProductsPage.breadcrumbLink).toBeVisible();
    await categoryProductsPage.expectBreadcrumb("Women", "Dress");
    await categoryProductsPage.sidebar.clickCategory("Men");
    await categoryProductsPage.sidebar.clickSubcategory("Jeans");
    await expect(categoryProductsPage.pageTitle).toHaveText("Men - Jeans Products");
    await categoryProductsPage.expectBreadcrumb("Men", "Jeans");
  })
  //TC19 view Brand products
  test('view brand products', async ({ homePage, brandsProductsPage }) => {
    await homePage.goto();
    await expect(homePage.sidebar.brandMenuTitle).toBeVisible();
    await homePage.sidebar.clickBrand("Polo");
    await expect(brandsProductsPage.pageTitle).toHaveText("Brand - Polo Products");
    await brandsProductsPage.expectBreadcrumb('Polo');
    await expect(brandsProductsPage.breadcrumbLink).toBeVisible();


  })

  //additional test - add products to cart using keyboard arrow keys
  test('should add product to cart using keyboard navigation', async ({ productsPage, productDetailsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.viewFirstProduct();
    await productDetailsPage.incrementQuantity();  // Increment quantity using keyboard
    await productDetailsPage.addToCart();

    // Dismiss the success modal
    await productDetailsPage.dismissAddedToCartModal();

    await cartPage.goto();
    const cartItems = await cartPage.getCartItemDetails();
    expect(cartItems[0].quantity).toBe('2'); // Quantity should be 2 after incrementing
  });
  //TC21 add review on product
  //skips some of the steps in the example test case
  //as those have already been asserted multiple times
  test('should add review on product', async ({ productsPage, productDetailsPage }) => {
    await productsPage.goto();
    await productsPage.viewFirstProduct();
    await expect(productDetailsPage.writeReviewTab).toBeVisible();
    await productDetailsPage.writeReview('User Name', 'email@adress.com', 'Review text');
    await expect(productDetailsPage.reviewSuccessMessage).toBeVisible();
    await expect(productDetailsPage.reviewSuccessMessage).toHaveText('Thank you for your review.');
  });
  //Negative test for review email field
  test('should show error for invalid email in review form', async ({ productsPage, productDetailsPage }) => {
    await productsPage.goto();
    await productsPage.viewFirstProduct();
    await productDetailsPage.writeReview('John Doe', 'notanemail', 'Great product!');
    await expect(productDetailsPage.reviewEmail).toHaveJSProperty('validity.typeMismatch', true);
  });//TC22 Add to cart from Recommended items
  test('should add products from recommended items carousel', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.recommendedCarousel.scrollIntoViewIfNeeded();
    await expect(homePage.recommendedTitle).toHaveText('recommended items');
    const productName = await homePage.getRecommendedProductName();
    await homePage.addRecommendedProductToCart();
    await homePage.dismissAddedToCartModal();
    await homePage.navCart.click();
    const cartItems = await cartPage.getCartItemDetails();
    expect(cartItems[0].name).toBe(productName);
  });
});   
