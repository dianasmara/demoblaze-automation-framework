import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ──────────────────────────────────────────────────────────────
  get productName(): Locator    { return this.page.locator('h2.name'); }
  get productPrice(): Locator   { return this.page.locator('h3.price-container'); }
  get productDesc(): Locator    { return this.page.locator('#more-information p'); }
  get addToCartBtn(): Locator   { return this.page.locator('.btn-success[onclick*="addToCart"]'); }
  get productImage(): Locator   { return this.page.locator('.item.active img'); }
  get breadcrumb(): Locator     { return this.page.locator('.breadcrumb'); }

  // ─── Actions ───────────────────────────────────────────────────────────────
  async addToCart(): Promise<string> {
    const alertPromise = this.handleAlert('accept');
    await this.addToCartBtn.click();
    return alertPromise;
  }

  async addToCartAndConfirm(): Promise<void> {
    const message = await this.addToCart();
    expect(message.toLowerCase()).toContain('product added');
  }

  // ─── Getters ───────────────────────────────────────────────────────────────
  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }

  async getProductDescription(): Promise<string> {
    return (await this.productDesc.textContent()) ?? '';
  }

  // ─── Assertions ────────────────────────────────────────────────────────────
  async assertProductLoaded(): Promise<void> {
    await expect(this.productName).toBeVisible({ timeout: 10_000 });
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartBtn).toBeVisible();
  }

  async assertProductName(expected: string): Promise<void> {
    await expect(this.productName).toHaveText(expected, { ignoreCase: true });
  }

  async assertAddToCartVisible(): Promise<void> {
    await expect(this.addToCartBtn).toBeVisible();
    await expect(this.addToCartBtn).toBeEnabled();
  }
}
