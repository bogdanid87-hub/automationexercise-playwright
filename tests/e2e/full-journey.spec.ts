import { test, expect } from '@fixtures/index';
import { PAYMENT, USERS } from '@data/testData';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { SignupPage } from '@pages/SignupPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage } from '@pages/PaymentPage';
import { OrderPlacedPage } from '@pages/OrderPlacedPage';
import { ApiClient } from '@api/ApiClient';

// ─── Helper functions ─────────
// add 2 products to cart
async function addProductsToCart(homePage: HomePage, cartPage: CartPage) {
    //add products to cart
    await homePage.addFirstProductToCart();
    await homePage.dismissAddedToCartModal();
    await homePage.addSecondProductToCart();
    await homePage.dismissAddedToCartModal();
    //go to cart
    await homePage.navCart.click();
    await expect(cartPage.cartTable).toBeVisible();
}
// user registration
async function userRegistration(
    loginPage: LoginPage, signupPage: SignupPage,
    user: ReturnType<typeof USERS.newUser>) {
    //continue from Signup /Login page
    await loginPage.startSignup(user.name, user.email);
    await signupPage.fillAccountDetails(user);
    await signupPage.submitAndConfirm();
    await expect(signupPage.loggedInAsText).toBeVisible();
}
//complete order once loged in and on cart page
async function completeOrder(
    cartPage: CartPage, checkoutPage: CheckoutPage,
    paymentPage: PaymentPage, orderPlacedPage: OrderPlacedPage,
    user: ReturnType<typeof USERS.newUser>) {
    await cartPage.proceedToCheckoutButton.click(); //go to checkout from cart
    //verify delivery and billing address
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
}
//register user via API for tests requiring login only 
async function registerViaAPI(apiClient: ApiClient, user: ReturnType<typeof USERS.newUser>) {
    const created = await apiClient.createAccount({
        name: user.name,
        email: user.email,
        password: user.password,
        title: user.title,
        birth_date: user.birth_date,
        birth_month: user.birth_month,
        birth_year: user.birth_year,
        firstname: user.firstname,
        lastname: user.lastname,
        company: user.company,
        address1: user.address1,
        address2: user.address2,
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobile_number,
    });
    expect(created.responseCode).toBe(201);
}


test.describe('Place Order flows', () => {
    let user: ReturnType<typeof USERS.newUser>;

    test.afterEach(async ({ apiClient }) => {
        try {
            await apiClient.deleteAccount(user.email, user.password);
        } catch {
            // account may already be deleted or never created — ignore
        }
    });
    //TC14: Place Order: Register while Checkout
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
        user = USERS.newUser();
        //load the home page
        await homePage.goto();
        // add 2 products to cart
        await addProductsToCart(homePage, cartPage);
        //go to cart
        await expect(cartPage.cartTable).toBeVisible();
        //proceed to checkout and chose registration
        await cartPage.proceedToCheckoutButton.click();
        await cartPage.registerLoginModal.click();
        // sign up with new user
        await userRegistration(loginPage, signupPage, user);
        //go back to cart and proceed with checkout
        await signupPage.navCart.click();
        await completeOrder(cartPage, checkoutPage, paymentPage, orderPlacedPage, user)
        //delete account
        await orderPlacedPage.navDeleteAccount.click();
        await accountDeletedPage.expectAccountDeleted();
        await accountDeletedPage.continueToHome();
    });
    //TC15: Place Order: Register before Checkout
    //also covers TC23: Verify address details in checkout page 
    test('full journey register from home - add products - place order - account delete', async ({
        homePage,
        cartPage,
        loginPage,
        signupPage,
        paymentPage,
        checkoutPage,
        orderPlacedPage,
        accountDeletedPage
    }) => {
        user = USERS.newUser();
        await homePage.goto();
        await homePage.navSignupLogin.click();
        await userRegistration(loginPage, signupPage, user);
        await addProductsToCart(homePage, cartPage);
        await completeOrder(cartPage, checkoutPage, paymentPage, orderPlacedPage, user);
        //delete account
        await orderPlacedPage.navDeleteAccount.click();
        await accountDeletedPage.expectAccountDeleted();
        await accountDeletedPage.continueToHome();
    });
    //TC16: Place Order: Login before Checkout
    //will create the account using API to fullfil TC steps 
    //and safely delete account
    test('full journey login API account from home - add products - place order - delete account', async ({
        apiClient,
        homePage,
        cartPage,
        loginPage,
        paymentPage,
        checkoutPage,
        orderPlacedPage,
        accountDeletedPage
    }) => {
        //create account using API
        user = USERS.newUser();
        await registerViaAPI(apiClient, user)
        //proceed with UI tests
        await homePage.goto();
        //login API account
        await homePage.navSignupLogin.click();
        await loginPage.login(user.email, user.password);
        await expect(homePage.loggedInAsText).toBeVisible();
        await addProductsToCart(homePage, cartPage);
        await completeOrder(cartPage, checkoutPage, paymentPage, orderPlacedPage, user);
        //delete account
        await orderPlacedPage.navDeleteAccount.click();
        await accountDeletedPage.expectAccountDeleted();
        await accountDeletedPage.continueToHome();
    });

    //TC24 Download Invoice after purchase order
    test('full journey login API account from home - add products - place order - download invoice - delete account', async ({
        apiClient,
        homePage,
        cartPage,
        loginPage,
        paymentPage,
        checkoutPage,
        orderPlacedPage,
        accountDeletedPage,
        page
    }) => {
        //create account using API
        user = USERS.newUser();
        await registerViaAPI(apiClient, user)
        //proceed with UI tests
        await homePage.goto();
        //login API account
        await homePage.navSignupLogin.click();
        await loginPage.login(user.email, user.password);
        await expect(homePage.loggedInAsText).toBeVisible();
        await addProductsToCart(homePage, cartPage);
        await completeOrder(cartPage, checkoutPage, paymentPage, orderPlacedPage, user);
        //download invoice
        const downloadPromise = page.waitForEvent('download');
        await orderPlacedPage.downloadInvoice();
        const download = await downloadPromise;
        //check file name
        expect(download.suggestedFilename()).toContain('invoice');
        //delete account
        await orderPlacedPage.navDeleteAccount.click();
        await accountDeletedPage.expectAccountDeleted();
        await accountDeletedPage.continueToHome();
    });
})