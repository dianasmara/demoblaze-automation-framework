import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Credentials } from '../types';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ──────────────────────────────────────────────────────────────
  get loginModalTrigger(): Locator { return this.page.locator('#login2'); }
  get loginModal(): Locator        { return this.page.locator('#logInModal'); }
  get usernameField(): Locator     { return this.page.locator('#loginusername'); }
  get passwordField(): Locator     { return this.page.locator('#loginpassword'); }
  get loginButton(): Locator       { return this.page.locator('[onclick="logIn()"]'); }
  get closeButton(): Locator       { return this.loginModal.locator('button.close'); }
  get modalTitle(): Locator        { return this.page.locator('#logInModal .modal-title'); }
  get welcomeUser(): Locator       { return this.page.locator('#nameofuser'); }
  get logoutButton(): Locator      { return this.page.locator('#logout2'); }

  // ─── Actions ───────────────────────────────────────────────────────────────
  async openLoginModal(): Promise<void> {
    await this.loginModalTrigger.click();
    await this.waitForModal();
    await expect(this.loginModal).toBeVisible();
  }

  async fillUsername(username: string): Promise<void> {
    await this.fillField(this.usernameField, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fillField(this.passwordField, password);
  }

  async submitLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Full login flow — opens modal, fills credentials, submits.
   * Returns the alert message if one appears, else empty string.
   */
  // async login(credentials: Credentials): Promise<string> {
  //   await this.openLoginModal();
  //   await this.fillUsername(credentials.username);
  //   await this.fillPassword(credentials.password);

  //   const alertPromise = this.handleAlert('accept');
  //   await this.submitLogin();

  //   // Race: either alert fires quickly, or we consider login accepted
  //   const alertMessage = await Promise.race([
  //     alertPromise,
  //     new Promise<string>((resolve) => setTimeout(() => resolve(''), 5000)),
  //   ]);

  //   return alertMessage;
  // }

  async login(user: Credentials): Promise<string> {
    await this.openLoginModal();
    await this.fillField(this.usernameField, user.username);
    await this.fillField(this.passwordField, user.password);
    
    // Klik tombol login tanpa menunggu alert dialog
    await this.loginButton.click();
    
    // Tunggu modal tertutup atau teks welcome muncul sebagai indikator sukses login
    await this.page.waitForSelector('#logInModal', { state: 'hidden', timeout: 10_000 }).catch(() => {});
    await this.page.waitForSelector('#nameofuser', { state: 'visible', timeout: 10_000 }).catch(() => {});
    
    return ''; // Mengembalikan string kosong karena tidak ada alert dialog
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async closeLoginModal(): Promise<void> {
    await this.closeButton.click();
    await this.waitForHidden('#logInModal');
  }

  // ─── Assertions ────────────────────────────────────────────────────────────
  async assertLoginModalOpen(): Promise<void> {
    await expect(this.loginModal).toBeVisible();
    await expect(this.modalTitle).toHaveText('Log in');
  }

  async assertLoginModalClosed(): Promise<void> {
    await expect(this.loginModal).not.toBeVisible();
  }

  async assertLoggedIn(username: string): Promise<void> {
    await expect(this.welcomeUser).toBeVisible({ timeout: 8000 });
    await expect(this.welcomeUser).toContainText(`Welcome ${username}`, { ignoreCase: true });
    await expect(this.logoutButton).toBeVisible();
    await expect(this.loginModalTrigger).not.toBeVisible();
  }

  async assertLoggedOut(): Promise<void> {
    await expect(this.loginModalTrigger).toBeVisible({ timeout: 5000 });
    await expect(this.logoutButton).not.toBeVisible();
    await expect(this.welcomeUser).not.toBeVisible();
  }

  async assertUsernameFieldVisible(): Promise<void> {
    await expect(this.usernameField).toBeVisible();
  }

  async assertPasswordFieldMasked(): Promise<void> {
    await expect(this.passwordField).toHaveAttribute('type', 'password');
  }

  async getWelcomeText(): Promise<string> {
    return (await this.welcomeUser.textContent()) ?? '';
  }

  async getUsernameFieldValue(): Promise<string> {
    return this.usernameField.inputValue();
  }

  async getPasswordFieldValue(): Promise<string> {
    return this.passwordField.inputValue();
  }
}
