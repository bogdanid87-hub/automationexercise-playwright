// tests/api/user.api.spec.ts
// API tests for user management endpoints
//console.log(process.env.TEST_USER_EMAIL);
import { test, expect } from '@fixtures/index';
import { USERS } from '@data/testData';

test.describe('API — User / Auth', () => {

  test('POST /api/verifyLogin with valid credentials should confirm user exists', async ({
    apiClient,
  }) => {
    const result = await apiClient.verifyLogin(
      USERS.existing.email,
      USERS.existing.password,
    );

    expect(result.responseCode).toBe(200);
    expect(result.message).toBe('User exists!');
  });

  test('POST /api/verifyLogin with invalid credentials should return 404', async ({
    apiClient,
  }) => {
    const result = await apiClient.verifyLogin(
      'nonexistent@example.com',
      'wrongpassword',
    );

    expect(result.responseCode).toBe(404);
    expect(result.message).toBe('User not found!');
  });

  test('POST /api/verifyLogin with missing parameters should return 400', async ({
    request,
  }) => {
    const response = await request.post('/api/verifyLogin', { form: {} });
    const body = await response.json();

    expect(body.responseCode).toBe(400);
  });

  test('GET /api/getUserDetailByEmail should return user details', async ({
    apiClient,
  }) => {
    const result = await apiClient.getUserDetailByEmail(USERS.existing.email);

    expect(result.responseCode).toBe(200);
    expect(result.user).toHaveProperty('email', USERS.existing.email);
    expect(result.user).toHaveProperty('name');
  });

  test.describe('Account lifecycle — create, verify, delete', () => {
    // This test creates and immediately cleans up a real account
    test('should create a new account via API and then delete it', async ({
      apiClient,
    }) => {
      const user = USERS.newUser();

      // Create
      const created = await apiClient.createAccount({
        name: user.name,
        email: user.email,
        password: user.password,
        title: user.title,
        birth_date: user.birth_date,
        birth_month: user.birth_month,
        birth_year: user.birth_year,
        firstname: user.firstname,
        lastname: user.lastname,
        company: user.company,
        address1: user.address1,
        address2: user.address2,
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobile_number,
      });

      expect(created.responseCode).toBe(201);
      expect(created.message).toBe('User created!');

      // Verify the account exists
      const verify = await apiClient.verifyLogin(user.email, user.password);
      expect(verify.responseCode).toBe(200);

      // Cleanup
      const deleted = await apiClient.deleteAccount(user.email, user.password);
      expect(deleted.responseCode).toBe(200);
      expect(deleted.message).toBe('Account deleted!');
    });
  });
});
