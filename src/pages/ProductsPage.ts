/**
 * ProductsPage.ts
 * Actions for the Products / Inventory page (/inventory.html).
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { productsPageLocators } from '../locators/productsPageLocators';
import { logger } from '../utils/logger';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Returns the page heading text (should be "Products").
   */
  async getTitle(): Promise<string> {
    return this.getText(productsPageLocators.title);
  }

  /**
   * Selects a sort option from the dropdown.
   *
   * @param value - The option value, e.g. "az", "za", "lohi", "hilo".
   */
  async sortProducts(value: string): Promise<void> {
    return this.step(`Sort products by "${value}"`, async () => {
      logger.step(`Sorting products by: ${value}`);
      await this.page.selectOption(productsPageLocators.sortDropdown, value);
    });
  }

  /**
   * Returns all visible product names in their current display order.
   *
   * @returns Array of product name strings.
   */
  async getProductNames(): Promise<string[]> {
    logger.info('Reading all product names');
    return this.getAllTexts(productsPageLocators.productNames);
  }

  /**
   * Returns all visible product price strings (e.g. ["$9.99", "$29.99"]).
   *
   * @returns Array of price strings.
   */
  async getProductPrices(): Promise<string[]> {
    logger.info('Reading all product prices');
    return this.getAllTexts(productsPageLocators.productPrices);
  }

  /**
   * Clicks the "Add to cart" button for the named product.
   *
   * @param productName - Exact product name as shown in the UI.
   */
  async addToCart(productName: string): Promise<void> {
    return this.step(`Add to cart: "${productName}"`, async () => {
      logger.step(`Adding to cart: ${productName}`);
      await this.page.click(productsPageLocators.addToCartButton(productName));
    });
  }

  /**
   * Clicks the "Remove" button for the named product (visible after adding).
   *
   * @param productName - Exact product name as shown in the UI.
   */
  async removeFromCart(productName: string): Promise<void> {
    return this.step(`Remove from cart: "${productName}"`, async () => {
      logger.step(`Removing from cart: ${productName}`);
      await this.page.click(productsPageLocators.removeButton(productName));
    });
  }

  /**
   * Returns the number shown on the cart badge (0 if badge is not visible).
   */
  async getCartCount(): Promise<number> {
    const badge = this.page.locator(productsPageLocators.cartBadge);
    const visible = await badge.isVisible();
    if (!visible) return 0;
    const text = await badge.innerText();
    return parseInt(text, 10);
  }

  /**
   * Clicks the shopping cart icon to navigate to the cart page.
   */
  async goToCart(): Promise<void> {
    return this.step('Go to cart', async () => {
      logger.step('Navigating to cart');
      await this.page.click(productsPageLocators.cartIcon);
    });
  }

  /**
   * Opens the burger menu and clicks Logout.
   */
  async logout(): Promise<void> {
    return this.step('Logout', async () => {
      logger.step('Logging out');
      await this.page.click(productsPageLocators.menuButton);
      await this.page.click(productsPageLocators.logoutLink);
    });
  }
}
