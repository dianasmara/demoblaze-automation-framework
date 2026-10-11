import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ──────────────────────────────────────────────────────────────
  get heroCarousel(): Locator       { return this.page.locator('#carouselExampleIndicators'); }
  get categoryButtons(): Locator    { return this.page.locator('.list-group-item'); }
  get productCards(): Locator       { return this.page.locator('.card'); }
  get productNames(): Locator       { return this.page.locator('.card-title a'); }
  get productPrices(): Locator      { return this.page.locator('.card-block h5'); }
  get nextButton(): Locator         { return this.page.locator('#next2'); }
  get prevButton(): Locator         { return this.page.locator('#prev2'); }
  get footer(): Locator             { return this.page.locator('footer'); }

  categoryButton(name: string): Locator {
    return this.page.locator('.list-group-item', { hasText: name });
  }

  productCard(name: string): Locator {
    return this.page.locator('.card-title a', { hasText: name });
  }

  // ─── Actions ───────────────────────────────────────────────────────────────
  async goto(): Promise<void> {
    await this.navigate('/');
    await this.page.waitForSelector('.card', { state: 'visible', timeout: 20_000 });
  }

  async clickCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    await this.categoryButton(category).click();
    await this.page.waitForTimeout(1500); // DemoBlaze uses setTimeout for category filter
    await this.page.waitForSelector('.card', { state: 'visible' });
  }

  async clickProduct(name: string): Promise<void> {
    await this.productCard(name).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.product-content, h2.name', { state: 'visible', timeout: 10_000 });
  }

  async getProductNames(): Promise<string[]> {
    await this.productNames.first().waitFor({ state: 'visible' });
    return this.productNames.allTextContents();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickPrev(): Promise<void> {
    await this.prevButton.click();
    await this.page.waitForTimeout(500);
  }

  // ─── Assertions ────────────────────────────────────────────────────────────
  async assertPageLoaded(): Promise<void> {
    await expect(this.heroCarousel).toBeVisible();
    await expect(this.categoryButtons.first()).toBeVisible();
    await expect(this.productCards.first()).toBeVisible({ timeout: 15_000 });
  }

  async assertCategoryFilter(category: string, expectedProducts: string[]): Promise<void> {
    await this.clickCategory(category as 'Phones' | 'Laptops' | 'Monitors');
    const names = await this.getProductNames();
    for (const expected of expectedProducts) {
      expect(names.some((n) => n.toLowerCase().includes(expected.toLowerCase()))).toBeTruthy();
    }
  }

  async assertProductVisible(name: string): Promise<void> {
    await expect(this.productCard(name)).toBeVisible();
  }
}
