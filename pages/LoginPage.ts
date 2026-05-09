// pages/LoginPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ─── Login section ───────────────────────────────────────────────────────────
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginErrorText: Locator;

  // ─── Signup section ──────────────────────────────────────────────────────────
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly signupErrorText: Locator;

  constructor(page: Page) {
    super(page);
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginErrorText = page.locator('p:has-text("Your email or password is incorrect")');

    this.signupName = page.locator('[data-qa="signup-name"]');
    this.signupEmail = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.signupErrorText = page.locator('p:has-text("Email Address already exist")');
  }

  async goto() {
    await this.navigate('/login');
    await this.dismissOverlays();
    await expect(this.loginButton).toBeVisible();
  }
async loginViaHome() {
  await this.navigateViaHome(this.navSignupLogin);
}

  async login(email: string, password: string) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string) {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async expectLoginError() {
    await expect(this.loginErrorText).toBeVisible();
  }

  async expectSignupEmailExistsError() {
    await expect(this.signupErrorText).toBeVisible();
  }
  async expectOnLoginPage() {
  await expect(this.page).toHaveURL('/login');
}

}
