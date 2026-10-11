/**
 * Regression Suite — Critical Happy-Path Tests
 * Run after every deployment to catch regressions fast.
 * Covers the most business-critical flows only.
 */
import { test, expect } from '../../fixtures/base.fixture';
import { VALID_USER, VALID_ORDER, PRODUCTS } from '../../utils/testData';
import { parsePriceToNumber } from '../../utils/helpers';

test.describe('@regression Critical Flows', () => {

  // ─── REG-001: Login ────────────────────────────────────────────────────────
  test('REG-001: User can log in with valid credentials', async ({ homePage, loginPage }) => {
    await homePage.goto();
    await loginPage.login(VALID_USER);
    await loginPage.assertLoggedIn(VALID_USER.username);
  });

  // ─── REG-002: Logout ────────────────────────────────────────────────────────
  test('REG-002: User can log out', async ({ homePage, loginPage }) => {
    await homePage.goto();
    await loginPage.login(VALID_USER);
    await loginPage.logout();
    await loginPage.assertLoggedOut();
  });

  // ─── REG-003: Product Categories ───────────────────────────────────────────
  test('REG-003: All three product categories load products', async ({ homePage }) => {
    await homePage.goto();

    for (const cat of ['Phones', 'Laptops', 'Monitors'] as const) {
      await homePage.clickCategory(cat);
      const count = await homePage.getProductCount();
      expect(count, `${cat} should have products`).toBeGreaterThan(0);
    }
  });

  // ─── REG-004: Product Detail ────────────────────────────────────────────────
  test('REG-004: Product detail page loads with name, price, and Add to Cart', async ({
    homePage, productPage,
  }) => {
    await homePage.goto();
    await homePage.clickCategory('Phones');
    await homePage.clickProduct(PRODUCTS.PHONE.name);
    await productPage.assertProductLoaded();
  });

  // ─── REG-005: Add to Cart ────────────────────────────────────────────────────
  test('REG-005: Product can be added to cart', async ({
    homePage, loginPage, productPage, cartPage,
  }) => {
    await homePage.goto();
    await loginPage.login(VALID_USER);
    await homePage.clickCategory('Phones');
    await homePage.clickProduct(PRODUCTS.PHONE.name);
    const message = await productPage.addToCart();
    expect(message.toLowerCase()).toContain('product added');
  });

  // ─── REG-006: Cart Page ──────────────────────────────────────────────────────
  test('REG-006: Cart page loads and shows added items', async ({
    homePage, loginPage, productPage, cartPage,
  }) => {
    await homePage.goto();
    await loginPage.login(VALID_USER);
    await homePage.clickCategory('Phones');
    await homePage.clickProduct(PRODUCTS.PHONE.name);
    await productPage.addToCartAndConfirm();

    await cartPage.goto();
    await cartPage.assertCartPageLoaded();
    await cartPage.assertItemInCart(PRODUCTS.PHONE.name);
  });

  // ─── REG-007: Delete from Cart ──────────────────────────────────────────────
  test('REG-007: Item can be deleted from cart', async ({
    homePage, loginPage, productPage, cartPage,
  }) => {
    await homePage.goto();
    await loginPage.login(VALID_USER);
    await homePage.clickCategory('Phones');
    await homePage.clickProduct(PRODUCTS.PHONE.name);
    await productPage.addToCartAndConfirm();

    await cartPage.goto();
    await cartPage.deleteItem(PRODUCTS.PHONE.name);
    await cartPage.assertItemNotInCart(PRODUCTS.PHONE.name);
  });

  // ─── REG-008: Place Order ────────────────────────────────────────────────────
  test('REG-008: Complete order placement shows confirmation', async ({
    homePage, loginPage, productPage, cartPage,
  }) => {
    await homePage.goto();
    await loginPage.login(VALID_USER);
    await homePage.clickCategory('Phones');
    await homePage.clickProduct(PRODUCTS.PHONE.name);
    await productPage.addToCartAndConfirm();

    await cartPage.goto();
    await cartPage.placeOrder(VALID_ORDER);
    await cartPage.assertOrderConfirmation();
  });

  // ─── REG-009: Login Error ───────────────────────────────────────────────────
  test('REG-009: Invalid login shows error and keeps user logged out', async ({
    homePage, loginPage,
  }) => {
    await homePage.goto();
    const alertMsg = await loginPage.login({ username: 'bad_user', password: 'bad_pass' });
    expect(alertMsg).toBeTruthy();
    await loginPage.assertLoggedOut();
  });

  // ─── REG-010: Home Page Load ────────────────────────────────────────────────
  test('REG-010: Homepage loads with products visible', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertPageLoaded();
    const count = await homePage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });
});
