// pages/SignupPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly password: Locator;
  readonly birthDay: Locator;
  readonly birthMonth: Locator;
  readonly birthYear: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address1: Locator;
  readonly address2: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobileNumber: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeader: Locator;
  readonly continueButton: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.password = page.locator('[data-qa="password"]');
    this.birthDay = page.locator('[data-qa="days"]');
    this.birthMonth = page.locator('[data-qa="months"]');
    this.birthYear = page.locator('[data-qa="years"]');
    this.firstName = page.locator('[data-qa="first_name"]');
    this.lastName = page.locator('[data-qa="last_name"]');
    this.company = page.locator('[data-qa="company"]');
    this.address1 = page.locator('[data-qa="address"]');
    this.address2 = page.locator('[data-qa="address2"]');
    this.country = page.locator('[data-qa="country"]');
    this.state = page.locator('[data-qa="state"]');
    this.city = page.locator('[data-qa="city"]');
    this.zipcode = page.locator('[data-qa="zipcode"]');
    this.mobileNumber = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.accountCreatedHeader = page.locator('h2[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.offersCheckbox = page.locator('#optin');
  }

  async fillAccountDetails(data: {
    title: string;
    password: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile_number: string;
  }) {
    if (data.title === 'Mr') await this.titleMr.check();
    else await this.titleMrs.check();

    await this.password.fill(data.password);
    await this.birthDay.selectOption(data.birth_date);
    await this.birthMonth.selectOption(data.birth_month);
    await this.birthYear.selectOption(data.birth_year);
    await this.firstName.fill(data.firstname);
    await this.lastName.fill(data.lastname);
    await this.company.fill(data.company);
    await this.address1.fill(data.address1);
    await this.address2.fill(data.address2);
    await this.country.selectOption(data.country);
    await this.state.fill(data.state);
    await this.city.fill(data.city);
    await this.zipcode.fill(data.zipcode);
    await this.mobileNumber.fill(data.mobile_number);
  }
  
  async acceptNewsletter() {
    await this.newsletterCheckbox.check();
  }

  async acceptSpecialOffers() {
    await this.offersCheckbox.check();
  }

  async submitAndConfirm() {
    await this.createAccountButton.click();
    await expect(this.accountCreatedHeader).toBeVisible();
    await this.continueButton.click();
  }
}
