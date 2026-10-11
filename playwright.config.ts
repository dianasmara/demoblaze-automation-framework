import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // ─── Test Discovery ──────────────────────────────────────────────
  testDir: './src/tests',
  testMatch: '**/*.spec.ts',

  // ─── Execution Settings ──────────────────────────────────────────
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // ─── Reporting ───────────────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }],
    ['list'],
  ],

  // ─── Global Settings ─────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.demoblaze.com',
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    locale: 'en-US',
    timezoneId: 'Asia/Jakarta',
  },

  outputDir: 'test-results/artifacts',

  // ─── Browser / Platform Matrix ───────────────────────────────────
  projects: [
    // ── Setup (auth state) ─────────────────────────────────────────
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // ── Desktop Browsers ───────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      dependencies: ['setup'],
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   dependencies: ['setup'],
    // },

    // ── Mobile Emulation ───────────────────────────────────────────
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 14'] },
    //   dependencies: ['setup'],
    // },

    // ── Tablet ─────────────────────────────────────────────────────
    // {
    //   name: 'iPad',
    //   use: { ...devices['iPad Pro 11'] },
    //   dependencies: ['setup'],
    // },

    // ── API Tests (no browser) ─────────────────────────────────────
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { browserName: 'chromium' },
    },

    // ── Performance Tests ──────────────────────────────────────────
    {
      name: 'performance',
      testMatch: '**/performance/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], headless: true },
    },
  ],
});
