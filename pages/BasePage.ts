// pages/BasePage.ts
// All page objects extend this — shared nav, header interactions, and utility methods

import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  // ─── Header nav ──────────────────────────────────────────────────────────────
  readonly navHome: Locator;
  readonly navProducts: Locator;
  readonly navCart: Locator;
  readonly navSignupLogin: Locator;
  readonly navLogout: Locator;
  readonly navDeleteAccount: Locator;
  readonly loggedInAsText: Locator;
  readonly navContactUs: Locator;
  readonly subscriptionWidget: Locator;
  readonly subscriptionEmail: Locator;
  readonly subscriptionButton: Locator;
  readonly subscriptionSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navHome = page.locator('a[href="/"]').first();
    this.navProducts = page.locator('a[href="/products"]');
    this.navCart = page.locator('header a[href="/view_cart"]');
    this.navSignupLogin = page.locator('a[href="/login"]');
    this.navLogout = page.locator('a[href="/logout"]');
    this.navDeleteAccount = page.locator('a[href="/delete_account"]');
    this.loggedInAsText = page.locator('li:has-text("Logged in as")');
    this.navContactUs = page.locator('a[href="/contact_us"]');
    this.subscriptionWidget = page.locator('.single-widget h2:has-text("Subscription")');
    this.subscriptionEmail = page.locator('#susbscribe_email');
    this.subscriptionButton = page.locator('#subscribe');
    this.subscriptionSuccessMessage = page.locator('#success-subscribe');
  }

  async navigate(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInAsText.isVisible();
  }

  async logout() {
    await this.navLogout.click();
  }

  async navigateHome() {
    await this.navHome.click();
    await this.waitForPageLoad();
    await expect(this.page).toHaveURL('/');
  }


  async waitForPageLoad() {
    // 'load' can timeout due to continuous background network activity from ads
    // 'domcontentloaded' fires when HTML is parsed and DOM is ready
    await this.page.waitForLoadState('domcontentloaded');
  }


  // Dismiss cookie/ad overlays that may block interactions
  async dismissOverlays() {
    // consent banner
    const consentBtn = this.page.locator('button:has-text("Consent")');
    const isConsentVisible = await consentBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (isConsentVisible) {
      await consentBtn.click();
    }
    // Google survey overlay
    const surveyClose = this.page.locator('text=Close');
    const isSurveyVisible = await surveyClose.isVisible({ timeout: 2000 }).catch(() => false);
    if (isSurveyVisible) {
      await surveyClose.click();
    }
    // ad popup with Close button
    const closeBtn = this.page.locator('button:has-text("Close"), a:has-text("Close")');
    const isCloseVisible = await closeBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (isCloseVisible) {
      await closeBtn.click();
    }
    // Google ad popup dismiss button
    const adDismiss = this.page.locator('#dismiss-button');
    const isAdVisible = await adDismiss.isVisible({ timeout: 2000 }).catch(() => false);
    if (isAdVisible) {
      await adDismiss.click();
    }
  }

  async subscribeToNewsletter(email: string) {
    await this.page.evaluate(() => {
      (document.querySelector('#footer') as HTMLElement)?.scrollIntoView();
    });
    await this.page.waitForTimeout(500);
    await this.subscriptionEmail.fill(email);
    await this.subscriptionButton.click();
  }

  async expectSubscriptionSuccess() {
    await this.subscriptionSuccessMessage.waitFor({ state: 'visible', timeout: 2000 });
    await expect(this.subscriptionSuccessMessage).toHaveText('You have been successfully subscribed!');
    await this.subscriptionSuccessMessage.waitFor({ state: 'hidden', timeout: 2000 }); // Wait for the message to disappear
  }
  async expectSubscriptionMissingEmailError() {
    await expect(this.subscriptionEmail).toHaveAttribute('type', 'email');
    await expect(this.subscriptionEmail).toHaveJSProperty('validity.valueMissing', true);
    await expect(this.subscriptionEmail).toHaveAttribute('required');
  }
  async expectSubscriptionInvalidEmailError() {
    await expect(this.subscriptionEmail).toHaveAttribute('type', 'email');
    await expect(this.subscriptionEmail).toHaveJSProperty('validity.typeMismatch', true);
  }
  async expectURL(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }
}
