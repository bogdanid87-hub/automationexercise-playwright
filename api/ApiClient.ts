// api/ApiClient.ts
// Thin wrapper around Playwright's APIRequestContext for clean, reusable API calls

import { APIRequestContext, expect } from '@playwright/test';
import { API, USERS } from '../data/testData';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  // ─── Products ────────────────────────────────────────────────────────────────

  async getAllProducts() {
    const response = await this.request.get(API.productsList);
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body.products as Product[];
  }

  async getAllBrands() {
    const response = await this.request.get(API.brandsList);
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body.brands as Brand[];
  }

  async searchProduct(term: string) {
    const response = await this.request.post(API.searchProduct, {
      form: { search_product: term },
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  // ─── User / Auth ─────────────────────────────────────────────────────────────

  async verifyLogin(email: string, password: string) {
    const response = await this.request.post(API.verifyLogin, {
      form: { email, password },
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async createAccount(userData: Record<string, string>) {
    const response = await this.request.post(API.createAccount, {
      form: userData,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body as { responseCode: number; message: string };
  }

  async deleteAccount(email: string, password: string) {
    const response = await this.request.delete(API.deleteAccount, {
      form: { email, password },
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async updateAccount(userData: Record<string, string>) {
    const response = await this.request.put(API.updateAccount, {
      form: userData,
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async getUserDetailByEmail(email: string) {
    const response = await this.request.get(API.getUserDetail, {
      params: { email },
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface Brand {
  id: number;
  brand: string;
}
