import { chromium, firefox, webkit } from '@playwright/test';
import dotenv from 'dotenv';

async function globalSetup() {
  dotenv.config();

  for (const [browserType, stateFile] of [
    [chromium, 'storageState.chromium.json'],
    // [firefox, 'storageState.firefox.json'],
    // [webkit, 'storageState.webkit.json'],
  ] as const) {
    const browser = await browserType.launch();
    const page = await browser.newPage();

    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (
        url.includes('fundingchoicesmessages') ||
        url.includes('googlesyndication') ||
        url.includes('doubleclick') ||
        url.includes('googleads') ||
        url.includes('adsbygoogle')
      ) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto('https://automationexercise.com');

    const consent = page.locator('button:has-text("Consent"), button:has-text("Accept")');
    if (await consent.isVisible({ timeout: 5000 }).catch(() => false)) {
      await consent.first().click();
    }

    await page.context().storageState({ path: stateFile });
    await browser.close();
  }
}

export default globalSetup;