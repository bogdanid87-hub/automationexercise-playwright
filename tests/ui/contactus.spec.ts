//UI tests covering contact us form interactions

import { test, expect } from '../../fixtures/index';
import { CONTACT_US } from '../../data/testData';


test.describe('Contact Us', () => {
  //TC6
  test('should submit contact form with file upload successfully', async ({ contactPage }) => {
    await contactPage.navigate();
    await contactPage.dismissOverlays();
    await contactPage.navContactUs.click();
    await contactPage.waitForPageLoad();
    await contactPage.setupDialogHandler();

    await contactPage.submitContactForm(
      CONTACT_US.valid.name,
      CONTACT_US.valid.email,
      CONTACT_US.valid.subject,
      CONTACT_US.valid.message,
      CONTACT_US.valid.filePath
    );
    await contactPage.expectSuccessMessage();
    await contactPage.navigateHome();
  });

  //Negative test cases for contact form validation use direct url for speed
  test('should show validation error for missing email', async ({ contactPage }) => {
    await contactPage.goto();
    await contactPage.setupDialogHandler();

    await contactPage.submitContactForm(
      CONTACT_US.valid.name,
      '', // Missing email    
      CONTACT_US.valid.subject,
      CONTACT_US.valid.message
    );
    await contactPage.expectValidationError();
  });
  //Negative test cases for contact form validation use direct url for speed
  test('should show validation error for invalid email', async ({ contactPage }) => {
    await contactPage.goto();
    await contactPage.setupDialogHandler();

    await contactPage.submitContactForm(
      CONTACT_US.valid.name,
      CONTACT_US.invalidEmail.email,
      CONTACT_US.valid.subject,
      CONTACT_US.valid.message
    );
    await contactPage.expectInvalidEmailError();
  });

  test('should submit contact form without file upload successfully', async ({ contactPage }) => {
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
});