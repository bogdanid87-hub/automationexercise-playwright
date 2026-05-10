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

| Folder | Description | Test Cases |
|---|---|---|
| `tests/api` | Products, brands, search and user account lifecycle | — |
| `tests/ui/auth.spec.ts` | Authentication | TC1, TC2, TC3, TC4, TC5 |
| `tests/ui/contactus.spec.ts` | Contact Us | TC6 |
| `tests/ui/products.spec.ts` | Searching products and adding to cart | TC8, TC9, TC12 |
| `tests/ui/subscription.spec.ts` | Subscription | TC10 |
| `tests/e2e/user-journey.spec.ts` | Full purchase journey with API cross-validation | TC15, TC16, TC23, TC24 |

**To be added:**
- TC7: Verify Test Cases Page — `tests/ui/navigation.spec.ts`
- TC8: Verify All Products and product detail page — `tests/ui/products.spec.ts`
- TC11: Subscription in Cart page — `tests/ui/subscription.spec.ts`
- TC13: Verify Product quantity in Cart — `tests/ui/cart.spec.ts`
- TC14: Place Order — Register while Checkout — `tests/e2e/user-journey.spec.ts`
- TC17: Remove Products From Cart — `tests/ui/cart.spec.ts`
- TC18: View Category Products — `tests/ui/categories.spec.ts`
- TC19: View & Cart Brand Products — `tests/ui/categories.spec.ts`
- TC20: Search Products and Verify Cart After Login — `tests/e2e/user-journey.spec.ts`
- TC21: Add review on product — `tests/ui/products.spec.ts`
- TC22: Add to cart from Recommended items — `tests/ui/products.spec.ts`
- TC25: Scroll Up using Arrow button and Scroll Down — `tests/ui/scroll.spec.ts`
- TC26: Scroll Up without Arrow button and Scroll Down — `tests/ui/scroll.spec.ts`

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
- Api and UI asserts would need to go deeper in a real project, as they could fail, if for example, there are too many results for the UI to load in one go (it uses lazy load)
