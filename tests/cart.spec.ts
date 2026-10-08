/**
 * cart.spec.ts
 * Tests for the Shopping Cart page.
 * Tags: @smoke, @regression
 */

import { test, expect } from '../src/fixtures/baseFixture';
import { cartPageLocators } from '../src/locators/cartPageLocators';

test.describe('Cart Page', () => {

  test.beforeEach(async ({ loggedInPage: _ }) => {
    // loggedInPage fixture handles navigation + login automatically
  });

  // ── Cart contents ──────────────────────────────────────────────────────────

  test('should show added items in the cart',
    { tag: ['@smoke', '@regression'] },
    async ({ productsPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.addToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();

      await expect(page.locator(cartPageLocators.title)).toHaveText('Your Cart');
      await expect(page.locator(cartPageLocators.cartItems)).toHaveCount(2);
      await expect(page.locator(cartPageLocators.itemNames).first()).toContainText('Sauce Labs Backpack');
    }
  );

  test('should show empty cart when no items added',
    { tag: '@regression' },
    async ({ productsPage, page }) => {
      await productsPage.goToCart();
      await expect(page.locator(cartPageLocators.cartItems)).toHaveCount(0);
    }
  );

  // ── Remove from cart ───────────────────────────────────────────────────────

  test('should remove an item from the cart',
    { tag: '@regression' },
    async ({ productsPage, cartPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.removeItem('Sauce Labs Backpack');
      await expect(page.locator(cartPageLocators.cartItems)).toHaveCount(0);
    }
  );

  // ── Navigation ─────────────────────────────────────────────────────────────

  test('should navigate back to products via Continue Shopping',
    { tag: '@regression' },
    async ({ productsPage, cartPage, page }) => {
      await productsPage.goToCart();
      await cartPage.continueShopping();
      await expect(page).toHaveURL(/inventory/);
    }
  );

  test('should navigate to checkout when Checkout is clicked',
    { tag: ['@smoke', '@regression'] },
    async ({ productsPage, cartPage, page }) => {
      await productsPage.addToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/checkout-step-one/);
    }
  );
});
