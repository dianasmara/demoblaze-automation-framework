import { Page, expect } from '@playwright/test';
import { PerformanceMetrics } from '../types';

// ─── Wait Helpers ─────────────────────────────────────────────────────────────
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function waitForModal(page: Page, title?: string): Promise<void> {
  await page.waitForSelector('.modal.show', { state: 'visible', timeout: 10_000 });
  if (title) {
    const modalTitle = page.locator('.modal-title');
    await expect(modalTitle).toContainText(title);
  }
}

export async function dismissModal(page: Page): Promise<void> {
  const closeBtn = page.locator('.modal .btn-secondary, .modal [data-dismiss="modal"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForSelector('.modal.show', { state: 'hidden', timeout: 5000 });
  }
}

// ─── Alert Helpers ────────────────────────────────────────────────────────────
export async function acceptAlert(page: Page): Promise<string> {
  return new Promise((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      resolve(message);
    });
  });
}

export async function getAlertText(page: Page): Promise<string> {
  return new Promise((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      resolve(message);
    });
  });
}

// ─── Local Storage Helpers ────────────────────────────────────────────────────
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k: string) => localStorage.getItem(k), key);
}

export async function setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(({ k, v }: { k: string; v: string }) => localStorage.setItem(k, v), { k: key, v: value });
}

export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────
export async function getCookieValue(page: Page, name: string): Promise<string | undefined> {
  const cookies = await page.context().cookies();
  return cookies.find((c) => c.name === name)?.value;
}

// ─── Price Helpers ────────────────────────────────────────────────────────────
export function parsePriceToNumber(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, ''));
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

// ─── Performance Metrics ──────────────────────────────────────────────────────
export async function collectPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find((e) => e.name === 'first-contentful-paint')?.startTime ?? 0;
    const ttfb = nav.responseStart - nav.requestStart;
    const domLoad = nav.domContentLoadedEventEnd - nav.startTime;
    const fullLoad = nav.loadEventEnd - nav.startTime;

    return { ttfb, fcp, domLoad, fullLoad };
  });

  return {
    ttfb: metrics.ttfb,
    fcp: metrics.fcp,
    lcp: 0, // captured separately via PerformanceObserver
    tti: 0, // approximated as fullLoad
    cls: 0, // captured separately
    domLoad: metrics.domLoad,
    fullLoad: metrics.fullLoad,
  };
}

// ─── Retry Helper ─────────────────────────────────────────────────────────────
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

// ─── Random Data Generators ───────────────────────────────────────────────────
export function generateRandomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function generateRandomEmail(): string {
  return `test.${generateRandomString()}@example.com`;
}

export function generateRandomUsername(): string {
  return `user_${generateRandomString()}`;
}

// ─── Screenshot Helper ────────────────────────────────────────────────────────
export async function takeScreenshot(page: Page, name: string): Promise<Buffer> {
  return page.screenshot({
    path: `test-results/artifacts/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

// ─── Scroll Helper ────────────────────────────────────────────────────────────
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

// ─── Assertion Wrappers ───────────────────────────────────────────────────────
export async function assertPageTitle(page: Page, expected: string): Promise<void> {
  await expect(page).toHaveTitle(expected);
}

export async function assertUrlContains(page: Page, path: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(path));
}
