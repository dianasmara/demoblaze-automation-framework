/**
 * Auth Setup — Runs once before all tests to establish
 * an authenticated browser state that is then reused.
 * This prevents repeated login across test runs.
 */
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VALID_USER } from '../utils/testData';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '../../.auth/user.json');

setup('authenticate as valid user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');
  await loginPage.openLoginModal();
  await loginPage.fillUsername(VALID_USER.username);
  await loginPage.fillPassword(VALID_USER.password);

  // Handle the alert that may appear
  const alertPromise = loginPage.handleAlert('accept');
  await loginPage.submitLogin();
  await Promise.race([
    alertPromise,
    new Promise<void>((resolve) => setTimeout(resolve, 2000)),
  ]);

  // Confirm login succeeded
  await expect(loginPage.welcomeUser).toBeVisible({ timeout: 10_000 });

  // Save the browser storage state for reuse
  await page.context().storageState({ path: AUTH_FILE });
});
