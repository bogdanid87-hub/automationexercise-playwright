import { test, expect } from '@fixtures/index';
import { PAYMENT, USERS } from '@data/testData';


//Test Case 14: Place Order: Register while Checkout
test('full journey add prod - register from checkout - place order - account delete', async ({
    homePage,
    cartPage,
    loginPage,
    signupPage,
    paymentPage,
    checkoutPage,
    orderPlacedPage,
    accountDeletedPage

}) => {
    //load the home page
    await homePage.goto();
    //add products to cart
    await homePage.addFirstProductToCart();
    await homePage.dismissAddedToCartModal();
    await homePage.addSecondProductToCart();
    await homePage.dismissAddedToCartModal();
    //go to cart
    await homePage.navCart.click();
    await expect(cartPage.cartTable).toBeVisible();
    //proceed to checkout and chose registration
    await cartPage.proceedToCheckoutButton.click();
    await cartPage.registerLoginModal.click();
    //sign up with new user
    const user = USERS.newUser();
    await loginPage.startSignup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await signupPage.submitAndConfirm();
    await expect(signupPage.loggedInAsText).toBeVisible();
    //go back to cart and proceed with checkout
    await signupPage.navCart.click();
    await cartPage.proceedToCheckoutButton.click();
    //verify delivery adn billing address
    await checkoutPage.expectAddressDetails(checkoutPage.deliveryAddressSection, user);
    await checkoutPage.expectAddressDetails(checkoutPage.billingAddressSection, user);
    //enter order comments
    await checkoutPage.enterOrderMessage('Please deliver between 9 AM and 5 PM.');
    await checkoutPage.placeOrder();
    //enter payment details
    await paymentPage.enterPaymentDetails(
        PAYMENT.nameOnCard,
        PAYMENT.cardNumber,
        PAYMENT.cvc,
        PAYMENT.expiryMonth,
        PAYMENT.expiryYear
    );
    await paymentPage.submitPayment();
    await orderPlacedPage.orderConfirmation();
    //delete account
    await orderPlacedPage.navDeleteAccount.click();
    await accountDeletedPage.expectAccountDeleted();
    await accountDeletedPage.continueToHome();

});