// data/testData.ts
// Centralised test data — keeps tests clean and easy to maintain

export const URLS = {
  home: '/',
  login: '/login',
  signup: '/signup',
  products: '/products',
  cart: '/view_cart',
  checkout: '/checkout',
  contactUs: '/contact_us',
} as const;

export const API = {
  base: 'https://automationexercise.com/api',
  productsList: '/api/productsList',
  brandsList: '/api/brandsList',
  searchProduct: '/api/searchProduct',
  verifyLogin: '/api/verifyLogin',
  createAccount: '/api/createAccount',
  deleteAccount: '/api/deleteAccount',
  updateAccount: '/api/updateAccount',
  getUserDetail: '/api/getUserDetailByEmail',
} as const;

export const USERS = {
  // Existing user — set via .env for real runs
  existing: {
    email: process.env.TEST_USER_EMAIL ?? 'testuser@example.com',
    password: process.env.TEST_USER_PASSWORD ?? 'Test@1234',
  },
  // Dynamically generated user for registration tests
  newUser: () => {
    const ts = Date.now();
    return {
      name: `QA User ${ts}`,
      email: `qauser_${ts}@mailtest.com`,
      password: 'SecurePass123!',
      title: 'Mr',
      birth_date: '15',
      birth_month: 'June',
      birth_year: '1990',
      firstname: 'QA',
      lastname: 'User',
      company: 'Test Corp',
      address1: '123 Test Street',
      address2: 'Suite 4',
      country: 'United States',
      zipcode: '10001',
      state: 'New York',
      city: 'New York',
      mobile_number: '5551234567',
    };
  },
} as const;

export const PRODUCTS = {
  searchTerms: {
    valid: 'tshirt',       // a search that should return results
    anotherValid: 'top',   // another one that should return results
    noResults: 'zzznoresults999',  // a search that should return nothing
  },
  categories: {
    women: 'Women',
    men: 'Men',
    kids: 'Kids',
  },
} as const;

export const CONTACT_US = {
  valid: {
    name: 'John Doe',
    email: 'fakeemail@example.com',
    subject: 'Test Subject',
    message: 'Test Message',
    filePath: 'fixtures/testfile.txt', // Ensure this file exists 
  },
  invalidEmail: {
    email: 'invalid-email',}
} as const;
