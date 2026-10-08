/**
 * products.spec.ts
 * Tests for the Products / Inventory page.
 * Tags: @smoke, @regression
 */

import { test, expect } from '../src/fixtures/baseFixture';
import { productsPageLocators } from '../src/locators/productsPageLocators';
import { readTestData } from '../src/utils/fileUtils';
import { parsePrice } from '../src/utils/dataUtils';

const productsData = readTestData<{
  allProducts: string[];
  sortOptions: { nameAZ: string; nameZA: string; priceLowHigh: string; priceHighLow: string };
}>('products.json');

test.describe('Products Page', () => {

  test.beforeEach(async ({ loggedInPage: _ }) => {
    // loggedInPage fixture handles navigation + login automatically
  });

  // ── Page load ──────────────────────────────────────────────────────────────

  test('should display the Products page heading',
    { tag: ['@smoke', '@regression'] },
    async ({ page }) => {
      await expect(page.locator(productsPageLocators.title)).toHaveText('Products');
    }
  );

  test('should display all 6 products',
    { tag: ['@smoke', '@regression'] },
    async ({ page }) => {
      await expect(page.locator(productsPageLocators.productItems)).toHaveCount(6);
    }
  );

  // ── Sorting ────────────────────────────────────────────────────────────────

  test('should sort products A → Z',
    { tag: '@regression' },
    async ({ productsPage }) => {
      await productsPage.sortProducts(productsData.sortOptions.nameAZ);
      const names = await productsPage.getProductNames();
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    }
  );

  test('should sort products Z → A',
    { tag: '@regression' },
    async ({ productsPage }) => {
      await productsPage.sortProducts(productsData.sortOptions.nameZA);
      const names = await productsPage.getProductNames();
      const sorted = [...names].sort().reverse();
      expect(names).toEqual(sorted);
    }
  );

  test('should sort products price low → high',
    { tag: '@regression' },
    async ({ productsPage }) => {
      await productsPage.sortProducts(productsData.sortOptions.priceLowHigh);
      const prices = await productsPage.getProductPrices();
      const parsed = prices.map(parsePrice);
      const sorted = [...parsed].sort((a, b) => a - b);
      expect(parsed).toEqual(sorted);
    }
  );

  test('should sort products price high → low',
    { tag: '@regression' },
    async ({ productsPage }) => {
      await productsPage.sortProducts(productsData.sortOptions.priceHighLow);
      const prices = await productsPage.getProductPrices();
      const parsed = prices.map(parsePrice);
      const sorted = [...parsed].sort((a, b) => b - a);
      expect(parsed).toEqual(sorted);
    }
  );

  // ── Add / remove from cart ─────────────────────────────────────────────────

  test('should add a product to the cart and update the badge',
    { tag: ['@smoke', '@regression'] },
    async ({ productsPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await expect(page.locator(productsPageLocators.cartBadge)).toHaveText('1');
    }
  );

  test('should remove a product from the cart and clear the badge',
    { tag: '@regression' },
    async ({ productsPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.removeFromCart('Sauce Labs Backpack');
      await expect(page.locator(productsPageLocators.cartBadge)).not.toBeVisible();
    }
  );

  test('should add multiple products and show correct badge count',
    { tag: '@regression' },
    async ({ productsPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.addToCart('Sauce Labs Bike Light');
      await expect(page.locator(productsPageLocators.cartBadge)).toHaveText('2');
    }
  );
});
