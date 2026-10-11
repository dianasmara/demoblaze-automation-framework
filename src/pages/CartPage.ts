import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { OrderDetails, CartItem } from '../types';
import { parsePriceToNumber } from '../utils/helpers';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Cart Table Locators ───────────────────────────────────────────────────
  get cartTable(): Locator       { return this.page.locator('#tbodyid'); }
  get cartRows(): Locator        { return this.cartTable.locator('tr'); }
  get cartTotal(): Locator       { return this.page.locator('#totalp'); }
  get placeOrderBtn(): Locator   { return this.page.locator('[data-target="#orderModal"]'); }
  get emptyCart(): Locator       { return this.page.locator('#tbodyid tr').first(); }

  cartItemByName(name: string): Locator {
    return this.page.locator('#tbodyid tr', { hasText: name }).first();
  }

  deleteButtonForItem(name: string): Locator {
    return this.cartItemByName(name).locator('a[onclick*="deleteItem"]');
  }

  // ─── Order Modal Locators ──────────────────────────────────────────────────
  get orderModal(): Locator          { return this.page.locator('#orderModal'); }
  get orderNameField(): Locator      { return this.page.locator('#name'); }
  get orderCountryField(): Locator   { return this.page.locator('#country'); }
  get orderCityField(): Locator      { return this.page.locator('#city'); }
  get orderCreditCardField(): Locator{ return this.page.locator('#card'); }
  get orderMonthField(): Locator     { return this.page.locator('#month'); }
  get orderYearField(): Locator      { return this.page.locator('#year'); }
  get purchaseBtn(): Locator         { return this.page.locator('[onclick="purchaseOrder()"]'); }
  get orderCancelBtn(): Locator      { return this.orderModal.locator('.btn-secondary'); }

  // ─── Confirmation Modal Locators ───────────────────────────────────────────
  get confirmationModal(): Locator   { return this.page.locator('.sweet-alert'); }
  get confirmationTitle(): Locator   { return this.page.locator('.sweet-alert h2'); }
  get confirmationBody(): Locator    { return this.page.locator('.sweet-alert p'); }
  get confirmationOkBtn(): Locator   { return this.page.locator('.sweet-alert .confirm'); }

  // ─── Navigate ──────────────────────────────────────────────────────────────
  async goto(): Promise<void> {
    await this.navigate('/cart.html');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500); // Cart loads asynchronously
  }

  // ─── Cart Actions ──────────────────────────────────────────────────────────
  async getCartItems(): Promise<CartItem[]> {
    await this.page.waitForTimeout(1000); // Wait for async cart load
    const rows = await this.cartRows.all();
    const items: CartItem[] = [];

    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      if (cells.length >= 3) {
        items.push({
          id: 0,
          title: cells[1]?.trim() ?? '',
          price: cells[2]?.trim() ?? '',
        });
      }
    }
    return items.filter((item) => item.title.length > 0);
  }

  async getCartItemCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    const rows = await this.cartRows.all();
    const validRows = rows.filter(async (r) => {
      const cells = await r.locator('td').count();
      return cells > 0;
    });
    return validRows.length;
  }

  async getTotalPrice(): Promise<number> {
    await this.cartTotal.waitFor({ state: 'visible', timeout: 10_000 });
    const text = (await this.cartTotal.textContent()) ?? '0';
    return parsePriceToNumber(text);
  }

  async deleteItem(productName: string): Promise<void> {
    const deleteBtn = this.deleteButtonForItem(productName);
    await deleteBtn.click();
    await this.page.waitForTimeout(1500); // Cart re-renders asynchronously
  }

  async isProductInCart(productName: string): Promise<boolean> {
    await this.page.waitForTimeout(1000);
    return this.cartItemByName(productName).isVisible();
  }

  // ─── Order Actions ─────────────────────────────────────────────────────────
  async openOrderModal(): Promise<void> {
    await this.placeOrderBtn.click();
    await this.waitForModal();
    await expect(this.orderModal).toBeVisible();
  }

  async fillOrderForm(details: OrderDetails): Promise<void> {
    await this.fillField(this.orderNameField, details.name);
    await this.fillField(this.orderCountryField, details.country);
    await this.fillField(this.orderCityField, details.city);
    await this.fillField(this.orderCreditCardField, details.creditCard);
    await this.fillField(this.orderMonthField, details.month);
    await this.fillField(this.orderYearField, details.year);
  }

  async submitOrder(): Promise<void> {
    await this.purchaseBtn.click();
  }

  async placeOrder(details: OrderDetails): Promise<void> {
    await this.openOrderModal();
    await this.fillOrderForm(details);
    await this.submitOrder();
    await this.confirmationModal.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async getConfirmationText(): Promise<string> {
    return (await this.confirmationBody.textContent()) ?? '';
  }

  async dismissConfirmation(): Promise<void> {
    await this.confirmationOkBtn.click();
    await this.confirmationModal.waitFor({ state: 'hidden', timeout: 5000 });
  }

  // ─── Assertions ────────────────────────────────────────────────────────────
  async assertCartPageLoaded(): Promise<void> {
    await expect(this.cartTable).toBeVisible({ timeout: 10_000 });
    await expect(this.placeOrderBtn).toBeVisible();
  }

  async assertItemInCart(productName: string): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.cartItemByName(productName)).toBeVisible({ timeout: 8000 });
  }

 

  async assertItemNotInCart(productName: string): Promise<void> {
    await this.page.waitForTimeout(1000);
    await expect(this.cartItemByName(productName)).not.toBeVisible();
  }

  async assertCartEmpty(): Promise<void> {
    const items = await this.getCartItems();
    expect(items).toHaveLength(0);
  }

  async assertTotalPrice(expected: number): Promise<void> {
    const actual = await this.getTotalPrice();
    expect(actual).toBe(expected);
  }

  async assertOrderModalOpen(): Promise<void> {
    await expect(this.orderModal).toBeVisible();
  }

  async assertOrderConfirmation(): Promise<void> {
    await expect(this.confirmationModal).toBeVisible({ timeout: 15_000 });
    await expect(this.confirmationTitle).toContainText('Thank you for your purchase!');
  }

  async assertConfirmationContains(field: string): Promise<void> {
    const text = await this.getConfirmationText();
    expect(text.toLowerCase()).toContain(field.toLowerCase());
  }
}
