/**
 * baseFixture.ts
 * Extends Playwright's built-in `test` with page-object fixtures.
 *
 * How it works:
 *   - Every test that imports `test` from this file automatically receives
 *     pre-constructed page objects as named arguments.
 *   - The `loggedInPage` fixture logs in as the standard user so tests that
 *     need to start on the products page don't repeat the login steps.
 *
 * Usage in a spec file:
 *   import { test, expect } from '../src/fixtures/baseFixture';
 *
 *   test('my test', async ({ loginPage, productsPage }) => { ... });
 */

import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

/** Shape of the custom fixtures added to `test`. */
type PageFixtures = {
  /** Login page — use in login-related tests. */
  loginPage: LoginPage;

  /** Products / inventory page. */
  productsPage: ProductsPage;

  /** Shopping cart page. */
  cartPage: CartPage;

  /** Checkout pages (info, overview, complete). */
  checkoutPage: CheckoutPage;

  /**
   * Convenience fixture: navigates to the app and logs in as the standard user.
   * Use this in any test that needs to start on the products page.
   * Returns the ProductsPage instance so you can act on it immediately.
   */
  loggedInPage: ProductsPage;
};

export const test = base.extend<PageFixtures>({
  /**
   * Creates a LoginPage instance for the current test's page.
   */
  loginPage: async ({ page }, use) => {
    logger.info('Fixture: creating LoginPage');
    await use(new LoginPage(page));
  },

  /**
   * Creates a ProductsPage instance for the current test's page.
   */
  productsPage: async ({ page }, use) => {
    logger.info('Fixture: creating ProductsPage');
    await use(new ProductsPage(page));
  },

  /**
   * Creates a CartPage instance for the current test's page.
   */
  cartPage: async ({ page }, use) => {
    logger.info('Fixture: creating CartPage');
    await use(new CartPage(page));
  },

  /**
   * Creates a CheckoutPage instance for the current test's page.
   */
  checkoutPage: async ({ page }, use) => {
    logger.info('Fixture: creating CheckoutPage');
    await use(new CheckoutPage(page));
  },

  /**
   * Navigates to the base URL and logs in as the standard user.
   * Yields a ProductsPage so the test can act on the inventory immediately.
   */
  loggedInPage: async ({ page }, use) => {
    logger.step('Fixture: logging in as standard user');
    const loginPage = new LoginPage(page);
    await page.goto('/');
    await loginPage.loginToApplication(env.standardUser, env.password);
    await use(new ProductsPage(page));
  },
});

// Re-export expect so specs only need one import
export { expect };
