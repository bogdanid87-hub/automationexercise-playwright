import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ContactPage extends BasePage {
  readonly contactName: Locator;
  readonly contactEmail: Locator;
  readonly contactSubject: Locator;
  readonly contactMessage: Locator;
  readonly contactUploadFile: Locator;
  readonly contactSubmitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.contactName = page.locator('[data-qa="name"]');
    this.contactEmail = page.locator('[data-qa="email"]');
    this.contactSubject = page.locator('[data-qa="subject"]');
    this.contactMessage = page.locator('[data-qa="message"]');
    this.contactUploadFile = page.locator('[name="upload_file"]');
    this.contactSubmitButton = page.locator('[data-qa="submit-button"]');
    this.successMessage = page.locator('div[class="status alert alert-success"]');
  }

  async goto() {
    await this.navigate('/contact_us');
    await this.dismissOverlays();
    await expect(this.contactSubmitButton).toBeVisible();
  }

  async setupDialogHandler() {
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  async submitContactForm(name: string, email: string, subject: string, message: string, filePath?: string) {
    await this.contactName.fill(name);
    await this.contactEmail.fill(email);
    await this.contactSubject.fill(subject);
    await this.contactMessage.fill(message);
    if (filePath) {
      await this.contactUploadFile.setInputFiles(filePath);
    }
    await this.contactSubmitButton.click();
  }

  async expectSuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async expectValidationError() {
    await expect(this.contactEmail).toHaveAttribute('type', 'email');
    await expect(this.contactEmail).toHaveJSProperty('validity.valueMissing', true);
    await expect(this.contactEmail).toHaveAttribute('required');
  }
  async expectInvalidEmailError() {
    await expect(this.contactEmail).toHaveAttribute('type', 'email');
    await expect(this.contactEmail).toHaveJSProperty('validity.typeMismatch', true);
  }
}