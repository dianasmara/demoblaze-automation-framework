

import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — abstract base for all Page Object Models.
 * Provides shared navigation, wait, and assertion utilities.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // ─── Navigation ────────────────────────────────────────────────────────────
  async navigate(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 45_000});
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  // ─── Wait Utilities ────────────────────────────────────────────────────────
  async waitForVisible(selector: string, timeout = 10_000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async waitForHidden(selector: string, timeout = 10_000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  async waitForUrl(pattern: string | RegExp, timeout = 15_000): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  async waitForNetworkIdle(timeout = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  // ─── Interaction Utilities ─────────────────────────────────────────────────
  protected async clickAndWait(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  protected async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  // ─── Alert Handling ────────────────────────────────────────────────────────
  async handleAlert(action: 'accept' | 'dismiss' = 'accept'): Promise<string> {
    const dialog = await this.page.waitForEvent('dialog', { timeout: 5000 });
    const message = dialog.message();
    if (action === 'accept') {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
    return message;
  }

  // ─── Modal Helpers ─────────────────────────────────────────────────────────
  async waitForModal(timeout = 10_000): Promise<void> {
    await this.page.waitForSelector('.modal.show', { state: 'visible', timeout });
  }

  async closeModal(): Promise<void> {
    const closeBtn = this.page.locator('.modal.show .close, .modal.show [data-dismiss="modal"]');
    await closeBtn.first().click();
    await this.page.waitForSelector('.modal.show', { state: 'hidden', timeout: 5000 });
  }

  // ─── Assertion Helpers ─────────────────────────────────────────────────────
  async assertTextVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: false })).toBeVisible();
  }

  async assertTitle(expected: string): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }

  async assertCurrentUrl(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  // ─── Nav Bar ───────────────────────────────────────────────────────────────
  get navbar(): Locator {
    return this.page.locator('#navbarExample');
  }

  get navLoginLink(): Locator {
    return this.page.locator('#login2');
  }

  get navSignupLink(): Locator {
    return this.page.locator('#signin2');
  }

  get navCartLink(): Locator {
    return this.page.locator('#cartur');
  }

  get navLogoutLink(): Locator {
    return this.page.locator('#logout2');
  }

  get navWelcomeUser(): Locator {
    return this.page.locator('#nameofuser');
  }

  async clickCart(): Promise<void> {
    await this.navCartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isLoggedIn(): Promise<boolean> {
    return this.navWelcomeUser.isVisible();
  }
}