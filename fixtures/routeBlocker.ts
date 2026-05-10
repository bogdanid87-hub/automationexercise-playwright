import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
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
    await use(page);
  },
});

export { expect } from '@playwright/test';