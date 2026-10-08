/**
 * CartPage.ts
 * Actions for the Cart page (/cart.html).
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { cartPageLocators } from '../locators/cartPageLocators';
import { logger } from '../utils/logger';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Returns the page heading text (should be "Your Cart").
   */
  async getTitle(): Promise<string> {
    return this.getText(cartPageLocators.title);
  }

  /**
   * Returns the names of all items currently in the cart.
   *
   * @returns Array of item name strings.
   */
  async getCartItemNames(): Promise<string[]> {
    return this.step('Get cart item names', async () => {
      logger.info('Reading cart item names');
      return this.getAllTexts(cartPageLocators.itemNames);
    });
  }

  /**
   * Returns the number of items currently in the cart.
   */
  async getCartItemCount(): Promise<number> {
    return this.getCount(cartPageLocators.cartItems);
  }

  /**
   * Removes a specific item from the cart.
   *
   * @param productName - Exact product name as shown in the UI.
   */
  async removeItem(productName: string): Promise<void> {
    return this.step(`Remove cart item: "${productName}"`, async () => {
      logger.step(`Removing from cart: ${productName}`);
      await this.page.click(cartPageLocators.removeButton(productName));
    });
  }

  /**
   * Clicks "Continue Shopping" to go back to the products page.
   */
  async continueShopping(): Promise<void> {
    return this.step('Continue Shopping', async () => {
      logger.step('Clicking Continue Shopping');
      await this.page.click(cartPageLocators.continueShoppingButton);
    });
  }

  /**
   * Clicks "Checkout" to proceed to the checkout information form.
   */
  async proceedToCheckout(): Promise<void> {
    return this.step('Proceed to Checkout', async () => {
      logger.step('Proceeding to checkout');
      await this.page.click(cartPageLocators.checkoutButton);
    });
  }
}
