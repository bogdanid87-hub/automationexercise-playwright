//UI tests covering contact us form interactions

import { test, expect } from '../../fixtures';
import { CONTACT_US } from '../../data/testData';

test.describe('Contact Us', () => {

  test('should submit contact form successfully', async ({ contactPage }) => {
    await contactPage.goto();
    await contactPage.setupDialogHandler();

    await contactPage.submitContactForm(
        CONTACT_US.valid.name,
        CONTACT_US.valid.email,
        CONTACT_US.valid.subject,
        CONTACT_US.valid.message
        );
    await contactPage.expectSuccessMessage();
  });

    test('should show validation error for missing email', async ({ contactPage }) => {
      await contactPage.goto();
      await contactPage.setupDialogHandler();

      await contactPage.submitContactForm(
          CONTACT_US.missingEmail.name,
          CONTACT_US.missingEmail.email,
          CONTACT_US.missingEmail.subject,
          CONTACT_US.missingEmail.message
          );
      await contactPage.expectValidationError();
    });

    test('should show validation error for invalid email', async ({ contactPage }) => {
      await contactPage.goto();
      await contactPage.setupDialogHandler();

      await contactPage.submitContactForm(
          CONTACT_US.invalidEmail.name,
          CONTACT_US.invalidEmail.email,
          CONTACT_US.invalidEmail.subject,
          CONTACT_US.invalidEmail.message
          );
      await contactPage.expectInvalidEmailError();
    });

    test('should submit contact form with file upload successfully', async ({ contactPage }) => {
      await contactPage.goto();
      await contactPage.setupDialogHandler();

      await contactPage.submitContactForm(
          CONTACT_US.validUpload.name,
          CONTACT_US.validUpload.email,
          CONTACT_US.validUpload.subject,
          CONTACT_US.validUpload.message,
          CONTACT_US.validUpload.filePath
          );
      await contactPage.expectSuccessMessage();
    });
});