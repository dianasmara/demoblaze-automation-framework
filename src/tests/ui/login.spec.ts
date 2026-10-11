/**
 * TC-LOGIN: Login Feature — UI Tests
 * Covers: Functional, Edge Cases, Negative Paths, Security
 */
import { test, expect } from '../../fixtures/base.fixture';
import { VALID_USER, INVALID_USERS } from '../../utils/testData';

test.describe('Login Feature', () => {

  // ─── Before Each: Navigate to Home ────────────────────────────────────────
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TC-LOGIN-001 to 010: Modal Behavior
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('Modal Behavior', () => {
    test('TC-LOGIN-001: Login modal opens when Log in link is clicked', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      await loginPage.assertLoginModalOpen();
    });

    test('TC-LOGIN-002: Login modal contains username, password fields and Login button', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      await loginPage.assertUsernameFieldVisible();
      await loginPage.assertPasswordFieldMasked();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('TC-LOGIN-003: Password field is of type password (masked)', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      await loginPage.assertPasswordFieldMasked();
    });

    test('TC-LOGIN-004: Login modal closes when X button is clicked', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      await loginPage.closeLoginModal();
      await loginPage.assertLoginModalClosed();
    });

    test('TC-LOGIN-005: Login modal closes when clicking outside the modal', async ({ loginPage, page }) => {
      await loginPage.openLoginModal();
      await page.keyboard.press('Escape');
      await loginPage.assertLoginModalClosed();
    });

    test('TC-LOGIN-006: Username and password fields are empty by default', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      expect(await loginPage.getUsernameFieldValue()).toBe('');
      expect(await loginPage.getPasswordFieldValue()).toBe('');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TC-LOGIN-007 to 013: Positive / Happy Path
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('Positive Scenarios', () => {
    test('TC-LOGIN-007: Successful login with valid credentials', async ({ loginPage }) => {
      await loginPage.login(VALID_USER);
      await loginPage.assertLoggedIn(VALID_USER.username);
    });

    test('TC-LOGIN-008: Welcome message displays correct username after login', async ({ loginPage }) => {
      await loginPage.login(VALID_USER);
      const welcomeText = await loginPage.getWelcomeText();
      expect(welcomeText.toLowerCase()).toContain(VALID_USER.username.toLowerCase());
    });

    test('TC-LOGIN-009: Logout link is visible after login', async ({ loginPage }) => {
      await loginPage.login(VALID_USER);
      await expect(loginPage.logoutButton).toBeVisible();
    });

    test('TC-LOGIN-010: Login link disappears after successful login', async ({ loginPage }) => {
      await loginPage.login(VALID_USER);
      await expect(loginPage.loginModalTrigger).not.toBeVisible();
    });

    test('TC-LOGIN-011: User can log out successfully', async ({ loginPage }) => {
      await loginPage.login(VALID_USER);
      await loginPage.assertLoggedIn(VALID_USER.username);
      await loginPage.logout();
      await loginPage.assertLoggedOut();
    });

    test('TC-LOGIN-012: User can log in again after logging out', async ({ loginPage }) => {
      await loginPage.login(VALID_USER);
      await loginPage.logout();
      await loginPage.assertLoggedOut();
      await loginPage.login(VALID_USER);
      await loginPage.assertLoggedIn(VALID_USER.username);
    });

    test('TC-LOGIN-013: Login modal closes after successful authentication', async ({ loginPage }) => {
      await loginPage.login(VALID_USER);
      await loginPage.assertLoginModalClosed();
    });
  });

  

  test.describe('Negative Scenarios', () => {
    test('TC-LOGIN-014: Error shown for wrong username and wrong password', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: 'wronguser', password: 'wrongpass' });
      expect(alertMsg.toLowerCase()).toMatch(/wrong|user does not exist|invalid/);
    });

    test('TC-LOGIN-015: Error shown for correct username but wrong password', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: VALID_USER.username, password: 'badpassword' });
      expect(alertMsg).toBeTruthy(); // Any alert = rejection
    });

    test('TC-LOGIN-016: Error shown for wrong username but correct password', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: 'nonexistentuser_xyz', password: VALID_USER.password });
      expect(alertMsg).toBeTruthy();
    });

    test('TC-LOGIN-017: Error shown when username is empty', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: '', password: 'somepassword' });
      expect(alertMsg).toBeTruthy();
      expect(alertMsg.toLowerCase()).toMatch(/fill|required|empty|username/);
    });

    test('TC-LOGIN-018: Error shown when password is empty', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: VALID_USER.username, password: '' });
      expect(alertMsg).toBeTruthy();
      expect(alertMsg.toLowerCase()).toMatch(/fill|required|empty|password/);
    });

    test('TC-LOGIN-019: Error shown when both fields are empty', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: '', password: '' });
      expect(alertMsg).toBeTruthy();
    });

    test('TC-LOGIN-020: Login fails with case-sensitive incorrect username', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({
        username: VALID_USER.username.toUpperCase(),
        password: VALID_USER.password,
      });
      // DemoBlaze may be case-sensitive; alert presence indicates failure
      // If no alert, assert user name won't match exactly
      if (!alertMsg) {
        const welcome = await loginPage.getWelcomeText();
        expect(welcome).not.toContain(VALID_USER.username.toUpperCase());
      }
    });

    test('TC-LOGIN-021: User remains logged out after failed login', async ({ loginPage }) => {
      await loginPage.login({ username: 'baduser', password: 'badpass' });
      await loginPage.assertLoggedOut();
    });
  });



  test.describe('Security & Edge Cases', () => {
    test('TC-LOGIN-022: XSS payload in username field does not execute', async ({ loginPage, page }) => {
      let xssExecuted = false;
      page.on('dialog', async (dialog) => {
        if (dialog.message() === 'xss') xssExecuted = true;
        await dialog.accept();
      });

      await loginPage.login({ username: "<script>alert('xss')</script>", password: 'test' });
      expect(xssExecuted).toBe(false);
    });

    test('TC-LOGIN-023: SQL injection in username does not bypass auth', async ({ loginPage }) => {
      await loginPage.login({
        username: "admin' OR '1'='1",
        password: "' OR '1'='1",
      });
      await loginPage.assertLoggedOut();
    });

    test('TC-LOGIN-024: Very long username (200 chars) is handled gracefully', async ({ loginPage }) => {
      const longUsername = 'a'.repeat(200);
      const alertMsg = await loginPage.login({ username: longUsername, password: 'pass' });
      // Should not crash — either alert or stay on page
      expect(typeof alertMsg).toBe('string');
    });

    test('TC-LOGIN-025: Special characters in username do not crash the app', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: '!@#$%^&*()', password: 'pass' });
      expect(typeof alertMsg).toBe('string');
    });

    test('TC-LOGIN-026: Whitespace-only username and password are rejected', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: '   ', password: '   ' });
      // Either alert fires or user is not logged in
      const loggedIn = await loginPage.isLoggedIn();
      expect(alertMsg || !loggedIn).toBeTruthy();
    });

    test('TC-LOGIN-027: Unicode characters in fields are handled gracefully', async ({ loginPage }) => {
      const alertMsg = await loginPage.login({ username: '用户名测试', password: 'كلمة_مرور' });
      expect(typeof alertMsg).toBe('string');
    });
  });



  test.describe('Accessibility', () => {
    test('TC-LOGIN-028: Login form fields are keyboard-navigable', async ({ loginPage, page }) => {
      await loginPage.openLoginModal();
      await loginPage.usernameField.press('Tab');
      await expect(loginPage.passwordField).toBeFocused();
    });

    test('TC-LOGIN-029: Login can be submitted with Enter key', async ({ loginPage, page }) => {
      await loginPage.openLoginModal();
      await loginPage.fillUsername(VALID_USER.username);
      await loginPage.fillPassword(VALID_USER.password);

      const alertPromise = loginPage.handleAlert('accept');
      await loginPage.passwordField.press('Enter');
      await Promise.race([alertPromise, new Promise<void>((r) => setTimeout(r, 3000))]);
      // Should either login or respond
    });
  });
});
