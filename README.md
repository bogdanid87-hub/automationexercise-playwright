# Automation Exercise — Playwright Test Suite

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

| Folder | Description |
|---|---|
| `tests/api` | Products, brands, search and user account lifecycle |
| `tests/ui` | Authentication, Contact Us, searching products and adding to cart, Subscription |
| `tests/e2e` | Full journey from account creation, searching and adding products, and account deletion — API cross-validation on product count returned by the UI search |

**To be added:**
- Checkout page
- Verifying test cases and API testing pages
- Removing items from cart
- Navigation tests using UI clicks
- Negative tests
- Scroll functionality
- Downloading invoice after purchase

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
- Product card interaction required explicit scrolling due to Google ads and the "Searched Products" heading intercepting clicks on the add to cart button at different stages of debugging
