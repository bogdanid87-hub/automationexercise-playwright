// pages/BasePage.ts
// All page objects extend this — shared nav, header interactions, and utility methods

import { Page, Locator } from '@playwright/test';

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

  constructor(page: Page) {
    this.page = page;
    this.navHome = page.locator('a[href="/"]').first();
    this.navProducts = page.locator('a[href="/products"]');
    this.navCart = page.locator('a[href="/view_cart"]');
    this.navSignupLogin = page.locator('a[href="/login"]');
    this.navLogout = page.locator('a[href="/logout"]');
    this.navDeleteAccount = page.locator('a[href="/delete_account"]');
    this.loggedInAsText = page.locator('li:has-text("Logged in as")');
  }

  async navigate(path: string = '/') {
    await this.page.goto(path);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInAsText.isVisible();
  }

  async logout() {
    await this.navLogout.click();
  }

  // Dismiss cookie/ad overlays that may block interactions
async dismissOverlays() {
  const consentBtn = this.page.locator('button:has-text("Consent")');
  const isVisible = await consentBtn.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (isVisible) {
    await consentBtn.click();
  }
  // if not visible, silently continue — banner wasn't present
}
}
