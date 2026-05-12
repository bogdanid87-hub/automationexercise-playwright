# Automation Exercise — Playwright Test Suite
![Playwright Tests](https://github.com/bogdanid87-hub/automationexercise-playwright/actions/workflows/playwright.yml/badge.svg)

A Playwright test suite for [Automation Exercise](https://automationexercise.com), built as part of a QA portfolio project — **Work In Progress**

---

## Project Overview

This suite covers API tests, UI tests around authentication, products and contact us, as well as one end-to-end test, with more to be added.

---

## Tech Stack

| | |
|---|---|
| **Tools** | Playwright, VS Code |
| **Language** | TypeScript |
| **Website under test** | [Automation Exercise](https://automationexercise.com) |
| **API Docs** | [API List](https://automationexercise.com/api_list) |

---

## Test Coverage

| Folder | Description | Test Cases |
|---|---|---|
| `tests/api` | Products, brands, search and user account lifecycle | — |
| `tests/ui/auth.spec.ts` | Authentication | TC1, TC2, TC3, TC4, TC5 |
| `tests/ui/contactus.spec.ts` | Contact Us | TC6 |
| `tests/ui/products.spec.ts` | Products, search, cart interactions | TC8, TC9, TC12, TC13, TC17 |
| `tests/ui/subscription.spec.ts` | Subscription | TC10, TC11 |
| `tests/e2e/api-assisted-purchase.spec.ts` | API-assisted purchase flow with UI validation and cross-layer assertions | TC23, TC24 |

**To be added:**
- TC7: Verify Test Cases Page
- TC14: Place Order — Register while Checkout
- TC15: Place Order — Register before Checkout (currently user is created via API, not UI registration)
- TC16: Place Order — Login before Checkout (partially covered — login is via UI but account is created via API)
- TC18: View Category Products
- TC19: View & Cart Brand Products
- TC20: Search Products and Verify Cart After Login
- TC21: Add review on product
- TC22: Add to cart from Recommended items
- TC25: Scroll Up using Arrow button and Scroll Down
- TC26: Scroll Up without Arrow button and Scroll Down
- Visual regression on product details page, login/signup and contact us

---

## How to Run

1. Create a real user on the [website under test](https://automationexercise.com)
2. Clone the repository and open in VS Code
3. Run in the terminal:
```bash
npm install
npx playwright install
```
4. Create a `.env` file in the root of the project and add the credentials from the user you created at step 1, as shown in the `.env.example` file
5. Run the tests:
```bash
npx playwright test tests
```

---

## Observations and Notes

- The ID for the subscription email field is misspelled in the website's HTML (`susbscribe_email` instead of `subscribe_email`)
- In both Chrome for Mac and Playwright's Pick Locator, the browser email validation reads `"Please fill in this field."` — but when running tests with Playwright's Chromium, it returns `"Please fill out this field."` — leading to the design decision to validate the email field using `validity.valueMissing` instead of asserting the message text
- `BasePage.ts` has extended beyond its initial scope by including subscription logic — this will be refactored into a separate component at the end of the project
- Product card interaction required explicit scrolling due to Google ads and the "Searched Products" heading intercepting clicks on the add to cart button at different stages of debugging (will be changed later as now ads are blocked)
- Api and UI asserts would need to go deeper in a real project, as they could fail, if for example, there are too many results for the UI to load in one go (it uses lazy load)
- There are unused methods that will need to be removed at a later stage
- In order to better validate possible fails and speed up tests, I have opted out to not follow strictly the example test cases; for example, some tests will use goto instead of UI navigation, if the UI navigation was already tested in another test
- I have chosen to block ads, as they were randomly breaking tests (they were waiting for Playwright to finish before being displayed)
- configured to run on Chromium only for speed
