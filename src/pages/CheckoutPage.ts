/**
 * CheckoutPage.ts
 * Actions for all three checkout steps:
 *   Step 1 — Information (/checkout-step-one.html)
 *   Step 2 — Overview   (/checkout-step-two.html)
 *   Step 3 — Complete   (/checkout-complete.html)
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { checkoutPageLocators } from '../locators/checkoutPageLocators';
import { logger } from '../utils/logger';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Step 1: Information ──────────────────────────────────────────────────

  /**
   * Fills in the checkout information form and clicks Continue.
   *
   * @param firstName  - Customer first name.
   * @param lastName   - Customer last name.
   * @param postalCode - Customer postal / zip code.
   */
  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    return this.step('Fill checkout information form', async () => {
      logger.step('Filling checkout information form');
      await this.page.fill(checkoutPageLocators.firstNameInput, firstName);
      await this.page.fill(checkoutPageLocators.lastNameInput, lastName);
      await this.page.fill(checkoutPageLocators.postalCodeInput, postalCode);
      logger.info('Clicking Continue');
      await this.page.click(checkoutPageLocators.continueButton);
    });
  }

  /**
   * Returns the validation error message on the information form.
   */
  async getErrorMessage(): Promise<string> {
    return this.step('Get checkout error message', async () => {
      logger.info('Reading checkout error message');
      return this.getText(checkoutPageLocators.errorMessage);
    });
  }

  /**
   * Clicks Cancel on the information form to return to the cart.
   */
  async cancelCheckout(): Promise<void> {
    return this.step('Cancel checkout', async () => {
      logger.step('Cancelling checkout');
      await this.page.click(checkoutPageLocators.cancelButton);
    });
  }

  // ── Step 2: Overview ─────────────────────────────────────────────────────

  /**
   * Returns the names of all items listed in the order overview.
   *
   * @returns Array of item name strings.
   */
  async getOverviewItemNames(): Promise<string[]> {
    return this.step('Get overview item names', async () => {
      logger.info('Reading overview item names');
      return this.getAllTexts(checkoutPageLocators.summaryItemNames);
    });
  }

  /**
   * Returns the item total label text (e.g. "Item total: $39.98").
   */
  async getItemTotal(): Promise<string> {
    return this.getText(checkoutPageLocators.itemTotal);
  }

  /**
   * Returns the grand total label text (e.g. "Total: $43.18").
   */
  async getTotal(): Promise<string> {
    return this.getText(checkoutPageLocators.totalLabel);
  }

  /**
   * Clicks the Finish button to complete the purchase.
   */
  async finishCheckout(): Promise<void> {
    return this.step('Finish checkout', async () => {
      logger.step('Finishing checkout');
      await this.page.click(checkoutPageLocators.finishButton);
    });
  }

  // ── Step 3: Complete ─────────────────────────────────────────────────────

  /**
   * Returns the confirmation header text (e.g. "Thank you for your order!").
   */
  async getConfirmationHeader(): Promise<string> {
    return this.step('Get confirmation header', async () => {
      logger.info('Reading confirmation header');
      return this.getText(checkoutPageLocators.confirmationHeader);
    });
  }

  /**
   * Clicks "Back Home" to return to the products page.
   */
  async backToHome(): Promise<void> {
    return this.step('Back to Home', async () => {
      logger.step('Clicking Back Home');
      await this.page.click(checkoutPageLocators.backHomeButton);
    });
  }
}
